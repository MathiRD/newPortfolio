"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clearAdminSession, createAdminSession } from "@/lib/auth";

function parseTechStack(formData: FormData): string[] {
  return String(formData.get("techStack") ?? "")
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);
}

export async function loginAdmin(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=invalid_credentials");
  }

  await createAdminSession();
  redirect("/admin/dashboard");
}

export async function logoutAdmin(): Promise<void> {
  clearAdminSession();
  redirect("/admin");
}

export async function createProject(formData: FormData): Promise<void> {
  await prisma.project.create({
    data: {
      titleEn: String(formData.get("titleEn") ?? ""),
      titlePt: String(formData.get("titlePt") ?? ""),
      descriptionEn: String(formData.get("descriptionEn") ?? ""),
      descriptionPt: String(formData.get("descriptionPt") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? "") || null,
      githubUrl: String(formData.get("githubUrl") ?? "") || null,
      liveUrl: String(formData.get("liveUrl") ?? "") || null,
      techStack: parseTechStack(formData),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on"
    }
  });

  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function updateProject(projectId: string, formData: FormData): Promise<void> {
  await prisma.project.update({
    where: { id: projectId },
    data: {
      titleEn: String(formData.get("titleEn") ?? ""),
      titlePt: String(formData.get("titlePt") ?? ""),
      descriptionEn: String(formData.get("descriptionEn") ?? ""),
      descriptionPt: String(formData.get("descriptionPt") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? "") || null,
      githubUrl: String(formData.get("githubUrl") ?? "") || null,
      liveUrl: String(formData.get("liveUrl") ?? "") || null,
      techStack: parseTechStack(formData),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on"
    }
  });

  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function deleteProject(projectId: string): Promise<void> {
  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { read: true }
  });

  revalidatePath("/admin/messages");
}

export async function deleteContactMessage(messageId: string): Promise<void> {
  await prisma.contactMessage.delete({ where: { id: messageId } });
  revalidatePath("/admin/messages");
}
