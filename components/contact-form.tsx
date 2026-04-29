"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContactMessage, ContactFormState } from "@/app/actions/contact";
import { Locale, dictionary } from "@/lib/preferences";

const initialState: ContactFormState = {
  status: "idle"
};

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = dictionary[locale];
  const [state, formAction] = useFormState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="liquid-glass space-y-4 rounded-[2rem] p-6">
      {state.status === "success" ? (
        <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          {copy.messageSent}
        </p>
      ) : null}

      {state.status === "rate_limited" ? (
        <p className="rounded-2xl bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-400">
          {copy.messageRateLimited}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          placeholder={copy.name}
          className="focus-ring rounded-2xl border border-theme bg-white/10 px-4 py-3 text-sm"
        />
        <input
          name="email"
          type="email"
          required
          maxLength={120}
          placeholder={copy.email}
          className="focus-ring rounded-2xl border border-theme bg-white/10 px-4 py-3 text-sm"
        />
      </div>

      <textarea
        name="message"
        required
        minLength={10}
        maxLength={1200}
        placeholder={copy.message}
        className="focus-ring min-h-36 w-full rounded-2xl border border-theme bg-white/10 px-4 py-3 text-sm"
      />

      <SubmitButton label={copy.sendMessage} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const status = useFormStatus();

  return (
    <button
      type="submit"
      disabled={status.pending}
      className="button-primary focus-ring rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {status.pending ? "..." : label}
    </button>
  );
}
