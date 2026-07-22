"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Check, Info, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AudienceId, ScenarioId } from "@/content/site";
import { copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

const scenarioIds: ScenarioId[] = ["energy", "climate", "leak", "access", "fire"];
const roleIds: AudienceId[] = ["owner", "management", "developer", "technical"];

function money(value: number, currency: "UZS" | "USD", locale: "ru" | "uz") {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function EfficiencyCalculator({ standalone = false }: { standalone?: boolean }) {
  const { locale } = useI18n();
  const c = copyFor(locale);
  const [role, setRole] = useState<AudienceId>("owner");
  const [objectType, setObjectType] = useState<string>(c.calculator.types[0]);
  const [area, setArea] = useState(12000);
  const [energy, setEnergy] = useState(120000000);
  const [ops, setOps] = useState(80000000);
  const [automation, setAutomation] = useState(0);
  const [currency, setCurrency] = useState<"UZS" | "USD">("UZS");
  const [selected, setSelected] = useState<ScenarioId[]>(["energy", "climate"]);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    const scenario = new URLSearchParams(window.location.search).get("scenario") as ScenarioId | null;
    if (!scenario || !scenarioIds.includes(scenario)) return;
    const frame = window.requestAnimationFrame(() => {
      setSelected([scenario]);
      setCalculated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const safeObjectType = c.calculator.types.some((type) => type === objectType) ? objectType : c.calculator.types[0];

  const result = useMemo(() => {
    const automationFactor = [1, 0.78, 0.5][automation] ?? 1;
    const areaFactor = Math.min(1.15, Math.max(0.86, area / 12000));
    const energyShare = selected.includes("energy") ? 0.16 : 0.05;
    const climateShare = selected.includes("climate") ? 0.08 : 0.02;
    const riskShare = selected.some((id) => ["leak", "access", "fire"].includes(id)) ? 0.045 : 0.015;
    const lowPct = Math.min(0.18, (energyShare * 0.55 + climateShare * 0.45 + riskShare * 0.35) * automationFactor * areaFactor);
    const highPct = Math.min(0.3, (energyShare + climateShare + riskShare) * automationFactor * areaFactor);
    const annualBase = (energy + ops) * 12;
    const low = annualBase * Math.max(0.045, lowPct);
    const high = annualBase * Math.max(0.085, highPct);
    const paybackLow = Math.max(1, 2.2 - selected.length * 0.12);
    const paybackHigh = Math.min(3, paybackLow + 1.15);
    return {
      low,
      high,
      lowPct: Math.round(Math.max(4.5, lowPct * 100)),
      highPct: Math.round(Math.max(8.5, highPct * 100)),
      paybackLow,
      paybackHigh,
    };
  }, [area, automation, energy, ops, selected]);

  const toggleScenario = (id: ScenarioId) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setCalculated(false);
  };

  const reset = () => {
    setRole("owner");
    setObjectType(c.calculator.types[0]);
    setArea(12000);
    setEnergy(120000000);
    setOps(80000000);
    setAutomation(0);
    setCurrency("UZS");
    setSelected(["energy", "climate"]);
    setCalculated(false);
  };

  const roleCopy = c.audience.items[role];
  const steps = locale === "ru" ? ["Объект", "Параметры", "Системы", "Результат"] : ["Obyekt", "Parametrlar", "Tizimlar", "Natija"];

  return (
    <section id="calculator" className={`section-block ${standalone ? "pt-10" : "bg-white"}`}>
      <div className="site-shell">
        <div className="section-heading">
          <span className="section-eyebrow">{c.calculator.eyebrow}</span>
          <h2>{c.calculator.title}</h2>
          <p>{c.calculator.subtitle}</p>
        </div>

        <div className="mt-9 overflow-hidden rounded-[26px] border border-[#dfe4ea] bg-white shadow-[0_20px_60px_rgba(16,24,40,.055)]">
          <div className="border-b border-[#e4e7ec] px-5 py-5 sm:px-7">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, index) => (
                <div key={step} className="flex min-w-0 items-center gap-2">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${index === 3 && calculated ? "bg-[#22a06b] text-white" : index <= 2 ? "bg-[#1769ff] text-white" : "bg-[#eaecf0] text-[#667085]"}`}>{index + 1}</span>
                  <span className="hidden truncate text-xs font-semibold text-[#475467] sm:block">{step}</span>
                  {index < 3 && <span className="h-px flex-1 bg-[#e4e7ec]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_.78fr]">
            <div className="border-b border-[#e4e7ec] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-label">
                  <span>{c.calculator.role}</span>
                  <select value={role} onChange={(event) => { setRole(event.target.value as AudienceId); setCalculated(false); }} className="field-control">
                    {roleIds.map((id) => <option key={id} value={id}>{c.audience.labels[id]}</option>)}
                  </select>
                </label>
                <label className="field-label">
                  <span>{c.calculator.objectType}</span>
                  <select value={safeObjectType} onChange={(event) => { setObjectType(event.target.value); setCalculated(false); }} className="field-control">
                    {c.calculator.types.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className="field-label">
                  <span>{c.calculator.area}</span>
                  <input type="number" min="100" step="100" value={area} onChange={(event) => { setArea(Number(event.target.value)); setCalculated(false); }} className="field-control" />
                </label>
                <label className="field-label">
                  <span>{c.calculator.currency}</span>
                  <select value={currency} onChange={(event) => { setCurrency(event.target.value as "UZS" | "USD"); setCalculated(false); }} className="field-control">
                    <option value="UZS">UZS</option><option value="USD">USD</option>
                  </select>
                </label>
                <label className="field-label">
                  <span>{c.calculator.monthlyEnergy}</span>
                  <input type="number" min="0" step="100000" value={energy} onChange={(event) => { setEnergy(Number(event.target.value)); setCalculated(false); }} className="field-control" />
                </label>
                <label className="field-label">
                  <span>{c.calculator.monthlyOps}</span>
                  <input type="number" min="0" step="100000" value={ops} onChange={(event) => { setOps(Number(event.target.value)); setCalculated(false); }} className="field-control" />
                </label>
                <label className="field-label sm:col-span-2">
                  <span>{c.calculator.automation}</span>
                  <select value={automation} onChange={(event) => { setAutomation(Number(event.target.value)); setCalculated(false); }} className="field-control">
                    {c.calculator.automationLevels.map((item, index) => <option key={item} value={index}>{item}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-6">
                <div className="text-sm font-bold text-[#344054]">{c.calculator.scenarios}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scenarioIds.map((id) => {
                    const active = selected.includes(id);
                    return <button key={id} type="button" onClick={() => toggleScenario(id)} className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${active ? "border-[#1769ff] bg-[#eef4ff] text-[#1769ff]" : "border-[#e4e7ec] bg-white text-[#667085] hover:bg-[#f9fafb]"}`}>{active && <Check className="mr-1.5 inline h-3.5 w-3.5" />}{c.scenario.tabs[id]}</button>;
                  })}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => setCalculated(true)} disabled={selected.length === 0} className="button-primary disabled:cursor-not-allowed disabled:opacity-50" data-label={c.calculator.calculate}><span className="button-label"><Calculator className="h-4 w-4" />{c.calculator.calculate}</span></button>
                <button type="button" onClick={reset} className="button-secondary" data-label={locale === "ru" ? "Сбросить" : "Qayta"}><span className="button-label"><RotateCcw className="h-4 w-4" />{locale === "ru" ? "Сбросить" : "Qayta"}</span></button>
              </div>
            </div>

            <div className={`p-5 sm:p-7 ${calculated ? "bg-[#f4f7ff]" : "bg-[#f8fafc]"}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#1769ff] shadow-sm"><Calculator className="h-5 w-5" /></span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#667085]">{safeObjectType} · {area.toLocaleString(locale === "ru" ? "ru-RU" : "uz-UZ")} м²</div>
                  <h3 className="mt-1 text-xl font-bold text-[#101828]">{c.calculator.resultTitle}</h3>
                </div>
              </div>

              {!calculated ? (
                <div className="mt-7 rounded-2xl border border-dashed border-[#cdd5df] bg-white/75 p-7 text-center text-sm leading-6 text-[#667085]">{locale === "ru" ? "Заполните параметры и нажмите «Показать расчёт»." : "Parametrlarni kiriting va hisobni ko‘rsating."}</div>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="result-card sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <div className="result-label">{c.calculator.annualEffect}</div>
                    <div className="mt-2 text-2xl font-bold tracking-[-.04em] text-[#101828]">{money(result.low, currency, locale)} — {money(result.high, currency, locale)}</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">{c.calculator.savingRange}</div>
                    <div className="mt-2 text-2xl font-bold text-[#1769ff]">{result.lowPct}–{result.highPct}%</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">{c.calculator.payback}</div>
                    <div className="mt-2 text-2xl font-bold text-[#101828]">{result.paybackLow.toFixed(1)}–{result.paybackHigh.toFixed(1)} {locale === "ru" ? "года" : "yil"}</div>
                  </div>
                  <div className="result-card sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <div className="result-label">{c.calculator.recommended}</div>
                    <div className="mt-3 flex flex-wrap gap-2">{selected.map((id) => <span key={id} className="rounded-lg bg-[#eef4ff] px-2.5 py-1.5 text-xs font-bold text-[#1769ff]">{c.scenario.tabs[id]}</span>)}</div>
                  </div>
                  <div className="result-card sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <div className="result-label">{c.audience.labels[role]}</div>
                    <div className="mt-2 text-sm font-bold leading-6 text-[#101828]">{roleCopy.headline}</div>
                    <div className="mt-3 flex flex-wrap gap-2">{roleCopy.points.map((point) => <span key={point} className="rounded-lg border border-[#e4e7ec] bg-[#f8fafc] px-2.5 py-1.5 text-xs font-semibold text-[#475467]">{point}</span>)}</div>
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-2 rounded-2xl border border-[#e4e7ec] bg-white p-4 text-xs leading-5 text-[#667085]"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1769ff]" />{c.calculator.disclaimer}</div>
              <Link href="/contacts#lead" className="button-primary mt-5 w-full justify-center" data-label={c.calculator.audit}><span className="button-label">{c.calculator.audit}<ArrowRight className="h-4 w-4" /></span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
