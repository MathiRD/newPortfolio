import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/project-form";

export default async function NewProjectPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black">New project</h1>
        <Link href="/admin/dashboard" className="button-soft rounded-full px-4 py-2 text-sm font-bold">
          Back
        </Link>
      </div>
      <ProjectForm action={createProject} />
    </main>
  );
}
