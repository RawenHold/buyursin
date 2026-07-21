"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Activity, Gauge, PanelsTopLeft } from "lucide-react";
import { useI18n } from "@/modules/i18n";

const dots = Array.from({ length: 18 });

function SignalField() {
  return (
    <div className="relative aspect-square w-full max-w-[560px] overflow-hidden rounded-[32px] border border-black/5 bg-[#101815] p-5 shadow-[0_30px_100px_rgba(20,40,32,.16)]">
      <div className="grid h-full grid-cols-6 grid-rows-6 gap-2.5">
        {dots.map((_, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-[11px] border border-white/8 bg-white/[.04]"
            animate={{ backgroundColor: index % 5 === 0 ? ["rgba(255,255,255,.04)", "rgba(61,181,164,.28)", "rgba(255,255,255,.04)"] : undefined }}
            transition={{ duration: 3.6, repeat: Infinity, delay: index * 0.13, ease: "easeInOut" }}
          >
            {index % 4 === 0 && (
              <motion.span
                className="absolute inset-x-2 top-1/2 h-px bg-[#70d8c6]"
                animate={{ x: ["-140%", "140%"] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.07, ease: "linear" }}
              />
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="absolute left-[14%] top-[18%] h-5 w-5 rounded-full border border-[#80e2d1] bg-[#35b6a4] shadow-[0_0_0_12px_rgba(53,182,164,.12)]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[22%] right-[18%] h-3.5 w-3.5 rounded-full bg-[#f2b457] shadow-[0_0_0_10px_rgba(242,180,87,.12)]"
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
      />
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.07] px-4 py-3 text-white backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-white/60">
          <Activity className="h-4 w-4 text-[#70d8c6]" /> Live
        </div>
        <motion.span
          className="text-sm font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          48 systems online
        </motion.span>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const metrics = [
    { value: t("hero.kpi.1"), label: t("hero.kpi.1.label"), Icon: Activity },
    { value: t("hero.kpi.2"), label: t("hero.kpi.2.label"), Icon: Gauge },
    { value: t("hero.kpi.3"), label: t("hero.kpi.3.label"), Icon: PanelsTopLeft },
  ];

  return (
    <section className="grid-lines min-h-[100svh] pt-28">
      <div className="site-shell grid min-h-[calc(100svh-7rem)] items-center gap-14 py-16 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="kicker">
            {t("hero.eyebrow")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            className="display-title mt-7 max-w-[900px]"
          >
            {t("hero.title.1")} <span className="text-[var(--accent)]">{t("hero.title.2")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="mt-8 flex flex-wrap gap-3">
            <Link href="/proposal" className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-5 py-3.5 text-sm font-bold text-white">
              {t("hero.cta")} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href="#live" className="pressable inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-5 py-3.5 text-sm font-bold">
              {t("hero.demo")} <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
          <div className="mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
            {metrics.map(({ value, label, Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 + index * 0.08 }}
                className="bg-white p-5"
              >
                <Icon className="h-4 w-4 text-[var(--accent)]" />
                <strong className="mt-5 block text-2xl tracking-[-0.04em]">{value}</strong>
                <span className="mt-1 block text-xs font-semibold text-[var(--muted)]">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7 }} className="flex justify-center lg:justify-end">
          <SignalField />
        </motion.div>
      </div>
    </section>
  );
}
