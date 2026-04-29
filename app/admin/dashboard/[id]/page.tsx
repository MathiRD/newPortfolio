import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/project-form";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) redirect("/admin/dashboard");

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Edit project</h1>
        <Link href="/admin/dashboard" className="button-soft rounded-full px-4 py-2 text-sm font-bold">
          Back
        </Link>
      </div>
      <ProjectForm project={project} action={updateProject.bind(null, project.id)} />
    </main>
  );
}
