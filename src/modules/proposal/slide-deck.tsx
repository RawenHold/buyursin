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
import type { ProposalData, ProposalModuleId } from "./types";

const icons: Record<ProposalModuleId, typeof PanelsTopLeft> = {
  bms: PanelsTopLeft,
  metering: Gauge,
  hvac: Fan,
  light: Lightbulb,
  water: Droplets,
  safety: Flame,
};

function formatMoney(value: number, currency: ProposalData["currency"], compact = false) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

function ClientBrand({ data, inverse = false }: { data: ProposalData; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-[.8cqw]">
      <div className={`grid h-[3cqw] w-[3cqw] place-items-center overflow-hidden rounded-[.8cqw] ${inverse ? "bg-white" : "bg-[#1a2310]"}`}>
        {data.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logoDataUrl} alt="Client logo" className="h-full w-full object-contain p-[.35cqw]" />
        ) : (
          <span className={`text-[1.2cqw] font-black ${inverse ? "text-[#1a2310]" : "text-white"}`}>{data.client.slice(0, 1)}</span>
        )}
      </div>
      <span className={`slide-small font-black tracking-[-.02em] ${inverse ? "text-white" : "text-[#1a2310]"}`}>{data.client}</span>
    </div>
  );
}

function BuyursinBrand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`flex items-center gap-[.75cqw] font-black ${inverse ? "text-white" : "text-[#1a2310]"}`}>
      <span className="grid h-[2.8cqw] w-[2.8cqw] place-items-center rounded-[.75cqw] bg-[#607b35] text-[1.1cqw] text-white">B</span>
      <span className="slide-small tracking-[-.02em]">BUYURSIN TECHNICS</span>
    </div>
  );
}

function Footer({ index, inverse = false }: { index: number; inverse?: boolean }) {
  return (
    <div className={`absolute bottom-[3.2cqw] left-[5.7cqw] right-[5.7cqw] flex items-center justify-between slide-small font-bold ${inverse ? "text-white/45" : "text-black/35"}`}>
      <span>BUYURSIN TECHNICS</span>
      <span>0{index}</span>
    </div>
  );
}

function Slide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section data-proposal-slide className={`slide-canvas w-full rounded-[18px] border border-black/8 shadow-[0_18px_60px_rgba(20,40,32,.12)] ${className}`}>
      {children}
    </section>
  );
}

function ObjectPhoto({ data, fallback }: { data: ProposalData; fallback: string }) {
  return (
    <div className="absolute inset-0 bg-[#dce3d3]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={data.objectPhotoDataUrl || fallback} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

export function SlideDeck({ data }: { data: ProposalData }) {
  const { locale, t, list } = useI18n();
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
  const visibleModules = data.modules.length ? data.modules : ["bms"] as ProposalModuleId[];

  return (
    <div className="space-y-7">
      <Slide>
        <div className="absolute inset-0 grid grid-cols-[1.02fr_.98fr]">
          <div className="slide-pad flex flex-col justify-between">
            <BuyursinBrand />
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{locale === "ru" ? "О компании" : "Kompaniya haqida"}</div>
              <h2 className="slide-h2 mt-[1.8cqw] max-w-[48cqw]">{locale === "ru" ? "Инженерные системы под единой ответственностью" : "Yagona mas’uliyat ostidagi muhandislik tizimlari"}</h2>
              <p className="slide-body mt-[2cqw] max-w-[48cqw] text-black/55">{locale === "ru"
                ? "BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы коммерческих зданий."
                : "BUYURSIN TECHNICS tijorat binolarining aqlli tizimlarini loyihalaydi, joriy qiladi va ularga xizmat ko‘rsatadi."}</p>
              <div className="mt-[2.2cqw] flex gap-[.8cqw]">
                {(locale === "ru" ? ["Аудит", "Проектирование", "Монтаж", "Сервис 24/7"] : ["Audit", "Loyihalash", "Montaj", "24/7 servis"]).map(item =>
                  <span key={item} className="rounded-full border border-black/10 bg-white px-[1cqw] py-[.55cqw] slide-small font-bold">{item}</span>
                )}
              </div>
            </div>
            <div className="slide-small font-bold uppercase tracking-[.12em] text-black/35">BMS · HVAC · SECURITY · ENERGY</div>
          </div>
          <div className="relative m-[1.1cqw] overflow-hidden rounded-[1.8cqw] bg-[#1a2310]">
            <div className="absolute inset-0 bg-[url('/assets/company-control-room.webp')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2310]/85 via-transparent to-transparent" />
            <div className="absolute inset-x-[2.6cqw] bottom-[2.5cqw] text-white">
              <div className="text-[2.4cqw] font-black">24/7</div>
              <div className="slide-small mt-[.35cqw] font-bold uppercase tracking-[.12em] text-white/60">{locale === "ru" ? "Мониторинг и сопровождение" : "Monitoring va xizmat"}</div>
            </div>
          </div>
        </div>
      </Slide>

      <Slide>
        <div className="slide-pad h-full">
          <div className="flex items-start justify-between"><div><div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{locale === "ru" ? "Предложение" : "Taklif"}</div><h2 className="slide-h2 mt-[1.6cqw] max-w-[60cqw]">{data.objectName}</h2></div><ClientBrand data={data} /></div>
          <div className="mt-[3.3cqw] grid grid-cols-[.9fr_1.1fr] gap-[4cqw]">
            <div>
              <p className="slide-body text-black/55">{offerDescription}</p>
              <div className="mt-[2.2cqw] grid gap-[.8cqw]">
                {visibleModules.slice(0, 5).map(module => <div key={module} className="flex items-center gap-[.8cqw] text-[1.15cqw] font-black"><Check className="h-[1.05cqw] w-[1.05cqw]" style={{ color: data.accent }} />{t(`services.${module}.title`)}</div>)}
              </div>
              <div className="mt-[2.4cqw] flex gap-[2.4cqw] border-t border-black/10 pt-[1.5cqw]">
                <span><b className="block text-[1.55cqw]">{new Intl.NumberFormat("ru-RU").format(data.area)} м²</b><small className="slide-small text-black/45">{data.objectType}</small></span>
                <span><b className="block text-[1.55cqw]">{visibleModules.length}</b><small className="slide-small text-black/45">{locale === "ru" ? "выбранных систем" : "tanlangan tizim"}</small></span>
              </div>
            </div>
            <div className="relative min-h-[27cqw] overflow-hidden rounded-[1.5cqw]">
              <ObjectPhoto data={data} fallback="/assets/project-building.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2310]/75 via-transparent to-transparent" />
              <span className="absolute bottom-[1.6cqw] left-[1.6cqw] rounded-full bg-white/90 px-[1cqw] py-[.55cqw] slide-small font-black text-[#1a2310]">{locale === "ru" ? "Фото объекта · заменяемое" : "Obyekt fotosi · almashtiriladi"}</span>
            </div>
          </div>
          <Footer index={2} />
        </div>
      </Slide>

      <Slide>
        <div className="slide-pad h-full">
          <div className="flex items-start justify-between"><div><div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{locale === "ru" ? "Решения" : "Yechimlar"}</div><h2 className="slide-h2 mt-[1.6cqw] max-w-[68cqw]">{locale === "ru" ? "Автоматизация делает объект управляемым" : "Avtomatlashtirish obyektni boshqariladigan qiladi"}</h2></div><BuyursinBrand /></div>
          <div className="mt-[3.4cqw] grid grid-cols-3 gap-x-[2.2cqw] gap-y-[2.4cqw]">
            {visibleModules.slice(0, 6).map((module, index) => {
              const Icon = icons[module];
              return <div key={module} className="border-t-[.28cqw] pt-[1.2cqw]" style={{ borderColor: data.accent }}>
                <div className="flex items-center justify-between"><Icon className="h-[2cqw] w-[2cqw]" style={{ color: data.accent }} /><span className="slide-small font-black text-black/25">0{index + 1}</span></div>
                <div className="mt-[1.15cqw] text-[1.45cqw] font-black">{t(`services.${module}.title`)}</div>
                <div className="mt-[.7cqw] slide-small font-semibold leading-[1.55] text-black/48">{list(`services.${module}.items`).join(" · ")}</div>
              </div>;
            })}
          </div>
          <div className="absolute bottom-[6cqw] left-[5.7cqw] right-[5.7cqw] flex items-center gap-[1.4cqw]">
            <div className="h-px flex-1 bg-black/10" /><span className="slide-small font-black uppercase tracking-[.14em] text-black/35">{locale === "ru" ? "Данные · Сценарии · Журнал событий" : "Ma’lumot · Ssenariy · Voqealar jurnali"}</span><div className="h-px flex-1 bg-black/10" />
          </div>
          <Footer index={3} />
        </div>
      </Slide>

      <Slide className="bg-[#1a2310] text-white">
        <div className="slide-pad h-full">
          <div className="flex items-start justify-between"><BuyursinBrand inverse /><ClientBrand data={data} inverse /></div>
          <div className="mt-[3.8cqw] grid grid-cols-[.9fr_1.1fr] gap-[4cqw]">
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{locale === "ru" ? "Стоимость" : "Narx"}</div>
              <h2 className="slide-h2 mt-[1.5cqw]">{locale === "ru" ? "Предварительный расчёт" : "Dastlabki hisob-kitob"}</h2>
              <div className="mt-[2.8cqw] text-[3.7cqw] font-black tracking-[-.055em]">{formatMoney(data.budget, data.currency, true)}</div>
              <p className="slide-small mt-[1.2cqw] max-w-[42cqw] leading-[1.55] text-white/52">{priceNote}</p>
            </div>
            <div className="grid grid-cols-2 gap-[1cqw]">
              {[
                [locale === "ru" ? "База расходов / год" : "Yillik xarajatlar bazasi", formatMoney(annualBase, data.currency, true)],
                [locale === "ru" ? "Сценарный эффект / год" : "Yillik ssenariy samarasi", formatMoney(annualEffect, data.currency, true)],
                [locale === "ru" ? "Сценарная экономия" : "Ssenariy tejami", `${data.savingPercent}%`],
                [locale === "ru" ? "Простой срок окупаемости" : "Oddiy qoplanish muddati", `${payback.toFixed(1)} ${locale === "ru" ? "мес." : "oy"}`],
              ].map(([label, value]) => <div key={label} className="rounded-[1.2cqw] border border-white/10 bg-white/[.055] p-[1.45cqw]">
                <div className="slide-small font-bold text-white/42">{label}</div>
                <div className="mt-[1.15cqw] text-[2cqw] font-black tracking-[-.04em]">{value}</div>
              </div>)}
            </div>
          </div>
          <div className="absolute bottom-[6.3cqw] left-[5.7cqw] right-[5.7cqw] flex items-center justify-between border-t border-white/12 pt-[1.4cqw] slide-small text-white/45">
            <span>{data.objectName} · {new Intl.NumberFormat("ru-RU").format(data.area)} м²</span>
            <span>{locale === "ru" ? "Все значения редактируются в PowerPoint" : "Barcha qiymatlar PowerPoint’da tahrirlanadi"}</span>
          </div>
          <Footer index={4} inverse />
        </div>
      </Slide>

      <Slide>
        <div className="absolute inset-0 grid grid-cols-[1.04fr_.96fr]">
          <div className="slide-pad flex flex-col justify-between">
            <BuyursinBrand />
            <div>
              <div className="slide-small font-black uppercase tracking-[.16em]" style={{ color: data.accent }}>{locale === "ru" ? "Следующий шаг" : "Keyingi qadam"}</div>
              <h2 className="slide-h2 mt-[1.6cqw] max-w-[50cqw]">{ctaText}</h2>
              <p className="slide-body mt-[1.8cqw] max-w-[48cqw] text-black/50">{locale === "ru" ? "Уточним задачи, проверим исходные данные и подготовим подтверждённый состав решения." : "Vazifalarni aniqlashtiramiz, boshlang‘ich ma’lumotlarni tekshiramiz va tasdiqlangan yechim tarkibini tayyorlaymiz."}</p>
              <div className="mt-[2.3cqw] grid gap-[.75cqw] text-[1.1cqw] font-black">
                <span className="flex items-center gap-[.7cqw]"><Phone className="h-[1.05cqw] w-[1.05cqw]" style={{ color: data.accent }} />{CONTACTS.phoneDisplay}</span>
                <span className="flex items-center gap-[.7cqw]"><Mail className="h-[1.05cqw] w-[1.05cqw]" style={{ color: data.accent }} />{CONTACTS.email}</span>
                <span className="flex items-center gap-[.7cqw]"><Globe2 className="h-[1.05cqw] w-[1.05cqw]" style={{ color: data.accent }} />btechnics.uz</span>
              </div>
            </div>
            <div className="flex items-center gap-[1cqw] slide-small font-black uppercase tracking-[.12em] text-black/35"><CircleDollarSign className="h-[1.1cqw] w-[1.1cqw]" />{locale === "ru" ? "Технический аудит → подтверждённое предложение" : "Texnik audit → tasdiqlangan taklif"}</div>
          </div>
          <div className="relative m-[1.1cqw] overflow-hidden rounded-[1.8cqw] bg-[#1a2310]">
            <div className="absolute inset-0 bg-[url('/assets/hero-architectural.png')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2310]/90 via-[#1a2310]/20 to-transparent" />
            <div className="absolute inset-x-[2.7cqw] bottom-[2.6cqw] text-white">
              <div className="text-[2cqw] font-black">{data.client}</div>
              <div className="slide-small mt-[.45cqw] text-white/55">{data.objectName}</div>
              <div className="mt-[1.4cqw] flex items-center gap-[.8cqw] text-[1.05cqw] font-black">{locale === "ru" ? "Обсудить проект" : "Loyihani muhokama qilish"}<ArrowRight className="h-[1.2cqw] w-[1.2cqw]" /></div>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
}
