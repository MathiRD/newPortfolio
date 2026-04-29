import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const adminCookieName = "portfolio_admin_session";

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "development-secret");
}

export async function createAdminSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecret());

  cookies().set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(adminCookieName)?.value;
  if (!token) return false;

  try {
    const result = await jwtVerify(token, getJwtSecret());
    return result.payload.role === "admin";
  } catch {
    return false;
  }
}

export function clearAdminSession(): void {
  cookies().delete(adminCookieName);
}
