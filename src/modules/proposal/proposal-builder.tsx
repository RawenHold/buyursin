"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, FileDown, Languages, LoaderCircle, Presentation, Upload } from "lucide-react";
import { useI18n } from "@/modules/i18n";
import { defaultProposal, proposalModules } from "./defaults";
import { exportProposalPdf, exportProposalPptx } from "./export";
import { proposalLimits } from "./model";
import { SlideDeck } from "./slide-deck";
import type { ProposalData, ProposalModuleId } from "./types";

function NumberInput({ value, onChange, min = 0, max, step = 1 }: { value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={Number.isFinite(value) ? value : 0}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
    />
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-black uppercase tracking-[.1em] text-[var(--muted)]">{label}</span>{children}</label>;
}

export function ProposalBuilder() {
  const { locale, setLocale, t } = useI18n();
  const [data, setData] = useState<ProposalData>(defaultProposal);
  const [exporting, setExporting] = useState<"pdf" | "pptx" | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("buyursin-proposal");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData({ ...defaultProposal, ...JSON.parse(saved) });
      } catch { /* ignore invalid local data */ }
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("buyursin-proposal", JSON.stringify({
        ...data,
        logoDataUrl: undefined,
        objectPhotoDataUrl: undefined,
      }));
    } catch { /* local storage can be unavailable or full */ }
  }, [data]);

  const patch = <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => setData((current) => ({ ...current, [key]: value }));

  const toggleModule = (module: ProposalModuleId) => {
    setData((current) => ({
      ...current,
      modules: current.modules.includes(module)
        ? current.modules.filter((item) => item !== module)
        : [...current.modules, module],
    }));
  };

  const handleImage = (key: "logoDataUrl" | "objectPhotoDataUrl", file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => patch(key, String(reader.result));
    reader.readAsDataURL(file);
  };

  const exportFile = async (type: "pdf" | "pptx") => {
    if (!deckRef.current || exporting) return;
    setExporting(type);
    try {
      const name = `${data.client || "client"}-${data.objectName || "proposal"}`.replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, "-").toLowerCase();
      if (type === "pdf") await exportProposalPdf(deckRef.current, name);
      else await exportProposalPptx(data, locale, name);
    } finally {
      setExporting(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef1ed]">
      <header className="no-print sticky top-0 z-40 border-b border-black/7 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="pressable grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-white"><ArrowLeft className="h-4 w-4" /></Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-black">{t("proposal.title")}</h1>
              <p className="hidden truncate text-xs text-[var(--muted)] sm:block">{t("proposal.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-[var(--line)] bg-white p-1 text-xs font-bold">
              <Languages className="mx-1 h-3.5 w-3.5 text-[var(--muted)]" />
              {(["ru", "uz"] as const).map((item) => <button key={item} onClick={() => setLocale(item)} className={`pressable rounded-lg px-2 py-1.5 uppercase ${locale === item ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`}>{item}</button>)}
            </div>
            <button onClick={() => exportFile("pdf")} disabled={Boolean(exporting)} className="pressable inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-xs font-black disabled:opacity-50">
              {exporting === "pdf" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}<span className="hidden sm:inline">{exporting === "pdf" ? t("proposal.exporting") : t("proposal.export.pdf")}</span>
            </button>
            <button onClick={() => exportFile("pptx")} disabled={Boolean(exporting)} className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-3 py-2.5 text-xs font-black text-white disabled:opacity-50">
              {exporting === "pptx" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Presentation className="h-4 w-4" />}<span className="hidden sm:inline">{exporting === "pptx" ? t("proposal.exporting") : t("proposal.export.pptx")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-5 p-4 sm:p-6 xl:grid-cols-[350px_1fr]">
        <aside className="no-print h-fit rounded-[24px] border border-black/7 bg-white p-4 shadow-sm xl:sticky xl:top-[88px] xl:max-h-[calc(100vh-112px)] xl:overflow-y-auto">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("proposal.form.client")}>
                <input maxLength={proposalLimits.client} value={data.client} onChange={(e) => patch("client", e.target.value)} className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]" />
              </Field>
              <Field label={t("proposal.form.object")}>
                <input maxLength={proposalLimits.objectName} value={data.objectName} onChange={(e) => patch("objectName", e.target.value)} className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]" />
              </Field>
            </div>
            <Field label={t("proposal.form.type")}>
              <input maxLength={proposalLimits.objectType} value={data.objectType} onChange={(e) => patch("objectType", e.target.value)} className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]" />
            </Field>
            <Field label={t("proposal.form.offer")}>
              <textarea maxLength={proposalLimits.offerDescription} value={data.offerDescription} placeholder={t("proposal.form.offer.placeholder")} onChange={(e) => patch("offerDescription", e.target.value)} rows={4} className="w-full resize-y rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold leading-5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]" />
              <span className="mt-1 block text-right text-[10px] font-bold text-[var(--muted)]">{data.offerDescription.length}/{proposalLimits.offerDescription}</span>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("proposal.form.area")}><NumberInput value={data.area} onChange={(value) => patch("area", value)} /></Field>
              <Field label={t("proposal.form.saving")}><NumberInput value={data.savingPercent} onChange={(value) => patch("savingPercent", value)} max={100} /></Field>
            </div>
            <Field label={t("proposal.form.energy")}><NumberInput value={data.monthlyEnergy} onChange={(value) => patch("monthlyEnergy", value)} step={1000000} /></Field>
            <Field label={t("proposal.form.ops")}><NumberInput value={data.monthlyOps} onChange={(value) => patch("monthlyOps", value)} step={1000000} /></Field>
            <Field label={t("proposal.form.budget")}><NumberInput value={data.budget} onChange={(value) => patch("budget", value)} step={1000000} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("proposal.form.currency")}>
                <select value={data.currency} onChange={(e) => patch("currency", e.target.value as ProposalData["currency"])} className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[var(--accent)]">
                  <option>UZS</option><option>USD</option>
                </select>
              </Field>
              <Field label={t("proposal.form.accent")}>
                <div className="flex rounded-xl border border-[var(--line)] bg-white p-1.5"><input type="color" value={data.accent} onChange={(e) => patch("accent", e.target.value)} className="h-8 w-full cursor-pointer rounded-lg border-0 bg-transparent" /></div>
              </Field>
            </div>
            <Field label={t("proposal.form.logo")}>
              <label className="pressable flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line)] bg-[var(--background)] px-3 py-3 text-xs font-black text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                <Upload className="h-4 w-4" /> PNG / JPG / SVG
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage("logoDataUrl", e.target.files?.[0])} />
              </label>
            </Field>
            <Field label={t("proposal.form.photo")}>
              <label className="pressable flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line)] bg-[var(--background)] px-3 py-3 text-xs font-black text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                <Upload className="h-4 w-4" /> PNG / JPG
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleImage("objectPhotoDataUrl", e.target.files?.[0])} />
              </label>
            </Field>
            <Field label={t("proposal.form.priceNote")}>
              <textarea maxLength={proposalLimits.priceNote} value={data.priceNote} placeholder={t("proposal.form.priceNote.placeholder")} onChange={(e) => patch("priceNote", e.target.value)} rows={3} className="w-full resize-y rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold leading-5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]" />
              <span className="mt-1 block text-right text-[10px] font-bold text-[var(--muted)]">{data.priceNote.length}/{proposalLimits.priceNote}</span>
            </Field>
            <Field label={t("proposal.form.cta")}>
              <textarea maxLength={proposalLimits.ctaText} value={data.ctaText} placeholder={t("proposal.form.cta.placeholder")} onChange={(e) => patch("ctaText", e.target.value)} rows={2} className="w-full resize-y rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold leading-5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]" />
              <span className="mt-1 block text-right text-[10px] font-bold text-[var(--muted)]">{data.ctaText.length}/{proposalLimits.ctaText}</span>
            </Field>
            <Field label={t("proposal.form.modules")}>
              <div className="grid grid-cols-2 gap-2">
                {proposalModules.map((module) => {
                  const selected = data.modules.includes(module);
                  return (
                    <button key={module} type="button" onClick={() => toggleModule(module)} className={`pressable flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-black ${selected ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}>
                      {t(`services.${module}.title`)} {selected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </aside>

        <section ref={deckRef} className="print-deck min-w-0 space-y-5">
          <SlideDeck data={data} />
        </section>
      </div>
    </main>
  );
}
