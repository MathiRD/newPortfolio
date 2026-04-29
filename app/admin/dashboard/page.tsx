import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteProject, logoutAdmin } from "@/app/admin/actions";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const [projects, unreadMessages] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    }),
    prisma.contactMessage.count({ where: { read: false } })
  ]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-muted">Manage portfolio projects.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="button-soft inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <Link href="/admin/messages" className="button-soft inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold">
            <Inbox size={16} /> Messages {unreadMessages ? `(${unreadMessages})` : ""}
          </Link>
          <Link href="/admin/dashboard/new" className="button-primary rounded-full px-4 py-3 text-sm font-bold">
            New project
          </Link>
          <form action={logoutAdmin}>
            <button className="button-soft rounded-full px-4 py-3 text-sm font-bold">Logout</button>
          </form>
        </div>
      </header>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="liquid-glass flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] p-5">
            <div>
              <h2 className="font-bold">{project.titleEn}</h2>
              <p className="text-sm text-muted">
                {project.published ? "Published" : "Draft"} {project.featured ? "• Featured" : ""}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/dashboard/${project.id}`} className="button-soft rounded-full px-4 py-2 text-sm font-bold">
                Edit
              </Link>
              <form action={deleteProject.bind(null, project.id)}>
                <button className="rounded-full bg-rose-500/10 px-4 py-2 text-sm font-bold text-rose-400">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
