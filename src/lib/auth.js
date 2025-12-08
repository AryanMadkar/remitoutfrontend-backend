// lib/auth.js

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

// IMPORTANT: always call with an object: signAuthToken({ userId, role })
export function signAuthToken({ userId, role }) {
  return jwt.sign({ sub: String(userId), role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY_SECONDS,
  });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_MAX_AGE = TOKEN_EXPIRY_SECONDS;
