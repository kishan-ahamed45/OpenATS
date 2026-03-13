"use server";

import { asgardeo } from "@asgardeo/nextjs/server";
import { apiFetch } from "./api";

export async function serverFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const client = await asgardeo();
  const sessionId = await client.getSessionId();
  if (!sessionId) throw new Error("Not authenticated");
  const token = await client.getAccessToken(sessionId);
  return apiFetch<T>(path, token, options);
}
