import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

const JWKS = createRemoteJWKSet(
  new URL(process.env.ASGARDEO_JWKS_URL!)
);

function mapAsgardeoRole(roles: string[]): "super_admin" | "hiring_manager" | "interviewer" {
  if (roles.includes("Super Admin")) return "super_admin";
  if (roles.includes("Hiring Manager")) return "hiring_manager";
  if (roles.includes("Interviewer")) return "interviewer";
  return "interviewer";
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.ASGARDEO_ISSUER!,
    });

    const sub = payload.sub;
    if (!sub) {
      res.status(401).json({ error: "Invalid token: missing sub claim" });
      return;
    }

    const tokenRoles = (payload["roles"] as string[] | undefined) ?? [];
    const role = mapAsgardeoRole(tokenRoles);

    const email = payload["email"] as string | undefined;
    const firstName = (payload["given_name"] as string | undefined) ?? "Unknown";
    const lastName = (payload["family_name"] as string | undefined) ?? "User";

    if (!email) {
      res.status(403).json({ error: "Token missing required email claim" });
      return;
    }

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.asgardeoUserId, sub))
      .limit(1);

    if (!user) {
      // first login — provision with role from token
      [user] = await db
        .insert(users)
        .values({ asgardeoUserId: sub, firstName, lastName, email, role })
        .returning();

      if (!user) {
        res.status(500).json({ error: "Failed to provision user" });
        return;
      }
    } else {
      // existing user — sync role + profile from token in case anything changed
      const [updated] = await db
        .update(users)
        .set({ role, firstName, lastName, email, updatedAt: new Date() })
        .where(eq(users.asgardeoUserId, sub))
        .returning();

      if (!updated) {
        res.status(500).json({ error: "Failed to sync user" });
        return;
      }

      user = updated;
    }

    if (!user.isActive) {
      res.status(403).json({ error: "User account is deactivated" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};