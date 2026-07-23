import type { Locale } from "@/modules/i18n";
import type { ProposalData, ProposalModuleId } from "./types";

export const proposalLimits = {
  client: 48,
  objectName: 72,
  objectType: 64,
  offerDescription: 240,
  priceNote: 190,
  ctaText: 72,
} as const;

export const proposalModuleCopy: Record<Locale, Record<ProposalModuleId, { title: string; benefit: string }>> = {
  ru: {
    bms: { title: "BMS", benefit: "Единое управление, сценарии и журнал событий" },
    metering: { title: "АСКУЭ", benefit: "Почасовой учёт и прозрачный баланс по зонам" },
    hvac: { title: "Климат", benefit: "Температура, CO₂ и автоматическая вентиляция" },
    light: { title: "Освещение", benefit: "Расписания и датчики присутствия" },
    water: { title: "Вода", benefit: "Контроль расхода и раннее обнаружение протечек" },
    safety: { title: "Безопасность", benefit: "Пожарные сценарии, видео и контроль доступа" },
  },
  uz: {
    bms: { title: "BMS", benefit: "Yagona boshqaruv, ssenariylar va voqealar jurnali" },
    metering: { title: "ASKUE", benefit: "Soatlik hisob va zonalar bo‘yicha shaffof balans" },
    hvac: { title: "Iqlim", benefit: "Harorat, CO₂ va avtomatik ventilyatsiya" },
    light: { title: "Yoritish", benefit: "Jadvallar va mavjudlik datchiklari" },
    water: { title: "Suv", benefit: "Sarf nazorati va suv oqishini erta aniqlash" },
    safety: { title: "Xavfsizlik", benefit: "Yong‘in ssenariylari, video va kirish nazorati" },
  },
};

export function clipProposalText(value: string, limit: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  const clipped = normalized.slice(0, Math.max(0, limit - 1));
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > limit * 0.72 ? lastSpace : clipped.length).trim()}…`;
}

export function formatProposalMoney(value: number, currency: ProposalData["currency"], locale: Locale, compact = false) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(Math.max(0, value));
}

export function getProposalModel(data: ProposalData, locale: Locale) {
  const annualBase = Math.max(0, data.monthlyEnergy + data.monthlyOps) * 12;
  const annualEffect = annualBase * (Math.max(0, data.savingPercent) / 100);
  const payback = annualEffect > 0 ? Math.max(0, data.budget) / annualEffect * 12 : 0;
  const selectedModules = (data.modules.length ? data.modules : ["bms"]) as ProposalModuleId[];

  const defaults = locale === "ru" ? {
    objectName: "Ваш объект",
    objectType: "Коммерческая недвижимость",
    offerDescription: "Аудит, проектирование, монтаж, пусконаладка и сервис инженерных систем в едином контуре ответственности.",
    priceNote: "Предварительная оценка. Итоговый состав и стоимость подтверждаются после технического аудита.",
    ctaText: "Согласовать техническое обследование объекта",
  } : {
    objectName: "Sizning obyektingiz",
    objectType: "Tijorat ko‘chmas mulki",
    offerDescription: "Muhandislik tizimlarini audit qilish, loyihalash, montaj qilish, ishga tushirish va ularga yagona mas’ul tomon sifatida xizmat ko‘rsatish.",
    priceNote: "Dastlabki baho. Yakuniy tarkib va narx texnik auditdan keyin tasdiqlanadi.",
    ctaText: "Obyektni texnik ko‘rikdan o‘tkazishni kelishish",
  };

  return {
    client: clipProposalText(data.client || "CLIENT", proposalLimits.client),
    objectName: clipProposalText(data.objectName || defaults.objectName, proposalLimits.objectName),
    objectType: clipProposalText(data.objectType || defaults.objectType, proposalLimits.objectType),
    offerDescription: clipProposalText(data.offerDescription || defaults.offerDescription, proposalLimits.offerDescription),
    priceNote: clipProposalText(data.priceNote || defaults.priceNote, proposalLimits.priceNote),
    ctaText: clipProposalText(data.ctaText || defaults.ctaText, proposalLimits.ctaText),
    selectedModules,
    annualBase,
    annualEffect,
    payback,
    budget: Math.max(0, data.budget),
    area: Math.max(0, data.area),
    savingPercent: Math.min(100, Math.max(0, data.savingPercent)),
  };
}
