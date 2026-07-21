"use client";

import { motion } from "framer-motion";
import { Check, Droplets, Fan, Flame, Gauge, Lightbulb, PanelsTopLeft } from "lucide-react";
import { useI18n } from "@/modules/i18n";

const services = [
  { key: "bms", Icon: PanelsTopLeft },
  { key: "metering", Icon: Gauge },
  { key: "hvac", Icon: Fan },
  { key: "light", Icon: Lightbulb },
  { key: "water", Icon: Droplets },
  { key: "safety", Icon: Flame },
] as const;

export function Services() {
  const { t, list } = useI18n();
  return (
    <section id="services" className="section-space border-y border-[var(--line)] bg-white">
      <div className="site-shell">
        <span className="kicker">{t("services.kicker")}</span>
        <h2 className="section-title mt-6 max-w-5xl">{t("services.title")}</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, Icon }, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ backgroundColor: "#f4f8f5" }}
              className="group min-h-64 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-black text-black/20">0{index + 1}</span>
              </div>
              <h3 className="mt-12 text-2xl font-black tracking-[-0.04em]">{t(`services.${key}.title`)}</h3>
              <ul className="mt-5 space-y-2">
                {list(`services.${key}.items`).map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-semibold text-[var(--muted)]"><Check className="mt-0.5 h-4 w-4 text-[var(--accent)]" />{item}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
