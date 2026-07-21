"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/modules/i18n";

export function Cta() {
  const { t } = useI18n();
  return (
    <section className="section-space">
      <div className="site-shell">
        <div className="relative overflow-hidden rounded-[34px] bg-[var(--ink)] px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-20">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/8" />
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/8" />
          <motion.div
            className="absolute right-20 top-16 h-5 w-5 rounded-full bg-[#64d2bc] shadow-[0_0_0_12px_rgba(100,210,188,.1)]"
            animate={{ x: [0, 90, 0], y: [0, 55, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative max-w-4xl">
            <h2 className="section-title">{t("cta.title")}</h2>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/58 sm:text-lg">{t("cta.subtitle")}</p>
            <Link href="/proposal" className="pressable mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[var(--ink)]">
              {t("cta.button")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
