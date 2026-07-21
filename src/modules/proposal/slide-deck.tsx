"use client";

import {
  Activity,
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  Droplets,
  Fan,
  Flame,
  Gauge,
  Lightbulb,
  PanelsTopLeft,
} from "lucide-react";
import { useI18n } from "@/modules/i18n";
import type { ProposalData, ProposalModuleId } from "./types";

const icons: Record<ProposalModuleId, typeof PanelsTopLeft> = {
  bms: PanelsTopLeft,
  metering: Gauge,
  hvac: Fan,
  light: Lightbulb,
  water: Droplets,
  safety: Flame,
};

function formatMoney(value: number, currency: ProposalData["currency"], compact = false) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

function Brand({ data, inverse = false }: { data: ProposalData; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-[.8cqw]">
      <div className={`grid h-[3cqw] w-[3cqw] place-items-center overflow-hidden rounded-[.8cqw] ${inverse ? "bg-white" : "bg-[#101815]"}`}>
        {data.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logoDataUrl} alt="Client logo" className="h-full w-full object-contain p-[.35cqw]" />
        ) : (
          <span className={`text-[1.2cqw] font-black ${inverse ? "text-[#101815]" : "text-white"}`}>{data.client.slice(0, 1)}</span>
        )}
      </div>
      <span className={`slide-small font-black tracking-[-.02em] ${inverse ? "text-white" : "text-[#101815]"}`}>{data.client}</span>
    </div>
  );
}

function Footer({ index, inverse = false }: { index: number; inverse?: boolean }) {
  return (
    <div className={`absolute bottom-[3.2cqw] left-[5.7cqw] right-[5.7cqw] flex items-center justify-between slide-small font-bold ${inverse ? "text-white/45" : "text-black/35"}`}>
      <span>BUYURSIN TECHNICS</span>
      <span>0{index}</span>
    </div>
  );
}

function Slide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section data-proposal-slide className={`slide-canvas w-full rounded-[18px] border border-black/8 shadow-[0_18px_60px_rgba(20,40,32,.12)] ${className}`}>
      {children}
    </section>
  );
}

export function SlideDeck({ data }: { data: ProposalData }) {
  const { t, list } = useI18n();
  const annualBase = Math.max(0, data.monthlyEnergy + data.monthlyOps) * 12;
  const annualEffect = annualBase * (Math.max(0, data.savingPercent) / 100);
  const payback = annualEffect > 0 ? data.budget / annualEffect * 12 : 0;

  return (
    <div className="space-y-7">
      <Slide>
        <div className="absolute inset-0 grid grid-cols-[1.06fr_.94fr]">
          <div className="slide-pad flex flex-col justify-between">
            <Brand data={data} />
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{t("proposal.slide.cover.kicker")}</div>
              <h2 className="slide-display mt-[2cqw] max-w-[48cqw]">{t("proposal.slide.cover.title")}</h2>
              <div className="mt-[2.2cqw] flex flex-wrap items-center gap-[1cqw] slide-body text-black/55">
                <span>{data.objectName}</span><span className="h-[.3cqw] w-[.3cqw] rounded-full bg-black/20" /><span>{new Intl.NumberFormat("ru-RU").format(data.area)} м²</span>
              </div>
            </div>
            <div className="slide-small font-bold uppercase tracking-[.12em] text-black/35">{t("proposal.slide.cover.note")}</div>
          </div>
          <div className="relative m-[1.1cqw] overflow-hidden rounded-[1.8cqw] bg-[#101815]">
            <div className="absolute inset-0 bg-[url('/assets/hero.jpg')] bg-cover bg-center opacity-48" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101815] via-[#101815]/30 to-transparent" />
            <div className="absolute inset-x-[3.2cqw] bottom-[3.2cqw] grid grid-cols-2 gap-[.8cqw]">
              {[
                ["24/7", "CONTROL"],
                [`${data.savingPercent}%`, "SCENARIO"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.1cqw] border border-white/12 bg-white/8 p-[1.4cqw] text-white backdrop-blur-md">
                  <div className="text-[2.6cqw] font-black tracking-[-.05em]">{value}</div>
                  <div className="mt-[.4cqw] text-[.75cqw] font-black tracking-[.14em] text-white/45">{label}</div>
                </div>
              ))}
            </div>
            <div className="absolute right-[3.2cqw] top-[3.2cqw] h-[1.2cqw] w-[1.2cqw] rounded-full" style={{ background: data.accent, boxShadow: `0 0 0 1cqw ${data.accent}22` }} />
          </div>
        </div>
      </Slide>

      <Slide>
        <div className="slide-pad h-full">
          <Brand data={data} />
          <div className="mt-[4.6cqw] grid grid-cols-[.82fr_1.18fr] gap-[5cqw]">
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{t("proposal.slide.losses.kicker")}</div>
              <h2 className="slide-h2 mt-[1.8cqw]">{t("proposal.slide.losses.title")}</h2>
              <p className="slide-body mt-[2cqw] text-black/48">{data.objectType} · {new Intl.NumberFormat("ru-RU").format(data.area)} м²</p>
            </div>
            <div className="grid grid-cols-3 gap-[1cqw]">
              {[
                { Icon: Gauge, title: t("proposal.slide.losses.a"), value: data.monthlyEnergy, tone: "#d99b35" },
                { Icon: Activity, title: t("proposal.slide.losses.b"), value: data.monthlyOps, tone: "#4568a6" },
                { Icon: Building2, title: t("proposal.slide.losses.c"), value: data.budget * 0.12, tone: "#d55245" },
              ].map(({ Icon, title, value, tone }, index) => (
                <div key={title} className="relative flex min-h-[25cqw] flex-col overflow-hidden rounded-[1.3cqw] border border-black/8 bg-white p-[1.6cqw]">
                  <div className="grid h-[3.2cqw] w-[3.2cqw] place-items-center rounded-[.9cqw]" style={{ background: `${tone}18`, color: tone }}><Icon className="h-[1.5cqw] w-[1.5cqw]" /></div>
                  <div className="mt-auto">
                    <div className="slide-small font-black uppercase tracking-[.1em] text-black/38">0{index + 1}</div>
                    <div className="mt-[.7cqw] text-[1.5cqw] font-black">{title}</div>
                    <div className="mt-[1.2cqw] text-[1.65cqw] font-black tracking-[-.04em]">{formatMoney(value, data.currency, true)}</div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[.35cqw] w-full" style={{ background: tone }} />
                </div>
              ))}
            </div>
          </div>
          <Footer index={2} />
        </div>
      </Slide>

      <Slide>
        <div className="slide-pad h-full">
          <div className="flex items-start justify-between">
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{t("proposal.slide.solution.kicker")}</div>
              <h2 className="slide-h2 mt-[1.6cqw] max-w-[70cqw]">{t("proposal.slide.solution.title")}</h2>
            </div>
            <Brand data={data} />
          </div>
          <div className="mt-[3.8cqw] grid grid-cols-3 gap-[1cqw]">
            {data.modules.map((module, index) => {
              const Icon = icons[module];
              return (
                <div key={module} className="group rounded-[1.2cqw] border border-black/8 bg-white p-[1.35cqw]">
                  <div className="flex items-center justify-between">
                    <div className="grid h-[3cqw] w-[3cqw] place-items-center rounded-[.8cqw]" style={{ background: `${data.accent}14`, color: data.accent }}><Icon className="h-[1.5cqw] w-[1.5cqw]" /></div>
                    <span className="slide-small font-black text-black/20">0{index + 1}</span>
                  </div>
                  <div className="mt-[2.4cqw] text-[1.5cqw] font-black">{t(`services.${module}.title`)}</div>
                  <div className="mt-[1cqw] space-y-[.55cqw]">
                    {list(`services.${module}.items`).map((item) => (
                      <div key={item} className="flex gap-[.6cqw] slide-small font-semibold text-black/45"><Check className="mt-[.1cqw] h-[.85cqw] w-[.85cqw]" style={{ color: data.accent }} />{item}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-[5.8cqw] left-[5.7cqw] right-[5.7cqw] flex items-center gap-[1.5cqw]">
            <div className="h-px flex-1 bg-black/10" />
            <div className="slide-small font-black uppercase tracking-[.15em] text-black/35">ONE INTERFACE · REAL-TIME DATA</div>
            <div className="h-px flex-1 bg-black/10" />
          </div>
          <Footer index={3} />
        </div>
      </Slide>

      <Slide className="bg-[#101815] text-white">
        <div className="slide-pad h-full">
          <div className="flex items-start justify-between"><Brand data={data} inverse /><div className="slide-small font-black uppercase tracking-[.15em] text-white/35">{data.objectName}</div></div>
          <div className="mt-[4.6cqw] grid grid-cols-[.82fr_1.18fr] items-end gap-[4cqw]">
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{t("proposal.slide.effect.kicker")}</div>
              <h2 className="slide-h2 mt-[1.7cqw]">{t("proposal.slide.effect.title")}</h2>
              <div className="mt-[3.2cqw] grid grid-cols-2 gap-[1cqw]">
                <div className="rounded-[1.2cqw] border border-white/10 bg-white/[.055] p-[1.4cqw]">
                  <div className="slide-small font-bold text-white/42">{t("proposal.slide.effect.annual")}</div>
                  <div className="mt-[1cqw] text-[2.2cqw] font-black tracking-[-.05em]">{formatMoney(annualEffect, data.currency, true)}</div>
                </div>
                <div className="rounded-[1.2cqw] border border-white/10 bg-white/[.055] p-[1.4cqw]">
                  <div className="slide-small font-bold text-white/42">{t("proposal.slide.effect.payback")}</div>
                  <div className="mt-[1cqw] text-[2.2cqw] font-black tracking-[-.05em]">{payback.toFixed(1)} <span className="text-[1cqw] text-white/45">{t("proposal.slide.effect.months")}</span></div>
                </div>
              </div>
            </div>
            <div className="relative h-[27cqw] overflow-hidden rounded-[1.5cqw] border border-white/10 bg-white/[.045] p-[2cqw]">
              <div className="absolute inset-x-[2cqw] bottom-[2cqw] top-[4cqw] flex items-end gap-[1.1cqw]">
                {[88, 78, 68, 59, 52, 45].map((height, index) => (
                  <div key={index} className="relative flex-1 rounded-t-[.5cqw] bg-white/8" style={{ height: `${height}%` }}>
                    <div className="absolute inset-x-0 bottom-0 rounded-t-[.5cqw]" style={{ height: `${Math.max(18, height - index * 5)}%`, background: data.accent }} />
                  </div>
                ))}
              </div>
              <div className="absolute left-[2cqw] top-[1.8cqw] flex items-center gap-[.7cqw] slide-small font-black uppercase tracking-[.12em] text-white/38"><CircleDollarSign className="h-[1cqw] w-[1cqw]" /> 12 MONTHS</div>
            </div>
          </div>
          <Footer index={4} inverse />
        </div>
      </Slide>

      <Slide>
        <div className="slide-pad h-full">
          <div className="flex items-start justify-between"><div><div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{t("proposal.slide.plan.kicker")}</div><h2 className="slide-h2 mt-[1.6cqw] max-w-[62cqw]">{t("proposal.slide.plan.title")}</h2></div><Brand data={data} /></div>
          <div className="mt-[5.2cqw] flex items-center">
            {list("proposal.slide.plan.steps").map((step, index, steps) => (
              <div key={step} className="contents">
                <div className="relative z-10 flex w-[10.8cqw] flex-col items-center text-center">
                  <div className="grid h-[5.5cqw] w-[5.5cqw] place-items-center rounded-full border border-black/8 bg-white text-[1.5cqw] font-black shadow-sm" style={{ color: data.accent }}>0{index + 1}</div>
                  <div className="mt-[1.2cqw] text-[1.15cqw] font-black">{step}</div>
                </div>
                {index < steps.length - 1 && <div className="flex-1"><div className="relative h-px bg-black/12"><ArrowRight className="absolute -right-[.5cqw] -top-[.6cqw] h-[1.2cqw] w-[1.2cqw] text-black/30" /></div></div>}
              </div>
            ))}
          </div>
          <div className="absolute bottom-[6.4cqw] left-[5.7cqw] right-[5.7cqw] flex items-center justify-between rounded-[1.3cqw] bg-[#101815] p-[1.6cqw] text-white">
            <div className="text-[1.4cqw] font-black">{t("proposal.slide.plan.cta")}</div>
            <div className="grid h-[3.2cqw] w-[3.2cqw] place-items-center rounded-[.9cqw]" style={{ background: data.accent }}><ArrowRight className="h-[1.4cqw] w-[1.4cqw]" /></div>
          </div>
          <Footer index={5} />
        </div>
      </Slide>
    </div>
  );
}
