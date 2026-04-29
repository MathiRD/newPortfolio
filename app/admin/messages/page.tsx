import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteContactMessage, markMessageAsRead } from "@/app/admin/actions";

export default async function AdminMessagesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Messages</h1>
          <p className="text-muted">Contact messages sent from the portfolio.</p>
        </div>

        <Link href="/admin/dashboard" className="button-soft rounded-full px-4 py-3 text-sm font-bold">
          Back to dashboard
        </Link>
      </header>

      <div className="grid gap-4">
        {messages.map((message) => (
          <article key={message.id} className="liquid-glass rounded-[1.5rem] p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-bold">{message.name}</h2>
                <p className="text-sm text-muted">{message.email}</p>
                <p className="mt-1 text-xs text-muted">{message.createdAt.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                {!message.read ? (
                  <form action={markMessageAsRead.bind(null, message.id)}>
                    <button className="button-soft rounded-full px-4 py-2 text-sm font-bold">Mark read</button>
                  </form>
                ) : null}
                <form action={deleteContactMessage.bind(null, message.id)}>
                  <button className="rounded-full bg-rose-500/10 px-4 py-2 text-sm font-bold text-rose-400">Delete</button>
                </form>
              </div>
            </div>

            <p className="whitespace-pre-wrap break-words break-all leading-7 text-muted">{message.message}</p>
          </article>
        ))}

        {messages.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : null}
      </div>
    </main>
  );
}
