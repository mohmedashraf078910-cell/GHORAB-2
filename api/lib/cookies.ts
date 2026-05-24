import type { CookieOptions } from "hono/cookie";

export function getSessionCookieOptions(_headers?: Headers): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  };
}
