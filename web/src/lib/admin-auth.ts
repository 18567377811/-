import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "feltora_admin";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export async function createAdminSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    const error = new Error("Unauthorized");
    (error as Error & { status: number }).status = 401;
    throw error;
  }
}

export function adminCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
