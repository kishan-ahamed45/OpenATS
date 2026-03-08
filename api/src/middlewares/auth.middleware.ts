import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

const JWKS = createRemoteJWKSet(
  new URL(process.env.ASGARDEO_JWKS_URL!)
);

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

  const token = authHeader.slice(7); // "Bearer ".length === 7, always a string

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.ASGARDEO_ISSUER!,
    });

    const sub = payload.sub;
    if (!sub) {
      res.status(401).json({ error: "Invalid token: missing sub claim" });
      return;
    }

    // Look up the user in the DB by their Asgardeo sub claim
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.asgardeoUserId, sub))
      .limit(1);

    // Auto-provision: create the user on first login using token claims
    if (!user) {
      const email = payload["email"] as string | undefined;
      const firstName = (payload["given_name"] as string | undefined) ?? "Unknown";
      const lastName = (payload["family_name"] as string | undefined) ?? "User";

      if (!email) {
        res.status(403).json({ error: "Token missing required email claim" });
        return;
      }

      [user] = await db
        .insert(users)
        .values({ asgardeoUserId: sub, firstName, lastName, email, role: "interviewer" })
        .returning();

      if (!user) {
        res.status(500).json({ error: "Failed to provision user" });
        return;
      }
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