"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACTS, copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

type FormState = "idle" | "sending" | "success" | "fallback";

export function LeadForm() {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const [state, setState] = useState<FormState>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const result = (await response.json()) as { delivered?: boolean; fallbackUrl?: string };
      if (response.ok && result.delivered) {
        setState("success");
        form.reset();
        return;
      }
      setState("fallback");
      if (result.fallbackUrl) window.location.href = result.fallbackUrl;
    } catch {
      const subject = encodeURIComponent("Заявка с сайта Buyursin Technics");
      const body = encodeURIComponent(`Имя: ${String(data.name ?? "")}\nКомпания: ${String(data.company ?? "")}\nКонтакт: ${String(data.contact ?? "")}\nЗадача: ${String(data.message ?? "")}`);
      setState("fallback");
      window.location.href = `${CONTACTS.emailHref}?subject=${subject}&body=${body}`;
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-[#e4e7ec] bg-white p-5 shadow-[0_24px_70px_rgba(16,24,40,.07)] sm:p-7">
      <h3 className="text-2xl font-bold tracking-[-.035em] text-[#101828]">{c.contact.formTitle}</h3>
      <input name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-px w-px opacity-0" aria-hidden="true" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="field-label"><span>{c.contact.name}</span><input name="name" required className="field-control" /></label>
        <label className="field-label"><span>{c.contact.company}</span><input name="company" className="field-control" /></label>
        <label className="field-label sm:col-span-2"><span>{c.contact.contactField}</span><input name="contact" required className="field-control" /></label>
        <label className="field-label sm:col-span-2"><span>{c.contact.message}</span><textarea name="message" required rows={5} className="field-control resize-none" /></label>
      </div>
      <button type="submit" disabled={state === "sending"} className="button-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60" data-label={state === "sending" ? c.contact.sending : state === "success" ? c.contact.success : c.contact.submit}>
        <span className="button-label">
          {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "success" ? <CheckCircle2 className="h-4 w-4" /> : null}
          {state === "sending" ? c.contact.sending : state === "success" ? c.contact.success : c.contact.submit}
          {state === "idle" && <ArrowRight className="h-4 w-4" />}
        </span>
      </button>
      {state === "fallback" && <p className="mt-3 text-xs leading-5 text-[#667085]">{c.contact.fallback}</p>}
    </form>
  );
}
