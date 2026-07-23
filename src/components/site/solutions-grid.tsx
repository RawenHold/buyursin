"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  Droplets,
  Fan,
  Flame,
  Gauge,
  Headphones,
  Lightbulb,
  PanelsTopLeft,
} from "lucide-react";
import { useState } from "react";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

const icons = [PanelsTopLeft, Gauge, Fan, Lightbulb, Droplets, Flame, Camera, Headphones];

export function SolutionsGrid({ full = false }: { full?: boolean }) {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const [active, setActive] = useState(0);
  const visible = full ? c.solutions.cards : c.solutions.cards.slice(0, 6);
  const selected = c.solutions.cards[active];
  const SelectedIcon = icons[active];

  return (
    <section id="solutions" className={`section-block ${full ? "pt-10" : "bg-[#f8fafc]"}`}>
      <div className="site-shell">
        <div className="section-heading">
          <span className="section-eyebrow">{c.solutions.eyebrow}</span>
          <h2>{c.solutions.title}</h2>
          <p>{c.solutions.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((card, index) => {
            const Icon = icons[index];
            const selectedCard = active === index;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActive(index)}
                className={`group min-h-72 rounded-[24px] border p-5 text-left transition ${selectedCard ? "border-[#1769ff] bg-[#f2f6ff] shadow-[0_18px_45px_rgba(23,105,255,.09)]" : "border-[#e4e7ec] bg-white hover:-translate-y-0.5 hover:border-[#cdd5df] hover:shadow-[0_16px_40px_rgba(16,24,40,.06)]"}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${selectedCard ? "bg-[#1769ff] text-white" : "bg-[#eef4ff] text-[#1769ff]"}`}><Icon className="h-5 w-5" /></span>
                  <span className="text-xs font-bold text-[#98a2b3]">0{index + 1}</span>
                </div>
                <h3 className="mt-10 text-xl font-bold tracking-[-.025em] text-[#101828]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">{card.text}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#1769ff]">{c.solutions.more}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid overflow-hidden rounded-[28px] border border-[#dfe4ea] bg-white lg:grid-cols-[.72fr_1.28fr]">
          <div className="bg-[#101828] p-7 text-white sm:p-10">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1769ff]"><SelectedIcon className="h-6 w-6" /></span>
            <h3 className="mt-8 text-3xl font-semibold tracking-[-.035em]">{selected.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/64">{selected.text}</p>
          </div>
          <div className="p-7 sm:p-10">
            <div className="text-xs font-bold uppercase tracking-[.12em] text-[#98a2b3]">Scope</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {selected.points.map((point) => (
                <div key={point} className="rounded-2xl border border-[#e4e7ec] bg-[#f8fafc] p-4">
                  <Check className="h-5 w-5 text-[#22a06b]" />
                  <div className="mt-4 text-sm font-bold text-[#344054]">{point}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contacts#lead" className="button-primary" data-label={c.nav.consultation}><span className="button-label">{c.nav.consultation}<ArrowRight className="h-4 w-4" /></span></Link>
              {!full && <Link href="/solutions" className="button-secondary" data-label={c.nav.solutions}><span className="button-label">{c.nav.solutions}<ArrowRight className="h-4 w-4" /></span></Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
