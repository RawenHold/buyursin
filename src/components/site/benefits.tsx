"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Activity, Building2, Check, CircleDollarSign, UsersRound } from "lucide-react";
import { useI18n } from "@/modules/i18n";

const cards = [
  { key: "energy", Icon: CircleDollarSign, accent: "#166f67" },
  { key: "risk", Icon: Activity, accent: "#d55245" },
  { key: "team", Icon: UsersRound, accent: "#4465a7" },
  { key: "asset", Icon: Building2, accent: "#9b6a2d" },
] as const;

function BenefitVisual({ kind, active, accent }: { kind: string; active: boolean; accent: string }) {
  if (kind === "energy") {
    return (
      <div className="flex h-28 items-end gap-2">
        {[72, 58, 44, 31, 22].map((height, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-t-lg"
            style={{ backgroundColor: `${accent}${index === 4 ? "" : "30"}` }}
            animate={{ height: active ? `${height}%` : `${Math.min(height + 22, 92)}%` }}
            transition={{ duration: 0.45, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}
      </div>
    );
  }
  if (kind === "risk") {
    return (
      <div className="relative h-28">
        <div className="absolute left-4 top-1/2 h-px w-[calc(100%-2rem)] bg-black/10" />
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border bg-white"
            style={{ left: `${index * 29 + 4}%`, borderColor: index === 2 ? accent : "#dfe5df" }}
            animate={active && index === 2 ? { scale: [1, 1.18, 1], boxShadow: [`0 0 0 0 ${accent}00`, `0 0 0 10px ${accent}18`, `0 0 0 0 ${accent}00`] } : undefined}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {index < 2 ? <Check className="h-4 w-4 text-[var(--accent)]" /> : <span className="text-[10px] font-black">{index + 1}</span>}
          </motion.div>
        ))}
      </div>
    );
  }
  if (kind === "team") {
    return (
      <div className="flex h-28 items-center justify-center gap-3">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-black/[.045]"
            animate={active ? { x: [0, (1 - index) * 20], scale: [1, index === 1 ? 1.12 : 0.84] } : { x: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <UsersRound className="h-5 w-5" style={{ color: accent }} />
          </motion.div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid h-28 grid-cols-4 gap-2">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <motion.div
          key={index}
          className="rounded-lg bg-black/[.045]"
          animate={active ? { backgroundColor: index % 3 === 0 ? `${accent}28` : "rgba(0,0,0,.045)", y: index % 3 === 0 ? -3 : 0 } : undefined}
          transition={{ duration: 0.25, delay: index * 0.03 }}
        />
      ))}
    </div>
  );
}

export function Benefits() {
  const { t, list } = useI18n();
  const [active, setActive] = useState<string>("energy");

  return (
    <section id="benefits" className="section-space">
      <div className="site-shell">
        <span className="kicker">{t("benefits.kicker")}</span>
        <h2 className="section-title mt-6 max-w-5xl">{t("benefits.title")}</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ key, Icon, accent }) => {
            const selected = active === key;
            return (
              <motion.article
                key={key}
                onHoverStart={() => setActive(key)}
                onTapStart={() => setActive(key)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                className="kinetic-card cursor-default overflow-hidden p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: `${accent}13`, color: accent }}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: accent }}
                    animate={selected ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={{ repeat: selected ? Infinity : 0, duration: 1.5 }}
                  />
                </div>
                <h3 className="mt-7 text-2xl font-black tracking-[-0.04em]">{t(`benefit.${key}.title`)}</h3>
                <div className="mt-6 rounded-2xl border border-black/5 bg-[var(--background)] p-3">
                  <BenefitVisual kind={key} active={selected} accent={accent} />
                </div>
                <ul className="mt-6 space-y-2.5">
                  {list(`benefit.${key}.items`).map((item) => (
                    <li key={item} className="flex gap-2 text-sm font-semibold text-[var(--muted)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} /> {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
