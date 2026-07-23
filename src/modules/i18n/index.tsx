"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "ru" | "uz";

type TranslationValue = string | string[];
type Dictionary = Record<string, TranslationValue>;

const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    "nav.live": "Live",
    "nav.compare": "До / после",
    "nav.benefits": "Выгоды",
    "nav.services": "Решения",
    "nav.proposal": "Создать КП",
    "hero.eyebrow": "Автоматизация коммерческих зданий",
    "hero.title.1": "Здание, которое",
    "hero.title.2": "само находит потери",
    "hero.subtitle": "Данные в реальном времени. Автоматические действия. Один понятный интерфейс.",
    "hero.cta": "Собрать предложение",
    "hero.demo": "Смотреть демонстрацию",
    "hero.kpi.1": "24/7",
    "hero.kpi.1.label": "контроль систем",
    "hero.kpi.2": "до 30%",
    "hero.kpi.2.label": "потенциал HVAC",
    "hero.kpi.3": "1 экран",
    "hero.kpi.3.label": "вместо разрозненных пультов",
    "live.kicker": "Демонстрация в реальном времени",
    "live.title": "Система видит. Система реагирует.",
    "live.energy": "Энергия",
    "live.air": "Воздух",
    "live.water": "Вода",
    "live.security": "Доступ",
    "live.status.energy": "Пик нагрузки снижен",
    "live.status.air": "Воздухообмен усилен",
    "live.status.water": "Клапан перекрыт",
    "live.status.security": "Доступ заблокирован",
    "compare.kicker": "Интерактивное сравнение",
    "compare.title": "От реакции постфактум — к управлению по данным",
    "compare.before": "До",
    "compare.after": "После",
    "compare.before.items": [
      "Счёт приходит в конце месяца",
      "Причина потерь неизвестна",
      "Аварии замечают вручную",
    ],
    "compare.after.items": [
      "Потребление видно онлайн",
      "Отклонение определяется сразу",
      "Сценарий запускается автоматически",
    ],
    "benefits.kicker": "Что получает владелец",
    "benefits.title": "Понятный результат для бизнеса",
    "benefit.energy.title": "Меньше расходов",
    "benefit.energy.items": ["Контроль пиков", "Расписание HVAC", "Учёт арендаторов"],
    "benefit.risk.title": "Меньше рисков",
    "benefit.risk.items": ["Ранние предупреждения", "Автоматические сценарии", "Журнал событий"],
    "benefit.team.title": "Меньше ручной работы",
    "benefit.team.items": ["Единый диспетчерский экран", "Приоритет заявок", "Контроль подрядчиков"],
    "benefit.asset.title": "Прозрачный актив",
    "benefit.asset.items": ["История параметров", "Отчёты по зонам", "Данные для CAPEX"],
    "services.kicker": "Категории решений",
    "services.title": "Подключаем только то, что даёт эффект",
    "services.bms.title": "BMS",
    "services.bms.items": ["Единое управление", "Сценарии и аварии"],
    "services.metering.title": "АСКУЭ",
    "services.metering.items": ["Почасовой учёт", "Баланс по зонам"],
    "services.hvac.title": "Климат",
    "services.hvac.items": ["Температура и CO₂", "Автоматическая вентиляция"],
    "services.light.title": "Освещение",
    "services.light.items": ["Датчики присутствия", "Расписания"],
    "services.water.title": "Вода",
    "services.water.items": ["Контроль расхода", "Защита от протечек"],
    "services.safety.title": "Безопасность",
    "services.safety.items": ["Пожарные сценарии", "Видео и доступ"],
    "cta.title": "Соберите КП под конкретный объект",
    "cta.subtitle": "Клиент, объект, услуги, расчёт эффекта и фирменный стиль — в одном конструкторе.",
    "cta.button": "Открыть конструктор",
    "footer.note": "Buyursin Technics · Автоматизация инженерных систем",
    "proposal.back": "На сайт",
    "proposal.title": "Конструктор КП",
    "proposal.subtitle": "Редактируйте данные — слайды обновятся автоматически.",
    "proposal.export.pdf": "Экспорт PDF",
    "proposal.export.pptx": "Экспорт PPTX",
    "proposal.form.client": "Клиент",
    "proposal.form.object": "Объект",
    "proposal.form.type": "Тип объекта",
    "proposal.form.offer": "Описание предложения",
    "proposal.form.offer.placeholder": "Оставьте пустым, чтобы использовать актуальное описание услуг с сайта.",
    "proposal.form.area": "Площадь, м²",
    "proposal.form.energy": "Электроэнергия / месяц",
    "proposal.form.ops": "Эксплуатация / месяц",
    "proposal.form.budget": "Бюджет внедрения",
    "proposal.form.currency": "Валюта",
    "proposal.form.accent": "Акцент",
    "proposal.form.logo": "Логотип клиента",
    "proposal.form.photo": "Фотография объекта",
    "proposal.form.priceNote": "Примечание к стоимости",
    "proposal.form.priceNote.placeholder": "Предварительная оценка. Итоговая стоимость определяется после аудита.",
    "proposal.form.cta": "Призыв к действию",
    "proposal.form.cta.placeholder": "Согласовать техническое обследование объекта.",
    "proposal.form.modules": "Модули",
    "proposal.form.saving": "Сценарная экономия, %",
    "proposal.slide.cover.kicker": "Коммерческое предложение",
    "proposal.slide.cover.title": "Автоматизация инженерных систем",
    "proposal.slide.cover.note": "Данные · Контроль · Автоматические действия",
    "proposal.slide.losses.kicker": "Точка старта",
    "proposal.slide.losses.title": "Скрытые потери становятся измеримыми",
    "proposal.slide.losses.a": "Энергия",
    "proposal.slide.losses.b": "Эксплуатация",
    "proposal.slide.losses.c": "Аварийные риски",
    "proposal.slide.solution.kicker": "Решение",
    "proposal.slide.solution.title": "Единая цифровая система объекта",
    "proposal.slide.effect.kicker": "Бизнес-эффект",
    "proposal.slide.effect.title": "Экономика проекта",
    "proposal.slide.effect.annual": "Сценарный эффект / год",
    "proposal.slide.effect.payback": "Простой срок окупаемости",
    "proposal.slide.effect.months": "мес.",
    "proposal.slide.plan.kicker": "План внедрения",
    "proposal.slide.plan.title": "От обследования до контроля 24/7",
    "proposal.slide.plan.steps": ["Аудит", "Проект", "Монтаж", "Пуск", "Аналитика"],
    "proposal.slide.plan.cta": "Следующий шаг: техническое обследование объекта",
    "proposal.exporting": "Формируем файл…",
  },
  uz: {
    "nav.live": "Live",
    "nav.compare": "Oldin / keyin",
    "nav.benefits": "Foyda",
    "nav.services": "Yechimlar",
    "nav.proposal": "Tijorat taklifini yaratish",
    "hero.eyebrow": "Tijorat binolarini avtomatlashtirish",
    "hero.title.1": "Yo‘qotishlarni",
    "hero.title.2": "o‘zi aniqlaydigan bino",
    "hero.subtitle": "Real vaqt ma’lumotlari. Avtomatik harakatlar. Bitta tushunarli interfeys.",
    "hero.cta": "Taklif yaratish",
    "hero.demo": "Namoyishni ko‘rish",
    "hero.kpi.1": "24/7",
    "hero.kpi.1.label": "tizimlar nazorati",
    "hero.kpi.2": "30% gacha",
    "hero.kpi.2.label": "HVAC bo‘yicha tejam salohiyati",
    "hero.kpi.3": "1 ekran",
    "hero.kpi.3.label": "tarqoq pultlar o‘rniga",
    "live.kicker": "Real vaqt namoyishi",
    "live.title": "Tizim ko‘radi. Tizim javob beradi.",
    "live.energy": "Energiya",
    "live.air": "Havo",
    "live.water": "Suv",
    "live.security": "Kirish",
    "live.status.energy": "Yuklama cho‘qqisi pasaytirildi",
    "live.status.air": "Havo almashinuvi kuchaytirildi",
    "live.status.water": "Klapan yopildi",
    "live.status.security": "Kirish bloklandi",
    "compare.kicker": "Interaktiv taqqoslash",
    "compare.title": "Kechikkan reaksiyadan — ma’lumotlar asosidagi boshqaruvga",
    "compare.before": "Oldin",
    "compare.after": "Keyin",
    "compare.before.items": [
      "Hisob oy oxirida keladi",
      "Yo‘qotish sababi noma’lum",
      "Nosozlik qo‘lda aniqlanadi",
    ],
    "compare.after.items": [
      "Sarf onlayn ko‘rinadi",
      "Og‘ish darhol aniqlanadi",
      "Ssenariy avtomatik ishga tushadi",
    ],
    "benefits.kicker": "Egasi nima oladi",
    "benefits.title": "Biznes uchun tushunarli natija",
    "benefit.energy.title": "Kamroq xarajat",
    "benefit.energy.items": ["Eng yuqori yuklamalar nazorati", "HVAC jadvali", "Ijarachilar hisobi"],
    "benefit.risk.title": "Kamroq xavf",
    "benefit.risk.items": ["Erta ogohlantirish", "Avtomatik ssenariy", "Voqealar jurnali"],
    "benefit.team.title": "Kamroq qo‘l mehnati",
    "benefit.team.items": ["Yagona dispetcher ekrani", "Arizalar ustuvorligi", "Pudratchilar nazorati"],
    "benefit.asset.title": "Boshqariladigan aktiv",
    "benefit.asset.items": ["Parametrlar tarixi", "Zonalar bo‘yicha hisobot", "CAPEX uchun ma’lumot"],
    "services.kicker": "Yechim toifalari",
    "services.title": "Faqat o‘lchanadigan samara beradigan tizimlarni ulaymiz",
    "services.bms.title": "BMS",
    "services.bms.items": ["Yagona boshqaruv", "Ssenariy va avariyalar"],
    "services.metering.title": "ASKUE",
    "services.metering.items": ["Soatlik hisob", "Zonalar balansi"],
    "services.hvac.title": "Iqlim",
    "services.hvac.items": ["Harorat va CO₂", "Avtomatik ventilyatsiya"],
    "services.light.title": "Yoritish",
    "services.light.items": ["Mavjudlik sensorlari", "Jadvallar"],
    "services.water.title": "Suv",
    "services.water.items": ["Sarf nazorati", "Oqishdan himoya"],
    "services.safety.title": "Xavfsizlik",
    "services.safety.items": ["Yong‘in ssenariylari", "Video va kirish"],
    "cta.title": "Aniq obyekt uchun tijorat taklifini yarating",
    "cta.subtitle": "Mijoz, obyekt, xizmatlar, samara hisobi va brend uslubi — bitta konstruktorda.",
    "cta.button": "Konstruktorni ochish",
    "footer.note": "Buyursin Technics · Muhandislik tizimlarini avtomatlashtirish",
    "proposal.back": "Saytga",
    "proposal.title": "Tijorat taklifi konstruktori",
    "proposal.subtitle": "Ma’lumotlarni tahrirlang — slaydlar avtomatik yangilanadi.",
    "proposal.export.pdf": "PDF yuklab olish",
    "proposal.export.pptx": "PPTX yuklab olish",
    "proposal.form.client": "Mijoz",
    "proposal.form.object": "Obyekt",
    "proposal.form.type": "Obyekt turi",
    "proposal.form.offer": "Taklif tavsifi",
    "proposal.form.offer.placeholder": "Standart xizmat tavsifidan foydalanish uchun maydonni bo‘sh qoldiring.",
    "proposal.form.area": "Maydon, m²",
    "proposal.form.energy": "Elektr / oy",
    "proposal.form.ops": "Ekspluatatsiya / oy",
    "proposal.form.budget": "Joriy etish budjeti",
    "proposal.form.currency": "Valyuta",
    "proposal.form.accent": "Asosiy rang",
    "proposal.form.logo": "Mijoz logotipi",
    "proposal.form.photo": "Obyekt fotosurati",
    "proposal.form.priceNote": "Narx bo‘yicha izoh",
    "proposal.form.priceNote.placeholder": "Dastlabki baho. Yakuniy narx auditdan keyin aniqlanadi.",
    "proposal.form.cta": "Keyingi qadam",
    "proposal.form.cta.placeholder": "Obyektni texnik ko‘rikdan o‘tkazishni kelishib olish.",
    "proposal.form.modules": "Modullar",
    "proposal.form.saving": "Ssenariy tejami, %",
    "proposal.slide.cover.kicker": "Tijorat taklifi",
    "proposal.slide.cover.title": "Muhandislik tizimlarini avtomatlashtirish",
    "proposal.slide.cover.note": "Ma’lumot · Nazorat · Avtomatik harakatlar",
    "proposal.slide.losses.kicker": "Boshlang‘ich nuqta",
    "proposal.slide.losses.title": "Yashirin yo‘qotishlar o‘lchanadigan bo‘ladi",
    "proposal.slide.losses.a": "Energiya",
    "proposal.slide.losses.b": "Ekspluatatsiya",
    "proposal.slide.losses.c": "Avariya xavfi",
    "proposal.slide.solution.kicker": "Yechim",
    "proposal.slide.solution.title": "Obyektning yagona raqamli tizimi",
    "proposal.slide.effect.kicker": "Biznes samarasi",
    "proposal.slide.effect.title": "Loyiha iqtisodiyoti",
    "proposal.slide.effect.annual": "Hisobiy samara / yil",
    "proposal.slide.effect.payback": "Oddiy qoplanish muddati",
    "proposal.slide.effect.months": "oy",
    "proposal.slide.plan.kicker": "Joriy etish rejasi",
    "proposal.slide.plan.title": "Auditdan 24/7 nazoratgacha",
    "proposal.slide.plan.steps": ["Audit", "Loyiha", "Montaj", "Ishga tushirish", "Tahlil"],
    "proposal.slide.plan.cta": "Keyingi qadam: obyektni texnik ko‘rikdan o‘tkazish",
    "proposal.exporting": "Fayl tayyorlanmoqda…",
  },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  list: (key: string) => string[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem("buyursin-locale");
    if (stored === "ru" || stored === "uz") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("buyursin-locale", next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => {
        const value = dictionaries[locale][key] ?? dictionaries.ru[key] ?? key;
        return Array.isArray(value) ? value.join(" · ") : value;
      },
      list: (key) => {
        const value = dictionaries[locale][key] ?? dictionaries.ru[key] ?? [];
        return Array.isArray(value) ? value : [value];
      },
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
