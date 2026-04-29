import { headers } from "next/headers";

export function getClientIpAddress(): string {
  const headerStore = headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return realIp || "unknown";
}

export function getUserAgent(): string {
  return headers().get("user-agent") || "unknown";
}
