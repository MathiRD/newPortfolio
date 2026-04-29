import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <form action={loginAdmin} className="liquid-glass w-full max-w-md space-y-5 rounded-[2rem] p-8">
        <Link href="/" className="button-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
          <ArrowLeft size={16} /> Back to site
        </Link>

        <div>
          <h1 className="text-3xl font-black">Admin login</h1>
          <p className="mt-2 text-sm text-muted">Manage projects and contact messages.</p>
        </div>

        {searchParams.error ? (
          <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400">
            Invalid credentials.
          </p>
        ) : null}

        <input
          name="email"
          type="email"
          placeholder="Admin email"
          className="focus-ring w-full rounded-2xl border border-theme bg-white/10 px-4 py-3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="focus-ring w-full rounded-2xl border border-theme bg-white/10 px-4 py-3"
          required
        />

        <button className="button-primary focus-ring w-full rounded-full px-4 py-3 font-bold">
          Enter
        </button>
      </form>
    </main>
  );
}
