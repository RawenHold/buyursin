"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Check, Handshake, ShieldCheck } from "lucide-react";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

const projectTypes = [Building2, ShieldCheck, BadgeCheck, Handshake, Building2, BadgeCheck, ShieldCheck, Building2];

export function ProjectsSection({ full = false }: { full?: boolean }) {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const clients = full ? c.projects.clients : c.projects.clients.slice(0, 8);

  return (
    <section className={`section-block ${full ? "pt-10" : "bg-[#f8fafc]"}`}>
      <div className="site-shell">
        <div className="section-heading">
          <span className="section-eyebrow">{c.projects.eyebrow}</span>
          <h2>{c.projects.title}</h2>
          <p>{c.projects.subtitle}</p>
        </div>

        <div className="mt-9 grid overflow-hidden rounded-[26px] border border-[#dfe4ea] bg-white lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[360px] border-b border-[#e4e7ec] bg-[#f2f4f7] lg:border-b-0 lg:border-r">
            <Image src="/assets/project-building.jpg" alt={locale === "ru" ? "Современный коммерческий объект" : "Zamonaviy tijorat obyekti"} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101828]/85 via-[#101828]/40 to-transparent p-6 pt-28 text-white sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[.12em] text-white/62">Selected experience</div>
              <h3 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-.04em]">{locale === "ru" ? "Интеграция систем для объектов разного масштаба" : "Turli miqyosdagi obyektlar uchun tizim integratsiyasi"}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {(locale === "ru" ? ["BMS", "АСКУЭ", "ОВиК", "Безопасность"] : ["BMS", "ASKUE", "HVAC", "Xavfsizlik"]).map((item) => <span key={item} className="rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-bold backdrop-blur-md">{item}</span>)}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[.12em] text-[#98a2b3]">{locale === "ru" ? "Объекты" : "Taqdimotdagi obyektlar"}</div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {clients.map((client, index) => {
                const Icon = projectTypes[index % projectTypes.length];
                return (
                  <div key={client} className="flex items-center gap-3 rounded-[15px] border border-[#e4e7ec] bg-[#f8fafc] p-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#1769ff] shadow-sm"><Icon className="h-4 w-4" /></span>
                    <span className="text-sm font-bold text-[#344054]">{client}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-[16px] border border-[#d6e4ff] bg-[#f4f7ff] p-4">
              <div className="flex gap-3 text-sm font-semibold leading-6 text-[#344054]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#22a06b]" />{locale === "ru" ? "Состав работ и измеримые результаты по каждому объекту уточняются перед публикацией кейса." : "Har bir obyekt bo‘yicha ish tarkibi va natijalar keys e’lon qilinishidan oldin aniqlashtiriladi."}</div>
            </div>
            <Link href="/contacts#lead" className="button-primary mt-6" data-label={c.projects.cta}><span className="button-label">{c.projects.cta}<ArrowRight className="h-4 w-4" /></span></Link>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-[#e4e7ec] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.12em] text-[#98a2b3]">Partners & platforms</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.projects.partners.map((partner) => <span key={partner} className="rounded-xl border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-[#344054]">{partner}</span>)}
              </div>
            </div>
            <Link href="/projects" className="button-secondary" data-label={locale === "ru" ? "Все проекты" : "Barcha loyihalar"}><span className="button-label">{locale === "ru" ? "Все проекты" : "Barcha loyihalar"}<ArrowRight className="h-4 w-4" /></span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
