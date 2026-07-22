"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, BellRing, Building2, ShieldCheck } from "lucide-react";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

const metricIcons = [BarChart3, ShieldCheck, BellRing, Building2];

export function HeroStatic() {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const statusCards = locale === "ru"
    ? [
        { label: "Климат", value: "22,5 °C", tone: "normal" },
        { label: "Энергия", value: "–18%", tone: "accent" },
        { label: "Системы", value: "В норме", tone: "normal" },
      ]
    : [
        { label: "Iqlim", value: "22,5 °C", tone: "normal" },
        { label: "Energiya", value: "–18%", tone: "accent" },
        { label: "Tizimlar", value: "Me’yorda", tone: "normal" },
      ];

  return (
    <section className="overflow-hidden border-b border-[#e4e7ec] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_100%)]">
      <div className="site-shell py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[.92fr_1.08fr]">
          <div className="relative z-10 py-3 lg:py-8">
            <span className="eyebrow-pill">{c.hero.badge}</span>
            <h1 className="hero-title mt-6">
              {c.hero.titleA}<br /><span className="text-[#1769ff]">{c.hero.titleB}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#667085] sm:text-lg">{c.hero.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/calculator" className="button-primary" data-label={c.hero.primary}><span className="button-label">{c.hero.primary}<ArrowRight className="h-4 w-4" /></span></Link>
              <Link href="/contacts#lead" className="button-secondary" data-label={locale === "ru" ? "Заказать аудит" : "Audit buyurtma qilish"}><span className="button-label">{locale === "ru" ? "Заказать аудит" : "Audit buyurtma qilish"}<ArrowRight className="h-4 w-4" /></span></Link>
            </div>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[28px] border border-[#dde5f0] bg-white shadow-[0_26px_80px_rgba(16,24,40,.09)] sm:min-h-[500px]">
            <Image
              src="/assets/hero-building.jpg"
              alt={locale === "ru" ? "Современное здание с подключёнными инженерными системами" : "Ulangan muhandislik tizimlariga ega zamonaviy bino"}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/78 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 grid gap-2 sm:grid-cols-3">
              {statusCards.map((item) => (
                <div key={item.label} className="rounded-[16px] border border-white/90 bg-white/92 p-3 shadow-[0_10px_28px_rgba(16,24,40,.08)] backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-[.08em] text-[#667085]">{item.label}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-bold text-[#101828]">
                    <span className={`h-2 w-2 rounded-full ${item.tone === "accent" ? "bg-[#1769ff]" : "bg-[#22a06b]"}`} />
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-[22px] border border-[#e4e7ec] bg-[#e4e7ec] sm:grid-cols-2 xl:grid-cols-4">
          {c.hero.metrics.map((item, index) => {
            const Icon = metricIcons[index];
            return (
              <div key={item.label} className="bg-white p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#1769ff]"><Icon className="h-5 w-5" /></span>
                  <div>
                    <div className="text-xl font-bold tracking-[-.035em] text-[#101828]">{item.value}</div>
                    <div className="mt-1 text-xs leading-5 text-[#667085]">{item.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
