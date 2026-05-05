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
  const normalizedEmail = parsed.data.email.toLowerCase();

  const isRateLimited = await checkContactRateLimit({
    ipAddress,
    email: normalizedEmail,
    cooldownSeconds
  });

  if (isRateLimited) {
    return { status: "rate_limited" };
  }

  await prisma.contactMessage.create({
    data: {
      ...parsed.data,
      email: normalizedEmail,
      ipAddress,
      userAgent
    }
  });

  return { status: "success" };
}

async function checkContactRateLimit({
  ipAddress,
  email,
  cooldownSeconds
}: {
  ipAddress: string;
  email: string;
  cooldownSeconds: number;
}): Promise<boolean> {
  const rateLimitKeys = [
    `portfolio:contact-rate:ip:${ipAddress}`,
    `portfolio:contact-rate:email:${email}`
  ];

  const redisClient = redis;

  if (redisClient) {
    try {
      const results = await Promise.all(
        rateLimitKeys.map((key) =>
          redisClient.set(key, "1", "EX", cooldownSeconds, "NX")
        )
      );

      const hasAlreadySubmitted = results.some((result) => result !== "OK");

      if (hasAlreadySubmitted) {
        return true;
      }

      return false;
    } catch {
      // If Redis is unavailable in production, use database fallback below.
    }
  }

  const recentMessage = await prisma.contactMessage.findFirst({
    where: {
      OR: [{ email }, { ipAddress }],
      createdAt: {
        gte: new Date(Date.now() - cooldownSeconds * 1000)
      }
    },
    select: { id: true }
  });

  return Boolean(recentMessage);
}
