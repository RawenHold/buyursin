"use client";

import { useI18n } from "@/modules/i18n";

type PageKind = "solutions" | "projects" | "company" | "contacts" | "calculator";

const content = {
  ru: {
    solutions: { eyebrow: "Решения", title: <>Инженерные системы<br />как единый комплекс.</>, text: "От проектирования до сервиса 24/7. Выберите решение или начните с бизнес-сценария." },
    projects: { eyebrow: "Опыт", title: <>Опыт, который можно<br />применить к вашему объекту.</>, text: "Показываем объекты и бренды из презентации компании. Детальные цифры публикуются после подтверждения." },
    company: { eyebrow: "Buyursin Technics", title: <>Полный цикл.<br />Один ответственный партнёр.</>, text: "Проектируем, интегрируем, запускаем и поддерживаем инженерные и слаботочные системы." },
    contacts: { eyebrow: "Контакты", title: <>Начнём с задачи<br />вашего объекта.</>, text: "Расчёт эффективности, аудит, консультация или запрос коммерческого предложения." },
    calculator: { eyebrow: "Расчёт", title: <>Предварительный расчёт<br />для вашего объекта.</>, text: "Оцените ориентировочную экономию, подходящие сценарии и следующий шаг." },
  },
  uz: {
    solutions: { eyebrow: "Yechimlar", title: <>Muhandislik tizimlari<br />yagona majmua sifatida.</>, text: "Loyihalashdan 24/7 servisgacha. Yechimni tanlang yoki biznes ssenariysidan boshlang." },
    projects: { eyebrow: "Tajriba", title: <>Obyektingizga qo‘llash mumkin<br />bo‘lgan tajriba.</>, text: "Kompaniya taqdimotidagi obyekt va brendlarni ko‘rsatamiz. Batafsil raqamlar tasdiqlangandan keyin beriladi." },
    company: { eyebrow: "Buyursin Technics", title: <>To‘liq sikl.<br />Bitta mas’ul hamkor.</>, text: "Muhandislik va past tokli tizimlarni loyihalaymiz, integratsiya qilamiz, ishga tushiramiz va qo‘llab-quvvatlaymiz." },
    contacts: { eyebrow: "Aloqa", title: <>Obyektingiz vazifasidan<br />boshlaymiz.</>, text: "Samaradorlik hisobi, audit, konsultatsiya yoki tijorat taklifi so‘rovi." },
    calculator: { eyebrow: "Hisob", title: <>Obyektingiz uchun<br />dastlabki hisob.</>, text: "Taxminiy tejash, mos ssenariylar va keyingi qadamni baholang." },
  },
} as const;

export function PageHero({ kind, compact = false }: { kind: PageKind; compact?: boolean }) {
  const { locale } = useI18n();
  const item = content[locale][kind];
  return (
    <div className={`page-hero ${compact ? "compact" : ""}`}>
      <div className="site-shell">
        <span className="section-eyebrow">{item.eyebrow}</span>
        <h1>{item.title}</h1>
        {item.text && <p>{item.text}</p>}
      </div>
    </div>
  );
}
