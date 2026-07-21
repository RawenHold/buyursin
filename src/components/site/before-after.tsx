"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Gauge, Lightbulb, ThermometerSun } from "lucide-react";
import { useI18n } from "@/modules/i18n";

function BuildingState({ optimized }: { optimized: boolean }) {
  const rooms = Array.from({ length: 12 });
  return (
    <div className={`absolute inset-0 p-5 sm:p-8 ${optimized ? "bg-[#edf7f3]" : "bg-[#f4f1ee]"}`}>
      <div className="grid h-full grid-cols-[1fr_94px] gap-4">
        <div className="grid grid-cols-3 gap-3 rounded-[22px] border border-black/8 bg-white/70 p-4 shadow-inner sm:grid-cols-4">
          {rooms.map((_, index) => {
            const issue = !optimized && [1, 4, 7, 10].includes(index);
            const active = optimized && [2, 5, 8].includes(index);
            return (
              <motion.div
                key={index}
                className={`relative min-h-24 rounded-xl border ${issue ? "border-[#e6a29c] bg-[#fff1ef]" : active ? "border-[#83c8b9] bg-[#e8f7f2]" : "border-black/7 bg-white/70"}`}
                animate={issue ? { opacity: [0.6, 1, 0.6] } : active ? { boxShadow: ["0 0 0 0 rgba(22,111,103,0)", "0 0 0 8px rgba(22,111,103,.08)", "0 0 0 0 rgba(22,111,103,0)"] } : undefined}
                transition={{ duration: 1.9, repeat: Infinity, delay: index * 0.08 }}
              >
                <span className="absolute left-2 top-2 text-[9px] font-black text-black/25">{index + 1}</span>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {issue && <AlertTriangle className="h-4 w-4 text-[#d55245]" />}
                  {active && <Check className="h-4 w-4 text-[var(--accent)]" />}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-col justify-between rounded-[22px] border border-black/8 bg-white/80 p-3">
          {[Gauge, ThermometerSun, Lightbulb].map((Icon, index) => (
            <motion.div
              key={index}
              className={`grid aspect-square place-items-center rounded-xl ${optimized ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-black/[.04] text-black/35"}`}
              animate={optimized ? { scale: [1, 1.08, 1] } : { rotate: index === 1 ? [0, -4, 4, 0] : 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.28 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const { t, list } = useI18n();
  const [value, setValue] = useState(52);

  return (
    <section id="compare" className="section-space bg-white">
      <div className="site-shell">
        <span className="kicker">{t("compare.kicker")}</span>
        <h2 className="section-title mt-6 max-w-6xl">{t("compare.title")}</h2>

        <div className="mt-12 rounded-[30px] border border-[var(--line)] bg-[var(--background)] p-3 shadow-[0_22px_70px_rgba(20,40,32,.08)] sm:p-5">
          <div className="relative h-[510px] overflow-hidden rounded-[22px]">
            <BuildingState optimized={false} />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${value}%)` }}>
              <BuildingState optimized />
            </div>
            <div className="pointer-events-none absolute inset-y-0 z-20 w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,.08)]" style={{ left: `${value}%` }}>
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full border border-black/8 bg-white shadow-lg">
                <ChevronLeft className="h-4 w-4" /><ChevronRight className="h-4 w-4" />
              </div>
            </div>
            <span className="absolute left-4 top-4 z-30 rounded-full bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[.1em] text-[#b84f45] backdrop-blur-xl">{t("compare.before")}</span>
            <span className="absolute right-4 top-4 z-30 rounded-full bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[.1em] text-[var(--accent)] backdrop-blur-xl">{t("compare.after")}</span>
            <input
              aria-label={`${t("compare.before")} / ${t("compare.after")}`}
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="absolute inset-0 z-40 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] border border-[#f0d7d3] bg-[#fff6f4] p-5">
              <div className="mb-4 text-xs font-black uppercase tracking-[.12em] text-[#b84f45]">{t("compare.before")}</div>
              <ul className="space-y-3">
                {list("compare.before.items").map((item) => <li key={item} className="flex gap-3 text-sm font-semibold text-[#6e5d59]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d55245]" />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-[20px] border border-[#cfe8df] bg-[#f0faf6] p-5">
              <div className="mb-4 text-xs font-black uppercase tracking-[.12em] text-[var(--accent)]">{t("compare.after")}</div>
              <ul className="space-y-3">
                {list("compare.after.items").map((item) => <li key={item} className="flex gap-3 text-sm font-semibold text-[#4e6860]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
