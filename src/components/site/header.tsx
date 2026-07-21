"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Languages } from "lucide-react";
import { useI18n } from "@/modules/i18n";

export function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="site-shell flex h-14 items-center justify-between rounded-2xl border border-black/5 bg-white/88 px-3 shadow-[0_10px_40px_rgba(20,40,32,.07)] backdrop-blur-xl"
      >
        <Link href="/" className="pressable flex items-center gap-2 rounded-xl px-2 py-1.5 font-black tracking-[-0.03em]">
          <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent)] text-white">
            <span className="h-1.5 w-4 -rotate-45 rounded-full bg-white" />
          </span>
          <span className="hidden sm:inline">BUYURSIN</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {[
            ["#live", t("nav.live")],
            ["#compare", t("nav.compare")],
            ["#benefits", t("nav.benefits")],
            ["#services", t("nav.services")],
          ].map(([href, label]) => (
            <a key={href} href={href} className="pressable rounded-xl px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-black/[.035] hover:text-[var(--ink)]">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-[var(--line)] bg-white p-1 text-xs font-bold">
            <Languages className="mx-1 h-3.5 w-3.5 text-[var(--muted)]" />
            {(["ru", "uz"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`pressable rounded-lg px-2 py-1.5 uppercase ${locale === item ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <Link href="/proposal" className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-3.5 py-2.5 text-sm font-bold text-white">
            <span className="hidden sm:inline">{t("nav.proposal")}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
