"use client";

import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Droplets,
  Fan,
  Flame,
  Gauge,
  Globe2,
  Lightbulb,
  Mail,
  PanelsTopLeft,
  Phone,
} from "lucide-react";
import { CONTACTS } from "@/content/site";
import { useI18n } from "@/modules/i18n";
import {
  formatProposalMoney,
  getProposalModel,
  proposalModuleCopy,
} from "./model";
import type { ProposalData, ProposalModuleId } from "./types";

const icons: Record<ProposalModuleId, typeof PanelsTopLeft> = {
  bms: PanelsTopLeft,
  metering: Gauge,
  hvac: Fan,
  light: Lightbulb,
  water: Droplets,
  safety: Flame,
};

function BuyursinBrand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`proposal-buyursin-brand ${inverse ? "inverse" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo-buyursin.svg" alt="Buyursin Technics" />
    </div>
  );
}

function ClientBrand({ data, client, inverse = false }: { data: ProposalData; client: string; inverse?: boolean }) {
  return (
    <div className={`proposal-client-brand ${inverse ? "inverse" : ""}`}>
      <span>
        {data.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logoDataUrl} alt="" />
        ) : client.slice(0, 1).toUpperCase()}
      </span>
      <b>{client}</b>
    </div>
  );
}

function Footer({ index, inverse = false }: { index: number; inverse?: boolean }) {
  return (
    <div className={`proposal-slide-footer ${inverse ? "inverse" : ""}`}>
      <span>BUYURSIN TECHNICS</span>
      <span>{String(index).padStart(2, "0")}</span>
    </div>
  );
}

function Slide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section data-proposal-slide className={`slide-canvas proposal-slide ${className}`}>{children}</section>;
}

function ObjectPhoto({ data, fallback }: { data: ProposalData; fallback: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={data.objectPhotoDataUrl || fallback} alt="" className="proposal-object-photo" />
  );
}

export function SlideDeck({ data }: { data: ProposalData }) {
  const { locale } = useI18n();
  const model = getProposalModel(data, locale);
  const moduleCopy = proposalModuleCopy[locale];
  const stages = locale === "ru"
    ? ["Аудит", "Проектирование", "Монтаж", "Сервис 24/7"]
    : ["Audit", "Loyihalash", "Montaj", "24/7 servis"];
  const metrics = [
    [locale === "ru" ? "База расходов / год" : "Yillik xarajatlar bazasi", formatProposalMoney(model.annualBase, data.currency, locale, true)],
    [locale === "ru" ? "Расчётный эффект / год" : "Yillik hisobiy samara", formatProposalMoney(model.annualEffect, data.currency, locale, true)],
    [locale === "ru" ? "Сценарная экономия" : "Ssenariy bo‘yicha tejam", `${model.savingPercent}%`],
    [locale === "ru" ? "Простой срок окупаемости" : "Oddiy qoplanish muddati", model.payback > 0 ? `${model.payback.toFixed(1)} ${locale === "ru" ? "мес." : "oy"}` : "—"],
  ];

  return (
    <div className="proposal-deck" style={{ "--proposal-accent": data.accent } as React.CSSProperties}>
      <Slide className="proposal-slide-about">
        <div className="proposal-split">
          <div className="proposal-copy-column">
            <BuyursinBrand />
            <div className="proposal-copy-main">
              <span className="proposal-kicker">{locale === "ru" ? "О компании" : "Kompaniya haqida"}</span>
              <h2>{locale === "ru" ? "Инженерные системы под единой ответственностью" : "Barcha muhandislik tizimlari — yagona javobgarlik ostida"}</h2>
              <p>{locale === "ru"
                ? "BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы коммерческих зданий."
                : "BUYURSIN TECHNICS tijorat binolarining aqlli tizimlarini loyihalaydi, joriy etadi va ularga xizmat ko‘rsatadi."}</p>
              <div className="proposal-stage-pills">{stages.map(item => <span key={item}>{item}</span>)}</div>
            </div>
            <small className="proposal-signature">BMS · HVAC · SECURITY · ENERGY</small>
          </div>
          <div className="proposal-media-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/company-control-room.webp" alt="" />
            <div className="proposal-media-caption"><strong>24/7</strong><span>{locale === "ru" ? "МОНИТОРИНГ И СОПРОВОЖДЕНИЕ" : "MONITORING VA TEXNIK XIZMAT"}</span></div>
          </div>
        </div>
      </Slide>

      <Slide className="proposal-slide-offer">
        <div className="proposal-slide-header">
          <div><span className="proposal-kicker">{locale === "ru" ? "Предложение" : "Taklif"}</span><h2>{model.objectName}</h2></div>
          <ClientBrand data={data} client={model.client} />
        </div>
        <div className="proposal-offer-copy">
          <p>{model.offerDescription}</p>
          <div className="proposal-module-pills">
            {model.selectedModules.slice(0, 6).map(module => <span key={module}><Check />{moduleCopy[module].title}</span>)}
          </div>
          <div className="proposal-object-facts">
            <span><b>{new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ").format(model.area)} м²</b><small>{model.objectType}</small></span>
            <span><b>{model.selectedModules.length}</b><small>{locale === "ru" ? "выбранных систем" : "tanlangan tizim"}</small></span>
          </div>
        </div>
        <div className="proposal-offer-photo">
          <ObjectPhoto data={data} fallback="/assets/project-building.jpg" />
          <span>{locale === "ru" ? "Фото объекта · заменяемое" : "Obyekt fotosi · almashtiriladi"}</span>
        </div>
        <Footer index={2} />
      </Slide>

      <Slide className="proposal-slide-solutions">
        <div className="proposal-slide-header">
          <div><span className="proposal-kicker">{locale === "ru" ? "Решения" : "Yechimlar"}</span><h2>{locale === "ru" ? "Автоматизация делает объект управляемым" : "Avtomatlashtirish obyekt boshqaruvini soddalashtiradi"}</h2></div>
          <BuyursinBrand />
        </div>
        <div className="proposal-solution-grid">
          {model.selectedModules.slice(0, 6).map((module, index) => {
            const Icon = icons[module];
            return <article key={module}>
              <div><Icon /><small>{String(index + 1).padStart(2, "0")}</small></div>
              <strong>{moduleCopy[module].title}</strong>
              <p>{moduleCopy[module].benefit}</p>
            </article>;
          })}
        </div>
        <div className="proposal-data-line"><i /><span>{locale === "ru" ? "ДАННЫЕ · СЦЕНАРИИ · ЖУРНАЛ СОБЫТИЙ" : "MA’LUMOTLAR · SSENARIYLAR · VOQEALAR JURNALI"}</span><i /></div>
        <Footer index={3} />
      </Slide>

      <Slide className="proposal-slide-cost">
        <div className="proposal-slide-header">
          <BuyursinBrand inverse />
          <ClientBrand data={data} client={model.client} inverse />
        </div>
        <div className="proposal-cost-copy">
          <span className="proposal-kicker">{locale === "ru" ? "Стоимость" : "Narx"}</span>
          <h2>{locale === "ru" ? "Предварительный расчёт" : "Dastlabki hisob-kitob"}</h2>
          <strong>{formatProposalMoney(model.budget, data.currency, locale, true)}</strong>
          <p>{model.priceNote}</p>
        </div>
        <div className="proposal-cost-metrics">{metrics.map(([label, value]) => <article key={label}><small>{label}</small><b>{value}</b></article>)}</div>
        <div className="proposal-cost-note">
          <span>{model.objectName} · {new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "uz-UZ").format(model.area)} м²</span>
          <span>{locale === "ru" ? "Все значения редактируются в PowerPoint" : "Barcha qiymatlarni PowerPoint’da tahrirlash mumkin"}</span>
        </div>
        <Footer index={4} inverse />
      </Slide>

      <Slide className="proposal-slide-contact">
        <div className="proposal-split">
          <div className="proposal-copy-column">
            <BuyursinBrand />
            <div className="proposal-copy-main proposal-contact-copy">
              <span className="proposal-kicker">{locale === "ru" ? "Следующий шаг" : "Keyingi qadam"}</span>
              <h2>{model.ctaText}</h2>
              <p>{locale === "ru"
                ? "Уточним задачи, проверим исходные данные и подготовим подтверждённый состав решения."
                : "Vazifalarni aniqlashtiramiz, boshlang‘ich ma’lumotlarni tekshiramiz va yechimning tasdiqlangan tarkibini tayyorlaymiz."}</p>
              <div className="proposal-contact-list">
                <span><Phone />{CONTACTS.phoneDisplay}</span>
                <span><Mail />{CONTACTS.email}</span>
                <span><Globe2 />btechnics.uz</span>
              </div>
            </div>
            <div className="proposal-next-step"><CircleDollarSign />{locale === "ru" ? "ТЕХНИЧЕСКИЙ АУДИТ → ПОДТВЕРЖДЁННОЕ ПРЕДЛОЖЕНИЕ" : "TEXNIK AUDIT → TASDIQLANGAN TAKLIF"}</div>
          </div>
          <div className="proposal-media-frame">
            <ObjectPhoto data={data} fallback="/assets/hero-architectural.png" />
            <div className="proposal-media-caption proposal-contact-caption"><strong>{model.client}</strong><span>{model.objectName}</span><b>{locale === "ru" ? "Обсудить проект" : "Loyihani muhokama qilish"} <ArrowRight /></b></div>
          </div>
        </div>
      </Slide>
    </div>
  );
}
