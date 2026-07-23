"use client";

import { toPng } from "html-to-image";
import type PptxGenJS from "pptxgenjs";
import type { Locale } from "@/modules/i18n";
import type { ProposalData, ProposalModuleId } from "./types";

const proposalContacts = {
  phone: "+998 71 205 85 88",
  email: "info@btechnics.uz",
  website: "btechnics.uz",
} as const;

async function captureSlides(root: HTMLElement) {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-proposal-slide]"));
  if (!nodes.length) throw new Error("No proposal slides found");

  const images: string[] = [];
  for (const node of nodes) {
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#f7f8f5",
      filter: (element) => !(element instanceof HTMLElement && element.dataset.exportIgnore === "true"),
    });
    images.push(dataUrl);
  }
  return images;
}

export async function exportProposalPdf(root: HTMLElement, fileName: string) {
  const [{ jsPDF }, images] = await Promise.all([import("jspdf"), captureSlides(root)]);
  const width = 297;
  const height = 167.0625;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [width, height], compress: true });

  images.forEach((image, index) => {
    if (index > 0) pdf.addPage([width, height], "landscape");
    pdf.addImage(image, "PNG", 0, 0, width, height, undefined, "FAST");
  });
  pdf.save(`${fileName}.pdf`);
}

type Slide = PptxGenJS.Slide;

const colors = {
  paper: "F7F8F3",
  white: "FFFFFF",
  ink: "1A2310",
  body: "576050",
  muted: "858E7E",
  pale: "EEF2E7",
  line: "D8DFCD",
  green: "607B35",
  greenLight: "D3E0B6",
  red: "D9433E",
};

const moduleCopy: Record<Locale, Record<ProposalModuleId, { title: string; benefit: string }>> = {
  ru: {
    bms: { title: "BMS", benefit: "Единое управление, сценарии и журнал событий" },
    metering: { title: "АСКУЭ", benefit: "Почасовой учёт и прозрачный баланс по зонам" },
    hvac: { title: "Климат", benefit: "Контроль температуры, CO₂ и автоматической вентиляции" },
    light: { title: "Освещение", benefit: "Расписания и управление по датчикам присутствия" },
    water: { title: "Вода", benefit: "Контроль расхода и раннее обнаружение протечек" },
    safety: { title: "Безопасность", benefit: "Пожарные сценарии, видео и контроль доступа" },
  },
  uz: {
    bms: { title: "BMS", benefit: "Yagona boshqaruv, ssenariylar va voqealar jurnali" },
    metering: { title: "ASKUE", benefit: "Soatlik hisob va zonalar bo‘yicha shaffof balans" },
    hvac: { title: "Iqlim", benefit: "Harorat, CO₂ va avtomatik ventilyatsiya nazorati" },
    light: { title: "Yoritish", benefit: "Jadval va mavjudlik datchiklari bo‘yicha boshqaruv" },
    water: { title: "Suv", benefit: "Sarf nazorati va oqishni erta aniqlash" },
    safety: { title: "Xavfsizlik", benefit: "Yong‘in ssenariylari, video va kirish nazorati" },
  },
};

function safeHex(value: string) {
  const normalized = value.replace("#", "").toUpperCase();
  return /^[0-9A-F]{6}$/.test(normalized) ? normalized : colors.green;
}

function formatMoney(value: number, currency: ProposalData["currency"], locale: Locale, compact = false) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

async function readAsset(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

function addFooter(slide: Slide, index: number, inverse = false) {
  slide.addText("BUYURSIN TECHNICS", {
    x: 0.65, y: 7.04, w: 2.4, h: 0.18,
    fontFace: "Onest", fontSize: 8, bold: true,
    color: inverse ? "93A08D" : colors.muted, margin: 0,
  });
  slide.addText(`0${index}`, {
    x: 12.1, y: 7.04, w: 0.55, h: 0.18,
    fontFace: "Onest", fontSize: 8, bold: true, align: "right",
    color: inverse ? "93A08D" : colors.muted, margin: 0,
  });
}

function addKicker(slide: Slide, text: string, accent: string, inverse = false) {
  slide.addText(text.toUpperCase(), {
    x: 0.7, y: 0.65, w: 5.8, h: 0.22,
    fontFace: "Onest", fontSize: 9, bold: true,
    charSpacing: 1.3, color: inverse ? colors.greenLight : accent, margin: 0,
  });
}

function addTitle(slide: Slide, text: string, y: number, w = 6.1, inverse = false) {
  slide.addText(text, {
    x: 0.7, y, w, h: 1.25,
    fontFace: "Geologica", fontSize: 36, bold: true,
    color: inverse ? colors.white : colors.ink,
    breakLine: false, fit: "shrink", valign: "top", margin: 0,
  });
}

function addBuyursinLogo(slide: Slide, logoData: string | undefined, inverse = false, x = 10.65, y = 0.52) {
  if (logoData) {
    slide.addImage({ data: logoData, x, y, w: 1.95, h: 0.62, sizing: { type: "contain", x, y, w: 1.95, h: 0.62 }, altText: "Buyursin Technics" });
    return;
  }
  slide.addText("BUYURSIN\nTECHNICS", {
    x, y, w: 1.95, h: 0.62, fontFace: "Geologica", fontSize: 12, bold: true,
    color: inverse ? colors.white : colors.ink, margin: 0, breakLine: false,
  });
}

function addClientLogo(slide: Slide, data: ProposalData, pptx: PptxGenJS, inverse = false, x = 10.7, y = 0.5) {
  if (data.logoDataUrl) {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 1.9, h: 0.68, rectRadius: 0.08, fill: { color: colors.white }, line: { color: inverse ? "FFFFFF" : colors.line, transparency: inverse ? 72 : 0 } });
    slide.addImage({ data: data.logoDataUrl, x: x + 0.1, y: y + 0.08, w: 1.7, h: 0.52, sizing: { type: "contain", x: x + 0.1, y: y + 0.08, w: 1.7, h: 0.52 }, altText: "Логотип клиента" });
    return;
  }
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 1.9, h: 0.68, rectRadius: 0.08, fill: { color: inverse ? "29321F" : colors.white }, line: { color: inverse ? "59614F" : colors.line } });
  slide.addText(data.client || "CLIENT", { x: x + 0.12, y: y + 0.18, w: 1.66, h: 0.25, fontFace: "Onest", fontSize: 10, bold: true, align: "center", color: inverse ? colors.white : colors.ink, margin: 0, fit: "shrink" });
}

function addPhoto(slide: Slide, pptx: PptxGenJS, image: string | undefined, x: number, y: number, w: number, h: number, label: string) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: "E5EADB" }, line: { color: colors.line } });
  if (image) {
    slide.addImage({ data: image, x, y, w, h, sizing: { type: "cover", x, y, w, h }, altText: label });
  } else {
    slide.addText(label, { x: x + 0.3, y: y + h / 2 - 0.25, w: w - 0.6, h: 0.5, fontFace: "Onest", fontSize: 15, bold: true, color: colors.muted, align: "center", valign: "middle", margin: 0 });
  }
}

export async function exportProposalPptx(data: ProposalData, locale: Locale, fileName: string) {
  const pptxModule = await import("pptxgenjs");
  const PptxGenJSClass = pptxModule.default;
  const pptx = new PptxGenJSClass();
  const accent = safeHex(data.accent);
  const selectedModules = data.modules.length ? data.modules : ["bms"] as ProposalModuleId[];
  const annualBase = Math.max(0, data.monthlyEnergy + data.monthlyOps) * 12;
  const annualEffect = annualBase * (Math.max(0, data.savingPercent) / 100);
  const payback = annualEffect > 0 ? data.budget / annualEffect * 12 : 0;
  const offerDescription = data.offerDescription || (locale === "ru"
    ? "Аудит, проектирование, монтаж, пусконаладка и сервис инженерных систем в едином контуре ответственности."
    : "Muhandislik tizimlarini audit qilish, loyihalash, montaj qilish, ishga tushirish va yagona mas’uliyat doirasida xizmat ko‘rsatish.");
  const priceNote = data.priceNote || (locale === "ru"
    ? "Предварительная оценка. Итоговый состав и стоимость подтверждаются после технического аудита."
    : "Dastlabki baho. Yakuniy tarkib va narx texnik auditdan keyin tasdiqlanadi.");
  const ctaText = data.ctaText || (locale === "ru"
    ? "Согласовать техническое обследование объекта"
    : "Obyektni texnik ko‘rikdan o‘tkazishni kelishib olish");

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Buyursin Technics";
  pptx.subject = locale === "ru" ? "Коммерческое предложение" : "Tijorat taklifi";
  pptx.title = fileName;
  pptx.company = "Buyursin Technics";
  pptx.theme = { headFontFace: "Geologica", bodyFontFace: "Onest" };

  const [logo, companyPhoto, fallbackObjectPhoto, contactPhoto] = await Promise.all([
    readAsset("/assets/logo-buyursin.svg"),
    readAsset("/assets/company-control-room.webp"),
    readAsset("/assets/project-building.jpg"),
    readAsset("/assets/hero-architectural.png"),
  ]);
  const objectPhoto = data.objectPhotoDataUrl || fallbackObjectPhoto;
  const closingPhoto = data.objectPhotoDataUrl || contactPhoto;

  // 1. About the company
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    addKicker(slide, locale === "ru" ? "О компании" : "Kompaniya haqida", accent);
    addTitle(slide, locale === "ru" ? "Инженерные системы под единой ответственностью" : "Yagona mas’uliyat ostidagi muhandislik tizimlari", 1.14, 6.25);
    slide.addText(locale === "ru"
      ? "BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы коммерческих зданий."
      : "BUYURSIN TECHNICS tijorat binolarining aqlli tizimlarini loyihalaydi, joriy qiladi va ularga xizmat ko‘rsatadi.", {
      x: 0.72, y: 2.72, w: 5.45, h: 0.82, fontFace: "Onest", fontSize: 18, color: colors.body, breakLine: false, fit: "shrink", margin: 0,
    });
    const stages = locale === "ru" ? ["Аудит", "Проектирование", "Монтаж и запуск", "Сервис 24/7"] : ["Audit", "Loyihalash", "Montaj va ishga tushirish", "24/7 servis"];
    stages.forEach((stage, index) => {
      const y = 4.0 + index * 0.56;
      slide.addShape(pptx.ShapeType.ellipse, { x: 0.74, y: y + 0.03, w: 0.24, h: 0.24, fill: { color: index === 3 ? accent : colors.greenLight }, line: { color: index === 3 ? accent : colors.greenLight } });
      slide.addText(stage, { x: 1.12, y, w: 4.8, h: 0.3, fontFace: "Onest", fontSize: 15, bold: true, color: colors.ink, margin: 0 });
    });
    addPhoto(slide, pptx, companyPhoto, 7.0, 0.48, 5.65, 6.35, locale === "ru" ? "Место для фотографии компании" : "Kompaniya fotosi uchun joy");
    slide.addShape(pptx.ShapeType.rect, { x: 7.0, y: 5.45, w: 5.65, h: 1.38, fill: { color: colors.ink, transparency: 14 }, line: { color: colors.ink, transparency: 100 } });
    slide.addText("24/7", { x: 7.45, y: 5.7, w: 1.35, h: 0.52, fontFace: "Geologica", fontSize: 28, bold: true, color: colors.white, margin: 0 });
    slide.addText(locale === "ru" ? "Мониторинг и сопровождение" : "Monitoring va xizmat", { x: 8.85, y: 5.78, w: 3.2, h: 0.38, fontFace: "Onest", fontSize: 13, bold: true, color: "D7DECF", margin: 0 });
    addBuyursinLogo(slide, logo, false, 0.7, 6.45);
    addFooter(slide, 1);
  }

  // 2. Proposal
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.white };
    addKicker(slide, locale === "ru" ? "Предложение" : "Taklif", accent);
    addTitle(slide, data.objectName || (locale === "ru" ? "Ваш объект" : "Sizning obyektingiz"), 1.08, 6.25);
    addClientLogo(slide, data, pptx);
    slide.addText(offerDescription, { x: 0.72, y: 2.36, w: 5.3, h: 1.0, fontFace: "Onest", fontSize: 17, color: colors.body, margin: 0, fit: "shrink", valign: "top" });
    selectedModules.slice(0, 5).forEach((id, index) => {
      const item = moduleCopy[locale][id];
      const y = 3.65 + index * 0.48;
      slide.addText("✓", { x: 0.74, y, w: 0.28, h: 0.28, fontFace: "Onest", fontSize: 16, bold: true, color: accent, margin: 0 });
      slide.addText(item.title, { x: 1.1, y, w: 1.12, h: 0.28, fontFace: "Onest", fontSize: 14, bold: true, color: colors.ink, margin: 0 });
      slide.addText(item.benefit, { x: 2.2, y, w: 3.75, h: 0.3, fontFace: "Onest", fontSize: 11.5, color: colors.body, margin: 0, fit: "shrink" });
    });
    slide.addShape(pptx.ShapeType.line, { x: 0.72, y: 6.2, w: 5.25, h: 0, line: { color: colors.line, width: 1 } });
    slide.addText(`${new Intl.NumberFormat("ru-RU").format(data.area)} м²`, { x: 0.72, y: 6.35, w: 1.65, h: 0.35, fontFace: "Geologica", fontSize: 19, bold: true, color: colors.ink, margin: 0 });
    slide.addText(data.objectType, { x: 2.55, y: 6.38, w: 3.4, h: 0.3, fontFace: "Onest", fontSize: 12, color: colors.muted, margin: 0, fit: "shrink" });
    addPhoto(slide, pptx, objectPhoto, 6.55, 1.45, 6.08, 5.35, locale === "ru" ? "ФОТО ОБЪЕКТА\nЗамените изображение в PowerPoint" : "OBYEKT FOTOSI\nPowerPoint’da rasmni almashtiring");
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.85, y: 6.1, w: 2.55, h: 0.42, rectRadius: 0.08, fill: { color: colors.white, transparency: 8 }, line: { color: colors.white, transparency: 100 } });
    slide.addText(locale === "ru" ? "Фото объекта · заменяемое" : "Obyekt fotosi · almashtiriladi", { x: 7.02, y: 6.22, w: 2.25, h: 0.18, fontFace: "Onest", fontSize: 8.5, bold: true, color: colors.ink, margin: 0, align: "center" });
    addFooter(slide, 2);
  }

  // 3. Solutions and benefits
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    addKicker(slide, locale === "ru" ? "Решения" : "Yechimlar", accent);
    addTitle(slide, locale === "ru" ? "Автоматизация делает объект управляемым" : "Avtomatlashtirish obyektni boshqariladigan qiladi", 1.05, 8.4);
    addBuyursinLogo(slide, logo);
    selectedModules.slice(0, 6).forEach((id, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 0.72 + col * 4.18;
      const y = 3.0 + row * 1.55;
      const item = moduleCopy[locale][id];
      slide.addShape(pptx.ShapeType.line, { x, y, w: 3.55, h: 0, line: { color: accent, width: 2.4 } });
      slide.addText(`0${index + 1}`, { x, y: y + 0.22, w: 0.55, h: 0.28, fontFace: "Onest", fontSize: 10, bold: true, color: colors.muted, margin: 0 });
      slide.addText(item.title, { x: x + 0.72, y: y + 0.17, w: 2.75, h: 0.36, fontFace: "Geologica", fontSize: 19, bold: true, color: colors.ink, margin: 0, fit: "shrink" });
      slide.addText(item.benefit, { x: x + 0.72, y: y + 0.66, w: 2.8, h: 0.62, fontFace: "Onest", fontSize: 12.5, color: colors.body, margin: 0, fit: "shrink", valign: "top" });
    });
    slide.addShape(pptx.ShapeType.line, { x: 0.72, y: 6.35, w: 11.9, h: 0, line: { color: colors.line, width: 1 } });
    slide.addText(locale === "ru" ? "ДАННЫЕ · СЦЕНАРИИ · ЖУРНАЛ СОБЫТИЙ" : "MA’LUMOT · SSENARIY · VOQEALAR JURNALI", { x: 3.35, y: 6.55, w: 6.65, h: 0.25, fontFace: "Onest", fontSize: 9.5, bold: true, charSpacing: 1.2, align: "center", color: colors.muted, margin: 0 });
    addFooter(slide, 3);
  }

  // 4. Preliminary cost
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.ink };
    addKicker(slide, locale === "ru" ? "Стоимость" : "Narx", accent, true);
    addTitle(slide, locale === "ru" ? "Предварительный расчёт" : "Dastlabki hisob-kitob", 1.08, 5.9, true);
    addClientLogo(slide, data, pptx, true);
    slide.addText(formatMoney(data.budget, data.currency, locale, true), { x: 0.72, y: 2.45, w: 5.45, h: 0.78, fontFace: "Geologica", fontSize: 38, bold: true, color: colors.white, margin: 0, fit: "shrink" });
    slide.addText(priceNote, { x: 0.72, y: 3.46, w: 5.15, h: 0.85, fontFace: "Onest", fontSize: 14, color: "AEB9A7", margin: 0, fit: "shrink", valign: "top" });
    const metrics = [
      [locale === "ru" ? "База расходов / год" : "Yillik xarajatlar bazasi", formatMoney(annualBase, data.currency, locale, true)],
      [locale === "ru" ? "Сценарный эффект / год" : "Yillik ssenariy samarasi", formatMoney(annualEffect, data.currency, locale, true)],
      [locale === "ru" ? "Сценарная экономия" : "Ssenariy tejami", `${data.savingPercent}%`],
      [locale === "ru" ? "Простой срок окупаемости" : "Oddiy qoplanish muddati", `${payback.toFixed(1)} ${locale === "ru" ? "мес." : "oy"}`],
    ];
    metrics.forEach(([label, value], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 6.45 + col * 3.0;
      const y = 1.55 + row * 2.05;
      slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.68, h: 1.72, rectRadius: 0.08, fill: { color: "25301C" }, line: { color: "46503E", width: 1 } });
      slide.addText(label, { x: x + 0.22, y: y + 0.25, w: 2.22, h: 0.45, fontFace: "Onest", fontSize: 10, bold: true, color: "93A08D", margin: 0, fit: "shrink" });
      slide.addText(value, { x: x + 0.22, y: y + 0.94, w: 2.22, h: 0.42, fontFace: "Geologica", fontSize: 21, bold: true, color: colors.white, margin: 0, fit: "shrink" });
    });
    slide.addShape(pptx.ShapeType.line, { x: 0.72, y: 6.15, w: 11.9, h: 0, line: { color: "46503E", width: 1 } });
    slide.addText(`${data.objectName} · ${new Intl.NumberFormat("ru-RU").format(data.area)} м²`, { x: 0.72, y: 6.38, w: 5.4, h: 0.25, fontFace: "Onest", fontSize: 10, color: "93A08D", margin: 0 });
    slide.addText(locale === "ru" ? "Все значения редактируются в PowerPoint" : "Barcha qiymatlar PowerPoint’da tahrirlanadi", { x: 7.1, y: 6.38, w: 5.5, h: 0.25, fontFace: "Onest", fontSize: 10, bold: true, align: "right", color: colors.greenLight, margin: 0 });
    addFooter(slide, 4, true);
  }

  // 5. Contacts and CTA
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.white };
    addKicker(slide, locale === "ru" ? "Следующий шаг" : "Keyingi qadam", accent);
    addTitle(slide, ctaText, 1.08, 6.15);
    slide.addText(locale === "ru"
      ? "Уточним задачи, проверим исходные данные и подготовим подтверждённый состав решения."
      : "Vazifalarni aniqlashtiramiz, boshlang‘ich ma’lumotlarni tekshiramiz va tasdiqlangan yechim tarkibini tayyorlaymiz.", {
      x: 0.72, y: 2.65, w: 5.35, h: 0.85, fontFace: "Onest", fontSize: 17, color: colors.body, margin: 0, fit: "shrink",
    });
    const contacts = [
      ["TEL", proposalContacts.phone],
      ["EMAIL", proposalContacts.email],
      ["WEB", proposalContacts.website],
    ];
    contacts.forEach(([label, value], index) => {
      const y = 3.85 + index * 0.68;
      slide.addText(label, { x: 0.72, y, w: 0.75, h: 0.24, fontFace: "Onest", fontSize: 8.5, bold: true, color: accent, charSpacing: 1, margin: 0 });
      slide.addText(value, { x: 1.6, y: y - 0.03, w: 3.9, h: 0.32, fontFace: "Onest", fontSize: 15, bold: true, color: colors.ink, margin: 0, fit: "shrink" });
    });
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.72, y: 6.0, w: 5.3, h: 0.62, rectRadius: 0.08, fill: { color: accent }, line: { color: accent } });
    slide.addText(locale === "ru" ? "Технический аудит → подтверждённое предложение" : "Texnik audit → tasdiqlangan taklif", { x: 0.98, y: 6.2, w: 4.8, h: 0.22, fontFace: "Onest", fontSize: 11, bold: true, align: "center", color: colors.white, margin: 0 });
    addPhoto(slide, pptx, closingPhoto, 6.55, 0.5, 6.08, 6.32, locale === "ru" ? "Место для фотографии объекта" : "Obyekt fotosi uchun joy");
    slide.addShape(pptx.ShapeType.rect, { x: 6.55, y: 5.15, w: 6.08, h: 1.67, fill: { color: colors.ink, transparency: 12 }, line: { color: colors.ink, transparency: 100 } });
    slide.addText(data.client, { x: 6.95, y: 5.53, w: 3.8, h: 0.38, fontFace: "Geologica", fontSize: 20, bold: true, color: colors.white, margin: 0, fit: "shrink" });
    slide.addText(data.objectName, { x: 6.95, y: 6.02, w: 3.8, h: 0.3, fontFace: "Onest", fontSize: 12, color: "D6DECF", margin: 0, fit: "shrink" });
    addBuyursinLogo(slide, logo, true, 10.45, 5.58);
    addFooter(slide, 5);
  }

  await pptx.writeFile({ fileName: `${fileName}.pptx` });
}
