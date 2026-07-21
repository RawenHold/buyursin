"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Droplets, Fan, LockKeyhole, Zap } from "lucide-react";
import { useI18n } from "@/modules/i18n";

type Mode = "energy" | "air" | "water" | "security";

const modeOrder: Mode[] = ["energy", "air", "water", "security"];
const modeMeta = {
  energy: { Icon: Zap, zone: 4, color: "#efb14d" },
  air: { Icon: Fan, zone: 7, color: "#4aa9c6" },
  water: { Icon: Droplets, zone: 10, color: "#4c8ed1" },
  security: { Icon: LockKeyhole, zone: 2, color: "#db665b" },
};

export function LiveDemo() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("energy");
  const active = modeMeta[mode];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMode((current) => modeOrder[(modeOrder.indexOf(current) + 1) % modeOrder.length]);
    }, 3300);
    return () => window.clearInterval(interval);
  }, []);

  const nodes = useMemo(() => Array.from({ length: 12 }), []);

  return (
    <section id="live" className="section-space">
      <div className="site-shell">
        <span className="kicker">{t("live.kicker")}</span>
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <h2 className="section-title max-w-5xl">{t("live.title")}</h2>
          <div className="flex flex-wrap gap-2">
            {modeOrder.map((item) => {
              const { Icon } = modeMeta[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  aria-label={t(`live.${item}`)}
                  className={`pressable grid h-11 w-11 place-items-center rounded-xl border ${mode === item ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[30px] border border-[var(--line)] bg-[#101815] p-3 shadow-[0_24px_90px_rgba(20,40,32,.14)] sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
            <div className="relative min-h-[560px] overflow-hidden rounded-[24px] bg-[#15211d] p-5 sm:p-8">
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:42px_42px]" />
              <svg viewBox="0 0 900 540" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <motion.path
                  d="M110 470 L110 120 L300 55 L485 115 L485 470 Z"
                  fill="none"
                  stroke="rgba(255,255,255,.2)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                />
                {[210, 300, 390].map((y) => (
                  <line key={y} x1="110" x2="485" y1={y} y2={y} stroke="rgba(255,255,255,.12)" strokeWidth="2" />
                ))}
                <motion.path
                  d="M485 290 C610 290 585 118 730 118 C805 118 808 200 808 270"
                  fill="none"
                  stroke={active.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 18"
                  animate={{ strokeDashoffset: [0, -60] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
                <circle cx="808" cy="290" r="62" fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.14)" strokeWidth="2" />
                <motion.circle
                  cx="808"
                  cy="290"
                  r="24"
                  fill={active.color}
                  animate={{ r: [18, 27, 18], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              </svg>

              <div className="relative grid h-full grid-cols-3 gap-3 pt-20 sm:grid-cols-4 lg:w-[58%]">
                {nodes.map((_, index) => {
                  const selected = index === active.zone;
                  return (
                    <motion.div
                      key={index}
                      className="relative min-h-24 rounded-2xl border border-white/10 bg-white/[.035]"
                      animate={selected ? { backgroundColor: ["rgba(255,255,255,.035)", `${active.color}33`, "rgba(255,255,255,.035)"] } : undefined}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <span className="absolute left-3 top-3 text-[10px] font-bold text-white/30">{String(index + 1).padStart(2, "0")}</span>
                      {selected && (
                        <motion.span
                          layoutId="active-sensor"
                          className="absolute bottom-3 right-3 h-3 w-3 rounded-full"
                          style={{ backgroundColor: active.color, boxShadow: `0 0 0 9px ${active.color}20` }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-white/45">
                  <span className="h-2 w-2 rounded-full bg-[#62d2ba] shadow-[0_0_0_6px_rgba(98,210,186,.12)]" /> Live
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.22 }}
                    className="text-sm font-bold text-white sm:text-base"
                  >
                    {t(`live.status.${mode}`)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {modeOrder.map((item) => {
                const { Icon, color } = modeMeta[item];
                const selected = item === mode;
                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-[22px] border p-5 text-left ${selected ? "border-white/20 bg-white/[.11]" : "border-white/8 bg-white/[.045]"}`}
                  >
                    {selected && <motion.div layoutId="demo-active" className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: color }} />}
                    <Icon className="h-5 w-5" style={{ color }} />
                    <div className="mt-8 text-sm font-bold text-white">{t(`live.${item}`)}</div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{ width: selected ? ["18%", "92%", "62%"] : "24%" }}
                        transition={{ duration: 2.5, repeat: selected ? Infinity : 0, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
