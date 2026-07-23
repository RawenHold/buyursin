"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Building2,
  Check,
  CircleGauge,
  Droplets,
  Fan,
  Flame,
  Gauge,
  LockKeyhole,
  MapPin,
  PanelsTopLeft,
  ShieldCheck,
  ThermometerSun,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { ScenarioId } from "@/content/site";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

const tabs: Array<{ id: ScenarioId; Icon: typeof Zap }> = [
  { id: "energy", Icon: Zap },
  { id: "climate", Icon: Fan },
  { id: "leak", Icon: Droplets },
  { id: "access", Icon: LockKeyhole },
  { id: "fire", Icon: Flame },
];

const visualIcons: Record<ScenarioId, [typeof Zap, typeof Zap, typeof Zap]> = {
  energy: [Gauge, CircleGauge, PanelsTopLeft],
  climate: [ThermometerSun, Fan, PanelsTopLeft],
  leak: [Droplets, BellRing, ShieldCheck],
  access: [LockKeyhole, ShieldCheck, PanelsTopLeft],
  fire: [Flame, BellRing, ShieldCheck],
};

const proof: Record<ScenarioId, { value: string; labelRu: string; labelUz: string }[]> = {
  energy: [
    { value: "до 30%", labelRu: "потенциал снижения энергозатрат", labelUz: "energiya xarajatlarini kamaytirish salohiyati" },
    { value: "24/7", labelRu: "учёт и контроль", labelUz: "hisob va nazorat" },
    { value: "BMS + АСКУЭ", labelRu: "единая аналитика", labelUz: "yagona analitika" },
  ],
  climate: [
    { value: "CO₂ · T° · RH", labelRu: "параметры качества среды", labelUz: "muhit sifati parametrlari" },
    { value: "24/7", labelRu: "контроль зон", labelUz: "zonalar nazorati" },
    { value: "ОВиК + BMS", labelRu: "автоматические режимы", labelUz: "avtomatik rejimlar" },
  ],
  leak: [
    { value: "24/7", labelRu: "контроль датчиков", labelUz: "datchiklar nazorati" },
    { value: "1 событие", labelRu: "зона, время и реакция", labelUz: "zona, vaqt va reaksiya" },
    { value: "BMS", labelRu: "уведомление и сценарий", labelUz: "ogohlantirish va ssenariy" },
  ],
  access: [
    { value: "СКУД + BMS", labelRu: "единая история событий", labelUz: "yagona voqealar tarixi" },
    { value: "24/7", labelRu: "контроль критических зон", labelUz: "muhim zonalar nazorati" },
    { value: "1 панель", labelRu: "права и посещения", labelUz: "huquq va tashriflar" },
  ],
  fire: [
    { value: "АПС + СОУЭ", labelRu: "согласованный сценарий", labelUz: "uyg‘un ssenariy" },
    { value: "24/7", labelRu: "контроль состояния", labelUz: "holat nazorati" },
    { value: "1 журнал", labelRu: "все действия систем", labelUz: "barcha tizim harakatlari" },
  ],
};

function ProblemVisual({ active, title }: { active: ScenarioId; title: string }) {
  if (active === "leak") {
    return (
      <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[18px] border border-[#e4e7ec] bg-[#f2f4f7]">
        <Image src="/assets/scenario-leak.jpg" alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 32vw" />
      </div>
    );
  }

  const [Primary] = visualIcons[active];
  const label = active === "energy" ? "–18%" : active === "climate" ? "620 ppm" : active === "access" ? "Access" : "Alarm";
  const bars = active === "energy" ? [62, 82, 55, 72, 43, 34] : active === "climate" ? [45, 50, 58, 53, 46, 40] : [25, 25, 85, 25, 25, 25];

  return (
    <div className="mt-5 aspect-[16/10] overflow-hidden rounded-[18px] border border-[#dfe4ea] bg-[linear-gradient(180deg,#f8fafc,#eef4ff)] p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white text-[#1769ff] shadow-sm"><Primary className="h-6 w-6" /></span>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${active === "fire" ? "bg-[#fff1f0] text-[#d92d20]" : "bg-white text-[#1769ff]"}`}>{label}</span>
      </div>
      <div className="mt-8 flex h-28 items-end gap-2">
        {bars.map((height, index) => <span key={index} className={`flex-1 rounded-t-md ${active === "fire" && index === 2 ? "bg-[#f97066]" : "bg-[#8eb7ff]"}`} style={{ height: `${height}%` }} />)}
      </div>
      <div className="mt-3 h-px bg-[#cdd5df]" />
      <div className="mt-3 flex justify-between text-[10px] font-semibold text-[#98a2b3]"><span>00:00</span><span>12:00</span><span>24:00</span></div>
    </div>
  );
}

export function ScenarioExplorer({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const [active, setActive] = useState<ScenarioId>("energy");
  const data = c.scenario.items[active];
  const [Primary, Secondary, Tertiary] = visualIcons[active];
  const activeProof = proof[active];

  return (
    <section id="scenarios" className={`section-block ${compact ? "pt-8" : "bg-[#f8fafc]"}`}>
      <div className="site-shell">
        {!compact && (
          <div className="section-heading">
            <span className="section-eyebrow">{c.scenario.eyebrow}</span>
            <h2>{c.scenario.title}</h2>
            <p>{c.scenario.subtitle}</p>
          </div>
        )}

        <div className={`${compact ? "mt-0" : "mt-9"} overflow-hidden rounded-[26px] border border-[#dfe4ea] bg-white shadow-[0_20px_60px_rgba(16,24,40,.055)]`}>
          <div className="overflow-x-auto border-b border-[#e4e7ec] px-3 pt-3">
            <div className="flex min-w-[650px] gap-1">
              {tabs.map(({ id, Icon }) => {
                const selected = active === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActive(id)}
                    aria-pressed={selected}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-t-xl border-b-2 px-4 py-4 text-sm font-bold transition ${selected ? "border-[#1769ff] bg-[#f4f7ff] text-[#1769ff]" : "border-transparent text-[#667085] hover:bg-[#f9fafb] hover:text-[#344054]"}`}
                  >
                    <Icon className="h-4 w-4" />{c.scenario.tabs[id]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-[.82fr_1.18fr_.82fr]">
            <article className="border-b border-[#e4e7ec] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 text-sm font-bold text-[#101828]"><TriangleAlert className="h-5 w-5 text-[#f04438]" />1. {c.scenario.labels.problem}</div>
              <ProblemVisual active={active} title={data.problem} />
              <p className="mt-5 text-sm leading-6 text-[#475467]">{data.problem}</p>
            </article>

            <article className="border-b border-[#e4e7ec] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 text-sm font-bold text-[#101828]"><CircleGauge className="h-5 w-5 text-[#1769ff]" />2. {c.scenario.labels.workflow}</div>
              <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start">
                {data.steps.map((step, index) => {
                  const StepIcon = index === 0 ? Primary : index === 1 ? Secondary : Tertiary;
                  return (
                    <div key={step} className="contents">
                      <div className="text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d9e5ff] bg-[#f4f7ff] text-[#1769ff]"><StepIcon className="h-6 w-6" /></span>
                        <div className="mt-3 text-[11px] font-bold text-[#1769ff]">0{index + 1}</div>
                        <div className="mt-2 text-xs font-semibold leading-5 text-[#344054]">{step}</div>
                      </div>
                      {index < data.steps.length - 1 && <ArrowRight className="mx-auto hidden h-4 w-4 text-[#b4bdc8] sm:mt-5 sm:block" />}
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="border-b border-[#e4e7ec] p-5 sm:p-7 lg:border-b-0">
              <div className="flex items-center gap-3 text-sm font-bold text-[#101828]"><Building2 className="h-5 w-5 text-[#1769ff]" />3. {c.scenario.labels.ownerValue}</div>
              <ul className="mt-6 grid gap-4">
                {data.benefits.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-[#344054]"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ecfdf3] text-[#22a06b]"><Check className="h-3 w-3" /></span>{item}</li>
                ))}
              </ul>
              <div className="mt-6 rounded-[16px] border border-[#ccebdc] bg-[#f0fbf6] p-4 text-sm font-semibold leading-6 text-[#176b4b]">{data.result}</div>
            </article>
          </div>

          <div className="grid border-t border-[#e4e7ec] lg:grid-cols-[1.1fr_.9fr]">
            <article className="border-b border-[#e4e7ec] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 text-sm font-bold text-[#101828]"><PanelsTopLeft className="h-5 w-5 text-[#1769ff]" />4. {c.scenario.labels.dashboard}</div>
              <div className="mt-5 grid gap-4 rounded-[18px] border border-[#dfe4ea] bg-[#f8fafc] p-4 sm:grid-cols-[1fr_.9fr]">
                <div className="rounded-[14px] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div><div className="text-[10px] font-bold uppercase tracking-[.08em] text-[#98a2b3]">{c.scenario.labels.status}</div><div className="mt-1 text-sm font-bold text-[#101828]">{active === "fire" || active === "leak" ? c.scenario.labels.alert : c.scenario.labels.normal}</div></div>
                    <span className={`h-3 w-3 rounded-full ${active === "fire" || active === "leak" ? "bg-[#f04438]" : "bg-[#22a06b]"}`} />
                  </div>
                  <div className="mt-4 grid gap-2">
                    {data.dashboard.map((item, index) => (
                      <div key={item} className="flex items-center justify-between rounded-xl border border-[#eef0f3] px-3 py-2.5 text-xs font-semibold text-[#475467]">
                        <span className="inline-flex items-center gap-2">{index === 0 ? <MapPin className="h-3.5 w-3.5 text-[#1769ff]" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#98a2b3]" />}{item}</span>
                        <span className="text-[#101828]">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[14px] bg-white p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[.08em] text-[#98a2b3]">Analytics</div>
                  <div className="mt-5 h-28">
                    <svg viewBox="0 0 300 120" className="h-full w-full" role="img" aria-label="Trend">
                      <path d="M0 82 C30 80,43 62,70 68 S112 86,138 52 S177 64,203 39 S247 53,300 20" fill="none" stroke="#1769ff" strokeWidth="5" strokeLinecap="round" />
                      <path d="M0 82 C30 80,43 62,70 68 S112 86,138 52 S177 64,203 39 S247 53,300 20 L300 120 L0 120 Z" fill="rgba(23,105,255,.08)" />
                    </svg>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#667085]"><span>{locale === "ru" ? "Сегодня" : "Bugun"}</span><span className="font-bold text-[#22a06b]">{active === "energy" ? "–18%" : locale === "ru" ? "Контроль" : "Nazorat"}</span></div>
                </div>
              </div>
            </article>

            <article className="p-5 sm:p-7">
              <div className="flex items-center gap-3 text-sm font-bold text-[#101828]"><ShieldCheck className="h-5 w-5 text-[#22a06b]" />5. {locale === "ru" ? "Факты и эффект" : "Fakt va samara"}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {activeProof.map((item) => (
                  <div key={item.value} className="rounded-[16px] border border-[#e4e7ec] bg-white p-4">
                    <div className="text-lg font-bold tracking-[-.03em] text-[#1769ff]">{item.value}</div>
                    <div className="mt-2 text-xs leading-5 text-[#667085]">{locale === "ru" ? item.labelRu : item.labelUz}</div>
                  </div>
                ))}
              </div>
              <Link href={`/calculator?scenario=${active}`} className="button-primary mt-5 w-full justify-center" data-label={c.scenario.labels.action}><span className="button-label">{c.scenario.labels.action}<ArrowRight className="h-4 w-4" /></span></Link>
            </article>
          </div>
        </div>

        {!compact && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {tabs.filter((tab) => tab.id !== active).slice(0, 4).map(({ id, Icon }) => (
              <button key={id} type="button" onClick={() => setActive(id)} className="group flex items-center justify-between rounded-[18px] border border-[#e4e7ec] bg-white p-4 text-left transition hover:border-[#bfd3ff] hover:shadow-[0_12px_32px_rgba(16,24,40,.05)]">
                <span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#1769ff]"><Icon className="h-5 w-5" /></span><span className="text-sm font-bold text-[#101828]">{c.scenario.tabs[id]}</span></span>
                <ArrowRight className="h-4 w-4 text-[#98a2b3] transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
