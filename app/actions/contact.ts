"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getClientIpAddress, getUserAgent } from "@/lib/request";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(1200)
});

export type ContactFormState = {
  status: "idle" | "success" | "error" | "rate_limited";
  message?: string;
};

export async function submitContactMessage(
  previousState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Invalid contact data."
    };
  }

  const ipAddress = getClientIpAddress();
  const userAgent = getUserAgent();
  const cooldownSeconds = Number(process.env.CONTACT_RATE_LIMIT_SECONDS ?? 3600);
  const rateLimitKey = `portfolio:contact-rate:${ipAddress}:${parsed.data.email.toLowerCase()}`;

  if (redis) {
    try {
      const wasCreated = await redis.set(rateLimitKey, "1", "EX", cooldownSeconds, "NX");
      if (wasCreated !== "OK") {
        return { status: "rate_limited" };
      }
    } catch {
      // Falls back to database check below.
    }
  }

  if (!redis) {
    const recentMessage = await prisma.contactMessage.findFirst({
      where: {
        email: parsed.data.email,
        ipAddress,
        createdAt: {
          gte: new Date(Date.now() - cooldownSeconds * 1000)
        }
      }
    });

    if (recentMessage) {
      return { status: "rate_limited" };
    }
  }

  await prisma.contactMessage.create({
    data: {
      ...parsed.data,
      ipAddress,
      userAgent
    }
  });

  return { status: "success" };
}
