"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { Brand } from "@/components/shared/brand";

export default function ProposalLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: data.get("code") }),
    });
    if (response.ok) {
      window.location.href = "/admin/proposal";
      return;
    }
    const result = await response.json().catch(() => ({})) as { error?: string };
    setError(response.status === 503 ? "Настройте PROPOSAL_ACCESS_CODE и PROPOSAL_SESSION_SECRET в Vercel." : result.error ?? "Не удалось войти");
    setLoading(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f8fb] p-5">
      <div className="w-full max-w-md rounded-[28px] border border-[#e4e7ec] bg-white p-7 shadow-[0_24px_80px_rgba(16,24,40,.10)]">
        <Brand />
        <span className="mt-10 grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#1769ff]"><LockKeyhole className="h-5 w-5" /></span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-.04em] text-[#101828]">Внутренний конструктор КП</h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">Доступ только для сотрудников. Код хранится в серверных переменных окружения.</p>
        <form onSubmit={submit} className="mt-7">
          <label className="field-label"><span>Код доступа</span><input name="code" type="password" required autoComplete="current-password" className="field-control" /></label>
          {error && <p className="mt-3 text-sm leading-6 text-[#b42318]">{error}</p>}
          <button type="submit" disabled={loading} className="button-primary mt-5 w-full justify-center disabled:opacity-60" data-label={loading ? "Проверяем…" : "Войти"}><span className="button-label">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Проверяем…" : "Войти"}</span></button>
        </form>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#1769ff]"><ArrowLeft className="h-4 w-4" />На сайт</Link>
      </div>
    </main>
  );
}
