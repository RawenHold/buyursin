"use client";

import { toPng } from "html-to-image";
import type PptxGenJS from "pptxgenjs";
import type { Locale } from "@/modules/i18n";
import {
  formatProposalMoney,
  getProposalModel,
  proposalModuleCopy,
} from "./model";
import type { ProposalData } from "./types";

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
      backgroundColor: "#f7f8f3",
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
  ink: "18210F",
  body: "5A6254",
  muted: "858E7E",
  pale: "EEF2E7",
  line: "D9DFCF",
  greenLight: "D3E0B6",
};

const font = "Arial";

function safeHex(value: string) {
  const normalized = value.replace("#", "").toUpperCase();
  return /^[0-9A-F]{6}$/.test(normalized) ? normalized : "607B35";
}

async function readAsset(url: string, baseUrl?: string) {
  try {
    const response = await fetch(baseUrl ? new URL(url, baseUrl).toString() : url);
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
    x: 0.75, y: 7.08, w: 2.4, h: 0.16,
    fontFace: font, fontSize: 7.5, bold: true,
    color: inverse ? "87917E" : colors.muted, margin: 0,
  });
  slide.addText(String(index).padStart(2, "0"), {
    x: 12.05, y: 7.08, w: 0.55, h: 0.16,
    fontFace: font, fontSize: 7.5, bold: true, align: "right",
    color: inverse ? "87917E" : colors.muted, margin: 0,
  });
}

function addKicker(slide: Slide, text: string, accent: string, y = 0.72) {
  slide.addText(text.toUpperCase(), {
    x: 0.75, y, w: 5.7, h: 0.22,
    fontFace: font, fontSize: 9.5, bold: true,
    charSpacing: 1.5, color: accent, margin: 0,
  });
}

function addTitle(slide: Slide, text: string, x: number, y: number, w: number, h: number, inverse = false, fontSize = 36) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: font, fontSize, bold: true,
    color: inverse ? colors.white : colors.ink,
    fit: "shrink", valign: "top", margin: 0,
    breakLine: false, lineSpacingMultiple: 0.88,
  });
}

function addBuyursinLogo(slide: Slide, logoData: string | undefined, pptx: PptxGenJS, inverse = false, x = 0.75, y = 0.45) {
  if (logoData) {
    if (inverse) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.2, h: 0.7,
        fill: { color: colors.white, transparency: 4 },
        line: { color: colors.white, transparency: 100 },
      });
    }
    slide.addImage({
      data: logoData,
      x: inverse ? x + 0.1 : x, y: inverse ? y + 0.05 : y, w: 2.0, h: 0.6,
      sizing: { type: "contain", x: inverse ? x + 0.1 : x, y: inverse ? y + 0.05 : y, w: 2.0, h: 0.6 },
      altText: "Buyursin Technics",
    });
    return;
  }
  slide.addText("BUYURSIN TECHNICS", {
    x, y: y + 0.18, w: 2.1, h: 0.3,
    fontFace: font, fontSize: 11.5, bold: true,
    color: inverse ? colors.white : colors.ink, margin: 0,
  });
}

function addClientBrand(slide: Slide, data: ProposalData, client: string, pptx: PptxGenJS, inverse = false) {
  const x = 10.25;
  const y = 0.5;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 0.55, h: 0.55,
    fill: { color: inverse ? colors.white : colors.ink },
    line: { color: inverse ? colors.white : colors.ink },
  });
  if (data.logoDataUrl) {
    slide.addImage({
      data: data.logoDataUrl,
      x: x + 0.07, y: y + 0.07, w: 0.41, h: 0.41,
      sizing: { type: "contain", x: x + 0.07, y: y + 0.07, w: 0.41, h: 0.41 },
      altText: localeAlt(data),
    });
  } else {
    slide.addText(client.slice(0, 1).toUpperCase(), {
      x, y: y + 0.13, w: 0.55, h: 0.2,
      fontFace: font, fontSize: 10, bold: true, align: "center",
      color: inverse ? colors.ink : colors.white, margin: 0,
    });
  }
  slide.addText(client, {
    x: x + 0.72, y: y + 0.13, w: 1.75, h: 0.26,
    fontFace: font, fontSize: 10, bold: true, align: "left",
    color: inverse ? colors.white : colors.ink, margin: 0, fit: "shrink",
  });
}

function localeAlt(data: ProposalData) {
  return data.client ? `Logo: ${data.client}` : "Client logo";
}

function addPhoto(slide: Slide, pptx: PptxGenJS, image: string | undefined, x: number, y: number, w: number, h: number, label: string) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: "E2E7DB" },
    line: { color: colors.line, width: 1 },
  });
  if (image) {
    slide.addImage({
      data: image,
      x, y, w, h,
      sizing: { type: "cover", x, y, w, h },
      altText: label,
    });
  } else {
    slide.addText(label, {
      x: x + 0.35, y: y + h / 2 - 0.25, w: w - 0.7, h: 0.5,
      fontFace: font, fontSize: 15, bold: true,
      color: colors.muted, align: "center", valign: "middle", margin: 0,
    });
  }
}

type ProposalAssetOverrides = {
  logo?: string;
  companyPhoto?: string;
  objectPhoto?: string;
  contactPhoto?: string;
};

export async function exportProposalPptx(
  data: ProposalData,
  locale: Locale,
  fileName: string,
  assetBaseUrl?: string,
  assetOverrides?: ProposalAssetOverrides,
) {
  const pptxModule = await import("pptxgenjs");
  const PptxGenJSClass = pptxModule.default;
  const pptx = new PptxGenJSClass();
  const accent = safeHex(data.accent);
  const model = getProposalModel(data, locale);
  const moduleCopy = proposalModuleCopy[locale];
  const ctaFontSize = model.ctaText.length > 54 ? 27 : model.ctaText.length > 38 ? 30 : 33;

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Buyursin Technics";
  pptx.subject = locale === "ru" ? "Коммерческое предложение" : "Tijorat taklifi";
  pptx.title = fileName;
  pptx.company = "Buyursin Technics";
  pptx.theme = { headFontFace: font, bodyFontFace: font };

  const [fetchedLogo, fetchedCompanyPhoto, fetchedObjectPhoto, fetchedContactPhoto] = await Promise.all([
    readAsset("/assets/logo-buyursin.png", assetBaseUrl),
    readAsset("/assets/company-control-room.webp", assetBaseUrl),
    readAsset("/assets/project-building.jpg", assetBaseUrl),
    readAsset("/assets/hero-architectural.png", assetBaseUrl),
  ]);
  const logo = assetOverrides?.logo || fetchedLogo;
  const companyPhoto = assetOverrides?.companyPhoto || fetchedCompanyPhoto;
  const fallbackObjectPhoto = assetOverrides?.objectPhoto || fetchedObjectPhoto;
  const contactPhoto = assetOverrides?.contactPhoto || fetchedContactPhoto;
  const objectPhoto = data.objectPhotoDataUrl || fallbackObjectPhoto;
  const closingPhoto = data.objectPhotoDataUrl || contactPhoto;

  // 1. About the company
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    addBuyursinLogo(slide, logo, pptx);
    addKicker(slide, locale === "ru" ? "О компании" : "Kompaniya haqida", accent, 1.48);
    addTitle(
      slide,
      locale === "ru" ? "Инженерные системы под единой ответственностью" : "Barcha muhandislik tizimlari — yagona javobgarlik ostida",
      0.75, 1.9, 5.45, 1.55, false, 36,
    );
    slide.addText(locale === "ru"
      ? "BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы коммерческих зданий."
      : "BUYURSIN TECHNICS tijorat binolarining aqlli tizimlarini loyihalaydi, joriy etadi va ularga xizmat ko‘rsatadi.", {
      x: 0.75, y: 3.62, w: 5.25, h: 0.74,
      fontFace: font, fontSize: 16.5, color: colors.body,
      fit: "shrink", valign: "top", margin: 0,
    });
    const stages = locale === "ru"
      ? ["Аудит", "Проектирование", "Монтаж", "Сервис 24/7"]
      : ["Audit", "Loyihalash", "Montaj", "24/7 servis"];
    let pillX = 0.75;
    stages.forEach((stage) => {
      const pillW = Math.max(0.95, Math.min(1.65, 0.62 + stage.length * 0.055));
      slide.addShape(pptx.ShapeType.roundRect, {
        x: pillX, y: 4.7, w: pillW, h: 0.42,
        fill: { color: colors.white },
        line: { color: colors.line, width: 0.8 },
      });
      slide.addText(stage, {
        x: pillX + 0.08, y: 4.82, w: pillW - 0.16, h: 0.16,
        fontFace: font, fontSize: 8.5, bold: true,
        color: colors.ink, align: "center", margin: 0, fit: "shrink",
      });
      pillX += pillW + 0.12;
    });
    slide.addText("BMS · HVAC · SECURITY · ENERGY", {
      x: 0.75, y: 6.72, w: 4.8, h: 0.18,
      fontFace: font, fontSize: 8, bold: true, charSpacing: 1.3,
      color: colors.muted, margin: 0,
    });
    addPhoto(slide, pptx, companyPhoto, 6.75, 0.35, 6.12, 6.78, locale === "ru" ? "Диспетчерский центр" : "Dispetcherlik markazi");
    slide.addShape(pptx.ShapeType.rect, {
      x: 6.75, y: 5.05, w: 6.12, h: 2.08,
      fill: { color: colors.ink, transparency: 18 },
      line: { color: colors.ink, transparency: 100 },
    });
    slide.addText("24/7", {
      x: 7.15, y: 5.72, w: 1.25, h: 0.46,
      fontFace: font, fontSize: 26, bold: true, color: colors.white, margin: 0,
    });
    slide.addText(locale === "ru" ? "МОНИТОРИНГ И СОПРОВОЖДЕНИЕ" : "MONITORING VA TEXNIK XIZMAT", {
      x: 8.55, y: 5.83, w: 3.65, h: 0.23,
      fontFace: font, fontSize: 8.5, bold: true, charSpacing: 1.1,
      color: "D7DECF", margin: 0, fit: "shrink",
    });
    addFooter(slide, 1);
  }

  // 2. Proposal
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    addKicker(slide, locale === "ru" ? "Предложение" : "Taklif", accent);
    addTitle(slide, model.objectName, 0.75, 1.08, 5.55, 0.7, false, 31);
    addClientBrand(slide, data, model.client, pptx);
    slide.addText(model.offerDescription, {
      x: 0.75, y: 2.0, w: 5.2, h: 1.2,
      fontFace: font, fontSize: 13.5, color: colors.body,
      fit: "shrink", valign: "top", margin: 0, breakLine: false,
    });
    model.selectedModules.slice(0, 6).forEach((id, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 0.75 + col * 2.65;
      const y = 3.46 + row * 0.58;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.42, h: 0.48,
        fill: { color: colors.white },
        line: { color: colors.line, width: 0.8 },
      });
      slide.addText("✓", {
        x: x + 0.14, y: y + 0.13, w: 0.22, h: 0.16,
        fontFace: font, fontSize: 10, bold: true, color: accent, margin: 0,
      });
      slide.addText(moduleCopy[id].title, {
        x: x + 0.42, y: y + 0.13, w: 1.82, h: 0.17,
        fontFace: font, fontSize: 9.5, bold: true, color: colors.ink,
        margin: 0, fit: "shrink",
      });
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.75, y: 5.48, w: 5.15, h: 0,
      line: { color: colors.line, width: 1 },
    });
    slide.addText(`${new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ").format(model.area)} м²`, {
      x: 0.75, y: 5.7, w: 1.8, h: 0.31,
      fontFace: font, fontSize: 18, bold: true, color: colors.ink, margin: 0,
    });
    slide.addText(model.objectType, {
      x: 0.75, y: 6.12, w: 2.2, h: 0.24,
      fontFace: font, fontSize: 10, color: colors.muted, margin: 0, fit: "shrink",
    });
    slide.addText(String(model.selectedModules.length), {
      x: 3.1, y: 5.7, w: 0.8, h: 0.31,
      fontFace: font, fontSize: 18, bold: true, color: colors.ink, margin: 0,
    });
    slide.addText(locale === "ru" ? "выбранных систем" : "tanlangan tizim", {
      x: 3.1, y: 6.12, w: 2.0, h: 0.24,
      fontFace: font, fontSize: 10, color: colors.muted, margin: 0,
    });
    addPhoto(slide, pptx, objectPhoto, 6.75, 1.48, 5.9, 5.48, locale === "ru" ? "Фото объекта" : "Obyekt fotosi");
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.02, y: 6.22, w: 2.25, h: 0.42,
      fill: { color: colors.white, transparency: 5 },
      line: { color: colors.white, transparency: 100 },
    });
    slide.addText(locale === "ru" ? "Фото объекта · заменяемое" : "Obyekt fotosi · almashtiriladi", {
      x: 7.13, y: 6.35, w: 2.03, h: 0.16,
      fontFace: font, fontSize: 8, bold: true, color: colors.ink,
      align: "center", margin: 0, fit: "shrink",
    });
    addFooter(slide, 2);
  }

  // 3. Solutions
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    addKicker(slide, locale === "ru" ? "Решения" : "Yechimlar", accent);
    addTitle(
      slide,
      locale === "ru" ? "Автоматизация делает объект управляемым" : "Avtomatlashtirish obyekt boshqaruvini soddalashtiradi",
      0.75, 1.08, 8.5, 0.95, false, 34,
    );
    addBuyursinLogo(slide, logo, pptx, false, 10.5, 0.46);
    model.selectedModules.slice(0, 6).forEach((id, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 0.75 + col * 4.15;
      const y = 2.75 + row * 1.62;
      slide.addShape(pptx.ShapeType.line, {
        x, y, w: 3.55, h: 0,
        line: { color: accent, width: 2.2 },
      });
      slide.addText(String(index + 1).padStart(2, "0"), {
        x: x + 3.02, y: y + 0.17, w: 0.5, h: 0.18,
        fontFace: font, fontSize: 8, bold: true, color: colors.muted,
        align: "right", margin: 0,
      });
      slide.addText(moduleCopy[id].title, {
        x, y: y + 0.38, w: 3.1, h: 0.32,
        fontFace: font, fontSize: 17, bold: true, color: colors.ink,
        margin: 0, fit: "shrink",
      });
      slide.addText(moduleCopy[id].benefit, {
        x, y: y + 0.85, w: 3.35, h: 0.5,
        fontFace: font, fontSize: 10.5, color: colors.body,
        margin: 0, fit: "shrink", valign: "top",
      });
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.75, y: 6.25, w: 4.05, h: 0,
      line: { color: colors.line, width: 1 },
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 8.53, y: 6.25, w: 4.05, h: 0,
      line: { color: colors.line, width: 1 },
    });
    slide.addText(locale === "ru" ? "ДАННЫЕ · СЦЕНАРИИ · ЖУРНАЛ СОБЫТИЙ" : "MA’LUMOTLAR · SSENARIYLAR · VOQEALAR JURNALI", {
      x: 4.9, y: 6.18, w: 3.55, h: 0.18,
      fontFace: font, fontSize: 8, bold: true, charSpacing: 1,
      align: "center", color: colors.muted, margin: 0, fit: "shrink",
    });
    addFooter(slide, 3);
  }

  // 4. Preliminary cost
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.ink };
    addBuyursinLogo(slide, logo, pptx, true);
    addClientBrand(slide, data, model.client, pptx, true);
    addKicker(slide, locale === "ru" ? "Стоимость" : "Narx", accent, 1.62);
    addTitle(slide, locale === "ru" ? "Предварительный расчёт" : "Dastlabki hisob-kitob", 0.75, 2.0, 5.1, 0.9, true, 34);
    slide.addText(formatProposalMoney(model.budget, data.currency, locale, true), {
      x: 0.75, y: 3.16, w: 5.15, h: 0.72,
      fontFace: font, fontSize: 36, bold: true, color: colors.white,
      margin: 0, fit: "shrink",
    });
    slide.addText(model.priceNote, {
      x: 0.75, y: 4.08, w: 5.0, h: 0.82,
      fontFace: font, fontSize: 13, color: "AEB9A7",
      margin: 0, fit: "shrink", valign: "top",
    });
    const metrics = [
      [locale === "ru" ? "База расходов / год" : "Yillik xarajatlar bazasi", formatProposalMoney(model.annualBase, data.currency, locale, true)],
      [locale === "ru" ? "Расчётный эффект / год" : "Yillik hisobiy samara", formatProposalMoney(model.annualEffect, data.currency, locale, true)],
      [locale === "ru" ? "Сценарная экономия" : "Ssenariy bo‘yicha tejam", `${model.savingPercent}%`],
      [locale === "ru" ? "Простой срок окупаемости" : "Oddiy qoplanish muddati", model.payback > 0 ? `${model.payback.toFixed(1)} ${locale === "ru" ? "мес." : "oy"}` : "—"],
    ];
    metrics.forEach(([label, value], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 6.45 + col * 3.0;
      const y = 1.52 + row * 2.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.72, h: 1.7,
        fill: { color: "25301C" },
        line: { color: "46503E", width: 1 },
      });
      slide.addText(label, {
        x: x + 0.23, y: y + 0.24, w: 2.25, h: 0.42,
        fontFace: font, fontSize: 9.5, bold: true, color: "A0AB99",
        margin: 0, fit: "shrink", valign: "top",
      });
      slide.addText(value, {
        x: x + 0.23, y: y + 0.95, w: 2.25, h: 0.38,
        fontFace: font, fontSize: 19, bold: true, color: colors.white,
        margin: 0, fit: "shrink",
      });
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.75, y: 6.18, w: 11.85, h: 0,
      line: { color: "46503E", width: 1 },
    });
    slide.addText(`${model.objectName} · ${new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ").format(model.area)} м²`, {
      x: 0.75, y: 6.42, w: 5.3, h: 0.2,
      fontFace: font, fontSize: 9, color: "93A08D", margin: 0, fit: "shrink",
    });
    slide.addText(locale === "ru" ? "Все значения редактируются в PowerPoint" : "Barcha qiymatlarni PowerPoint’da tahrirlash mumkin", {
      x: 7.1, y: 6.42, w: 5.5, h: 0.2,
      fontFace: font, fontSize: 9, bold: true, align: "right",
      color: colors.greenLight, margin: 0, fit: "shrink",
    });
    addFooter(slide, 4, true);
  }

  // 5. Contacts and next step
  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    addBuyursinLogo(slide, logo, pptx);
    addKicker(slide, locale === "ru" ? "Следующий шаг" : "Keyingi qadam", accent, 1.55);
    addTitle(slide, model.ctaText, 0.75, 1.9, 5.25, 1.55, false, ctaFontSize);
    slide.addText(locale === "ru"
      ? "Уточним задачи, проверим исходные данные и подготовим подтверждённый состав решения."
      : "Vazifalarni aniqlashtiramiz, boshlang‘ich ma’lumotlarni tekshiramiz va yechimning tasdiqlangan tarkibini tayyorlaymiz.", {
      x: 0.75, y: 3.66, w: 5.15, h: 0.64,
      fontFace: font, fontSize: 14.5, color: colors.body,
      margin: 0, fit: "shrink", valign: "top",
    });
    const contacts = [
      ["TEL", proposalContacts.phone],
      ["EMAIL", proposalContacts.email],
      ["WEB", proposalContacts.website],
    ];
    contacts.forEach(([label, value], index) => {
      const y = 4.55 + index * 0.48;
      slide.addText(label, {
        x: 0.75, y, w: 0.7, h: 0.18,
        fontFace: font, fontSize: 8, bold: true, color: accent,
        charSpacing: 1, margin: 0,
      });
      slide.addText(value, {
        x: 1.58, y: y - 0.02, w: 3.7, h: 0.24,
        fontFace: font, fontSize: 12.5, bold: true, color: colors.ink,
        margin: 0, fit: "shrink",
      });
    });
    slide.addText(locale === "ru" ? "ТЕХНИЧЕСКИЙ АУДИТ → ПОДТВЕРЖДЁННОЕ ПРЕДЛОЖЕНИЕ" : "TEXNIK AUDIT → TASDIQLANGAN TAKLIF", {
      x: 0.75, y: 6.62, w: 5.2, h: 0.2,
      fontFace: font, fontSize: 8, bold: true, charSpacing: 1.1,
      color: colors.muted, margin: 0, fit: "shrink",
    });
    addPhoto(slide, pptx, closingPhoto, 6.75, 0.35, 6.12, 6.78, locale === "ru" ? "Фото объекта" : "Obyekt fotosi");
    slide.addShape(pptx.ShapeType.rect, {
      x: 6.75, y: 4.9, w: 6.12, h: 2.23,
      fill: { color: colors.ink, transparency: 16 },
      line: { color: colors.ink, transparency: 100 },
    });
    slide.addText(model.client, {
      x: 7.15, y: 5.42, w: 4.6, h: 0.35,
      fontFace: font, fontSize: 20, bold: true, color: colors.white,
      margin: 0, fit: "shrink",
    });
    slide.addText(model.objectName, {
      x: 7.15, y: 5.9, w: 4.6, h: 0.25,
      fontFace: font, fontSize: 11, color: "D7DECF", margin: 0, fit: "shrink",
    });
    slide.addText(locale === "ru" ? "Обсудить проект  →" : "Loyihani muhokama qilish  →", {
      x: 7.15, y: 6.4, w: 3.6, h: 0.22,
      fontFace: font, fontSize: 10.5, bold: true, color: colors.white, margin: 0,
    });
    addFooter(slide, 5);
  }

  await pptx.writeFile({ fileName: `${fileName}.pptx` });
}
