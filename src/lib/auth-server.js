// lib/auth-server.js

import { cookies } from "next/headers";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "./auth";

export async function getAuthFromCookies() {
  // cookies() is synchronous in the app router
  const cookieStore = await cookies();

  // DO NOT use await here
  const token = await cookieStore.get(AUTH_COOKIE_NAME)?.value || null;

  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload || !payload.sub || !payload.role) return null;

  return {
    userId: payload.sub,
    role: payload.role,
  };
}

export async function requireRole(requiredRole) {
  const auth = await getAuthFromCookies();

  if (!auth || auth.role !== requiredRole) {
    return null;
  }

  return auth;
}
