"use client";

import Link from "next/link";
import { ArrowRight, Building2, Check, Construction, Settings2, UsersRound } from "lucide-react";
import { useState } from "react";
import type { AudienceId } from "@/content/site";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

const roles: Array<{ id: AudienceId; Icon: typeof Building2 }> = [
  { id: "owner", Icon: Building2 },
  { id: "management", Icon: UsersRound },
  { id: "developer", Icon: Construction },
  { id: "technical", Icon: Settings2 },
];

export function AudienceSelector() {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const [active, setActive] = useState<AudienceId>("owner");
  const selected = c.audience.items[active];

  const href = active === "technical"
    ? "/solutions"
    : active === "owner"
      ? "/calculator"
      : active === "management"
        ? "/#scenarios"
        : "/contacts#lead";

  return (
    <section className="section-block bg-white">
      <div className="site-shell">
        <div className="section-heading">
          <span className="section-eyebrow">{c.audience.eyebrow}</span>
          <h2>{c.audience.title}</h2>
          <p>{c.audience.subtitle}</p>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {roles.map(({ id, Icon }, index) => {
            const activeRole = id === active;
            const item = c.audience.items[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                aria-pressed={activeRole}
                className={`group min-h-[230px] rounded-[22px] border p-5 text-left transition ${activeRole ? "border-[#1769ff] bg-[#f4f7ff] shadow-[0_16px_38px_rgba(23,105,255,.09)]" : "border-[#e4e7ec] bg-white hover:-translate-y-0.5 hover:border-[#cdd5df] hover:shadow-[0_16px_40px_rgba(16,24,40,.055)]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-[14px] ${activeRole ? "bg-[#1769ff] text-white" : "bg-[#eef4ff] text-[#1769ff]"}`}><Icon className="h-5 w-5" /></span>
                  <span className="text-[11px] font-bold text-[#98a2b3]">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-lg font-bold tracking-[-.025em] text-[#101828]">{c.audience.labels[id]}</h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">{item.points[0]}</p>
                <div className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${activeRole ? "text-[#1769ff]" : "text-[#475467]"}`}>
                  {locale === "ru" ? "Показать выгоды" : "Foydani ko‘rsatish"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid overflow-hidden rounded-[26px] border border-[#dfe4ea] bg-[#f8fafc] lg:grid-cols-[.9fr_1.1fr]">
          <div className="border-b border-[#e4e7ec] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="inline-flex rounded-full border border-[#d6e4ff] bg-white px-3 py-1.5 text-xs font-bold text-[#1769ff]">{c.audience.labels[active]}</div>
            <h3 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-.04em] text-[#101828] sm:text-4xl">{selected.headline}</h3>
            <Link href={href} className="button-primary mt-7" data-label={selected.cta}><span className="button-label">{selected.cta}<ArrowRight className="h-4 w-4" /></span></Link>
          </div>
          <div className="grid gap-px bg-[#e4e7ec] sm:grid-cols-3">
            {selected.points.map((point) => (
              <div key={point} className="bg-white p-5 sm:p-6">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ecfdf3] text-[#22a06b]"><Check className="h-4 w-4" /></span>
                <div className="mt-7 text-sm font-semibold leading-6 text-[#344054]">{point}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
