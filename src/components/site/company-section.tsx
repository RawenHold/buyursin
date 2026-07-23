"use client";

import Link from "next/link";
import { ArrowRight, Award, Check, ShieldCheck } from "lucide-react";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

export function CompanySection({ full = false }: { full?: boolean }) {
  const { locale } = useI18n();
  const c = copyFor(locale);
  return (
    <section className={`section-block ${full ? "pt-10" : "bg-white"}`}>
      <div className="site-shell">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="section-eyebrow">{c.company.eyebrow}</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] text-[#101828] sm:text-5xl">{c.company.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#667085]">{c.company.text}</p>
            <Link href="/company" className="button-secondary mt-7" data-label={c.nav.company}><span className="button-label">{c.nav.company}<ArrowRight className="h-4 w-4" /></span></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.company.facts.map((fact, index) => (
              <div key={fact.label} className="rounded-[24px] border border-[#e4e7ec] bg-[#f8fafc] p-5 sm:p-6">
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#1769ff] shadow-sm">{index % 2 === 0 ? <Award className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}</span><span className="text-xs font-bold text-[#98a2b3]">0{index + 1}</span></div>
                <div className="mt-8 text-2xl font-bold tracking-[-.035em] text-[#101828]">{fact.value}</div>
                <div className="mt-2 text-sm leading-6 text-[#667085]">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
        {full && (
          <div className="mt-8 rounded-[28px] border border-[#e4e7ec] bg-white p-6 sm:p-8">
            <div className="text-sm font-bold text-[#101828]">{locale === "ru" ? "Статусы и сертификации из презентации" : "Taqdimotdagi status va sertifikatlar"}</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {c.company.certifications.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-[#e4e7ec] bg-[#f8fafc] p-4 text-sm font-semibold leading-6 text-[#344054]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#22a06b]" />{item}</div>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
