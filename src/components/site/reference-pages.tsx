"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, Bell, Building2, Calculator,
  CalendarDays, CheckCircle2, ClipboardCheck, Clock3, CloudSun,
  Droplets, FileCheck2, FileText, Flame, Gauge, Globe2, Headphones,
  Leaf, LockKeyhole, Mail, MenuSquare, Phone,
  Settings2, ShieldCheck, SlidersHorizontal, Thermometer,
  TrendingDown, UserCheck, Users, Wrench, Zap,
  type LucideIcon,
} from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { SiteHeader } from "@/components/site/site-header";
import { CONTACTS, copyFor } from "@/content/site";
import { useI18n, type Locale } from "@/modules/i18n";

const SYSTEMS = [
  { slug: "energy", name: "Энергия", short: "Учёт и оптимизация потребления", icon: Zap },
  { slug: "climate", name: "Климат", short: "Температура, влажность и качество воздуха", icon: CloudSun },
  { slug: "leak", name: "Протечка", short: "Раннее обнаружение и автоматическое перекрытие", icon: Droplets },
  { slug: "access", name: "Доступ", short: "Контроль доступа и учёт рабочего времени", icon: LockKeyhole },
  { slug: "fire", name: "Пожар", short: "Обнаружение, оповещение и эвакуационные сценарии", icon: Flame },
] as const;

const PARTNER_LOGOS = [
  { name: "Siemens", src: "/assets/partners/siemens.svg", fit: "wide" },
  { name: "Honeywell", src: "/assets/partners/honeywell.svg", fit: "wide" },
  { name: "Legrand", src: "/assets/partners/legrand.svg", fit: "wide" },
  { name: "Schneider Electric", src: "/assets/partners/schneider-electric.svg", fit: "tall" },
  { name: "ABB", src: "/assets/partners/abb.svg", fit: "mark" },
  { name: "Hikvision", src: "/assets/partners/hikvision.svg", fit: "wide" },
  { name: "Dahua Technology", src: "/assets/partners/dahua.svg", fit: "wide" },
  { name: "Bosch", src: "/assets/partners/bosch.svg", fit: "wide" },
  { name: "Teltonika", src: "/assets/partners/teltonika.png", fit: "wide" },
  { name: "Axis Communications", src: "/assets/partners/axis.png", fit: "tall" },
  { name: "Crestron", src: "/assets/partners/crestron.png", fit: "wide" },
  { name: "Grandstream", src: "/assets/partners/grandstream.png", fit: "wide" },
  { name: "Jabra GN", src: "/assets/partners/jabra.png", fit: "mark" },
] as const;

type SystemSlug = typeof SYSTEMS[number]["slug"];

const systemContent: Record<SystemSlug, {
  problem: string; image: string; steps: [string, string][]; benefits: [string, string][];
  dashboard: [string, string][]; facts: [string, string, string][]; status: string; danger?: boolean;
}> = {
  energy: {
    problem: "Избыточное потребление и отсутствие прозрачного контроля приводят к непредсказуемым расходам.", image: "/assets/system-energy.png",
    steps: [["Счётчики собирают данные", "Интеллектуальные счётчики фиксируют потребление электроэнергии."], ["BMS выявляет отклонения", "Платформа анализирует данные и находит аномалии."], ["Система оптимизирует режимы", "Оборудование автоматически переводится в экономичный режим."]],
    benefits: [["Снижение затрат", "Оптимизация энергопотребления и операционных расходов."], ["Прозрачный учёт", "Детализация по всем объектам, зонам и арендаторам."], ["Контроль пиковых нагрузок", "Снижение пиков и штрафов энергоснабжающих организаций."], ["Прогнозируемый бюджет", "Точный прогноз потребления и планирование бюджета."]],
    dashboard: [["Зона", "Склад 1, техническое помещение"], ["Объекты", "24"], ["Отклонения", "3"], ["Экономия", "18%"]], facts: [["Детализация", "По зонам", "Счётчики и контроллеры позволяют сравнивать потребление отдельных зон и групп оборудования."], ["Аналитика", "Базовая линия", "Отклонения оцениваются относительно выбранного периода, графика работы и заданных порогов."], ["Реакция", "Сценарий + журнал", "Уведомления и управляющие действия фиксируются в истории; фактическая экономия определяется после аудита."]], status: "Активно",
  },
  climate: {
    problem: "Нестабильная температура, влажность и качество воздуха снижают комфорт и производительность.", image: "/assets/system-climate.png",
    steps: [["Датчики измеряют климат", "Температура, влажность и качество воздуха измеряются по зонам."], ["BMS сравнивает с нормой", "Параметры сравниваются с заданными значениями."], ["Оборудование регулируется", "Вентиляция, охлаждение и нагрев меняются автоматически."]],
    benefits: [["Комфорт арендаторов", "Стабильный климат повышает комфорт пользователей."], ["Стабильный микроклимат", "Оптимальные параметры поддерживаются во всех зонах."], ["Экономия энергии", "Автоматическая регулировка снижает потребление."], ["Меньше жалоб", "Система быстрее реагирует на отклонения."]],
    dashboard: [["Зона", "Офис, 3 этаж"], ["Температура", "22,4 °C"], ["Влажность", "45%"], ["CO₂", "720 ppm"]], facts: [["Параметры", "Температура · RH · CO₂", "Состав измерений зависит от установленных датчиков и требований конкретного помещения."], ["Управление", "Уставки и расписания", "BMS сопоставляет показания с заданными диапазонами и режимом использования зоны."], ["Контроль", "Тренды и отклонения", "Оператор видит историю параметров, изменения режима и события оборудования в одном интерфейсе."]], status: "Норма",
  },
  leak: {
    problem: "Скрытые протечки приводят к повреждению имущества, простоям и дорогостоящему ремонту.", image: "/assets/scenario-leak.jpg",
    steps: [["Датчик обнаруживает воду", "Фиксирует появление воды в контролируемой зоне."], ["Система отправляет сигнал", "BMS регистрирует событие и уведомляет ответственных."], ["Подача воды перекрывается", "Электропривод автоматически закрывает клапан."]],
    benefits: [["Минимизация ущерба", "Раннее обнаружение снижает риск повреждения помещений."], ["Автоматическое перекрытие", "Подача воды прекращается без участия персонала."], ["Мгновенные уведомления", "Ответственные получают сигнал сразу после события."], ["Журнал событий", "Все действия фиксируются для анализа."]],
    dashboard: [["Зона", "Техническое помещение"], ["Время", "Сегодня, 09:41"], ["Датчик", "Датчик протечки #12"], ["Статус", "Клапан перекрыт"]], facts: [["Сигнал", "Зона · датчик · время", "Событие привязывается к конкретной точке контроля, чтобы дежурный сразу понимал место проверки."], ["Реакция", "Уведомление и клапан", "Автоматическое перекрытие возможно при наличии совместимого электропривода и заданного сценария."], ["Подтверждение", "Полный журнал", "Панель сохраняет время сигнала, команды, подтверждения ответственных и итоговый статус."]], status: "Требует внимания", danger: true,
  },
  access: {
    problem: "Разрозненные системы доступа не дают единой картины посещений, зон и рабочего времени.", image: "/assets/system-access.png",
    steps: [["Сотрудник проходит идентификацию", "Карта, биометрия или PIN-код используются для входа."], ["Система проверяет права", "Проверяются зона, время и правила прохода."], ["Событие фиксируется", "Запись сохраняется для отчётности и анализа."]],
    benefits: [["Защита зон", "Ограничение доступа в критически важные помещения."], ["Учёт рабочего времени", "Точный учёт прихода, ухода и опозданий."], ["Управление правами", "Гибкая настройка ролей и временных правил."], ["Расследование событий", "Полный журнал для быстрого анализа инцидентов."]],
    dashboard: [["Зона", "Серверная"], ["Время", "Сегодня, 09:41"], ["Устройство", "Считыватель #08"], ["Пользователь", "Иванов И.И."]], facts: [["Событие", "Кто · где · когда", "Каждый проход связывается с пользователем, точкой доступа, временем и результатом проверки."], ["Правила", "Роль · зона · график", "Права могут учитывать должность, конкретные двери, дни недели и временные интервалы."], ["Разбор", "Поиск по журналу", "Фильтры помогают быстро восстановить последовательность проходов и заблокированных попыток."]], status: "Доступ разрешён",
  },
  fire: {
    problem: "Позднее обнаружение и несогласованное оповещение увеличивают риск для людей и имущества.", image: "/assets/system-fire.png",
    steps: [["Датчик фиксирует угрозу", "Датчики дыма и температуры передают сигнал системе."], ["Система запускает оповещение", "Звуковые и световые сигналы отправляются пользователям."], ["BMS выполняет сценарий", "Инженерные системы выполняют аварийные действия."]],
    benefits: [["Раннее обнаружение", "Снижение рисков благодаря оперативному выявлению."], ["Оповещение людей", "Своевременное сообщение для быстрой эвакуации."], ["Управление системами", "Автоматическое отключение вентиляции и электропитания."], ["Журнал событий", "Полная история тревог и действий."]],
    dashboard: [["Зона", "Техническое помещение"], ["Время", "Сегодня, 09:41"], ["Датчик", "Датчик дыма #16"], ["Статус", "Требует подтверждения"]], facts: [["Локализация", "Зона · устройство · время", "Оператор получает адрес события и состояние извещателя без поиска по разрозненным панелям."], ["Алгоритм", "По проектному сценарию", "Оповещение и инженерные действия выполняются по согласованному алгоритму конкретного объекта."], ["Контроль", "Статусы и подтверждения", "В журнале отражаются команды, обратные сигналы оборудования и действия ответственных сотрудников."]], status: "Требует подтверждения", danger: true,
  },
};

function IconBox({ icon: Icon, danger = false }: { icon: LucideIcon; danger?: boolean }) {
  return <span className={`icon-box ${danger ? "danger" : ""}`}><Icon aria-hidden="true" /></span>;
}

function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const isEffectButton = /(?:^|\s)(?:button-primary|button-secondary|blue-cta-button|service-calc)(?:\s|$)/.test(className);
  const label = typeof children === "string" ? children : undefined;
  return <Link href={href} className={`arrow-link ${className}`} data-label={label}>
    {isEffectButton ? <span className="button-label">{children}</span> : children}
    <ArrowRight />
  </Link>;
}

function BlueCta({ title, text, button }: { title: string; text: string; button: string }) {
  return <section className="blue-cta"><div><h2>{title}</h2><p>{text}</p></div><ArrowLink href="/contacts#lead" className="blue-cta-button">{button}</ArrowLink></section>;
}

function PartnerLogos() {
  return <div className="partner-logo-grid">{PARTNER_LOGOS.map(({name,src,fit})=><div className={`partner-logo-card partner-logo-${fit}`} key={name}><Image src={src} alt={`Логотип ${name}`} width={170} height={56} sizes="170px" /></div>)}</div>;
}

const panelVisualCopy: Record<SystemSlug, { zone: string; signal: string; action: string; legend: string[] }> = {
  energy: { zone: "Техническая зона · E-12", signal: "Пиковая нагрузка +14%", action: "Сценарий: перенос неприоритетной нагрузки", legend: ["Счётчик", "Отклонение", "Команда BMS"] },
  climate: { zone: "Переговорная · 3 этаж", signal: "CO₂ выше уставки", action: "Сценарий: увеличить воздухообмен", legend: ["Датчик", "Уставка", "Команда ОВиК"] },
  leak: { zone: "Узел водоснабжения · W-04", signal: "Обнаружена вода", action: "Сценарий: закрыть клапан и уведомить", legend: ["Датчик", "Зона риска", "Запорный клапан"] },
  access: { zone: "Серверная · Door 08", signal: "Запрос на проход", action: "Проверка: роль, зона и расписание", legend: ["Считыватель", "Маршрут", "Результат"] },
  fire: { zone: "Техническое помещение · F-16", signal: "Сигнал извещателя", action: "Алгоритм: оповещение и инженерный сценарий", legend: ["Извещатель", "Зона тревоги", "Сценарий"] },
};

const panelVisualCopyUz: typeof panelVisualCopy = {
  energy: { zone: "Texnik zona · E-12", signal: "Cho‘qqi yuklama +14%", action: "Ssenariy: ustuvor bo‘lmagan yuklamani ko‘chirish", legend: ["Hisoblagich", "Og‘ish", "BMS buyrug‘i"] },
  climate: { zone: "Muzokara xonasi · 3-qavat", signal: "CO₂ me’yordan yuqori", action: "Ssenariy: havo almashinuvini oshirish", legend: ["Datchik", "Me’yor", "HVAC buyrug‘i"] },
  leak: { zone: "Suv ta’minoti uzeli · W-04", signal: "Suv aniqlandi", action: "Ssenariy: klapanni yopish va xabar berish", legend: ["Datchik", "Xavf zonasi", "Yopish klapani"] },
  access: { zone: "Server xonasi · Door 08", signal: "Kirish so‘rovi", action: "Tekshiruv: rol, zona va jadval", legend: ["O‘quvchi", "Yo‘nalish", "Natija"] },
  fire: { zone: "Texnik xona · F-16", signal: "Datchik signali", action: "Algoritm: ogohlantirish va muhandislik ssenariysi", legend: ["Datchik", "Signal zonasi", "Ssenariy"] },
};

function SystemPanelVisual({ active, danger = false, locale = "ru" }: { active: SystemSlug; danger?: boolean; locale?: Locale }) {
  const visual = (locale === "ru" ? panelVisualCopy : panelVisualCopyUz)[active];
  return <div className={`system-panel-visual visual-${active} ${danger ? "danger" : ""}`}>
    <header><span><Activity /> {locale === "ru" ? "Интерактивная карта объекта" : "Obyektning interaktiv xaritasi"}</span><i>{locale === "ru" ? "Сценарий активен" : "Ssenariy faol"}</i></header>
    <div className="system-map-canvas">
      <svg viewBox="0 0 520 270" role="img" aria-label={`${visual.zone}: ${visual.signal}`}>
        <path className="map-building" d="M35 30h450v210H35z" />
        <path className="map-room" d="M55 52h132v76H55zM205 52h132v76H205zM355 52h110v76H355zM55 146h92v74H55zM165 146h172v74H165zM355 146h110v74H355z" />
        <path className="map-route" d="M88 183H250V90h158" />
        <circle className="map-origin" cx="88" cy="183" r="8" />
        <circle className="map-focus" cx="408" cy="90" r="10" />
      </svg>
      <div className="system-map-callout"><small>{visual.zone}</small><strong>{visual.signal}</strong><span>{visual.action}</span></div>
      <div className="system-map-pulse" aria-hidden="true" />
    </div>
    <footer>{visual.legend.map((item,index)=><span key={item}><i className={`legend-${index}`} />{item}</span>)}</footer>
  </div>;
}

const publicUi = {
  ru: {
    heroTitle: <>Инженерные системы,<br />которые работают<br />на ваш результат</>,
    heroText: "Проектируем, внедряем и обслуживаем интеллектуальные системы зданий — от автоматизации и энергоконтроля до безопасности.",
    consultation: "Получить консультацию", solutions: "Смотреть решения",
    systemEyebrow: "Единый контур", systemTitle: <>Все инженерные системы<br />под вашим контролем</>,
    systemText: "Данные, тревоги и автоматические сценарии объединены в одной панели — без разрозненных пультов и таблиц.",
    systemAll: "Посмотреть все системы", scenario: "Активный сценарий", problem: "Сложность", reaction: "Реакция системы", effect: "Результат",
    projectEyebrow: "Проекты", projectTitle: <>Решения для объектов<br />разного масштаба</>, projectText: "Нажмите на объект: карточка раскроется и покажет профиль инженерного решения, состав систем и формат работ.", projectAll: "Смотреть все проекты",
    serviceEyebrow: "Полный цикл", serviceTitle: <>От обследования<br />до сервиса 24/7</>, serviceText: "Одна команда отвечает за проектирование, внедрение, запуск и дальнейшую работоспособность системы.",
    companyEyebrow: "О компании", companyTitle: "Инженерная экспертиза полного цикла", companyText: "BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы зданий.", companyMore: "Подробнее о компании", partners: "Технологии мировых производителей",
    contactEyebrow: "Контакты", contactTitle: "Обсудим ваш объект", contactText: "Оставьте контакты и кратко опишите задачу. Заявка придёт ответственному специалисту одним структурированным сообщением.",
    footerText: "Автоматизация, безопасность и эффективная эксплуатация зданий.", footerNav: "Навигация в подвале", discuss: "Обсудить проект",
    mapTitle: "Buyursin Technics на карте", mapOpen: "Открыть в Яндекс Картах",
  },
  uz: {
    heroTitle: <>Natijangiz uchun<br />ishlaydigan muhandislik<br />tizimlari</>,
    heroText: "Binolarning aqlli tizimlarini loyihalaymiz, joriy qilamiz va xizmat ko‘rsatamiz — avtomatika va energiya nazoratidan xavfsizlikkacha.",
    consultation: "Maslahat olish", solutions: "Yechimlarni ko‘rish",
    systemEyebrow: "Yagona kontur", systemTitle: <>Barcha muhandislik tizimlari<br />sizning nazoratingizda</>,
    systemText: "Ma’lumotlar, ogohlantirishlar va avtomatik ssenariylar alohida pult va jadvallarsiz bitta panelda birlashtirilgan.",
    systemAll: "Barcha tizimlarni ko‘rish", scenario: "Faol ssenariy", problem: "Muammo", reaction: "Tizim reaksiyasi", effect: "Natija",
    projectEyebrow: "Loyihalar", projectTitle: <>Turli miqyosdagi obyektlar<br />uchun yechimlar</>, projectText: "Obyektni bosing: karta ochilib, muhandislik yechimi, tizimlar tarkibi va ish formati ko‘rsatiladi.", projectAll: "Barcha loyihalarni ko‘rish",
    serviceEyebrow: "To‘liq sikl", serviceTitle: <>Tekshiruvdan<br />24/7 servisgacha</>, serviceText: "Bitta jamoa loyihalash, joriy etish, ishga tushirish va tizimning keyingi ishlashi uchun javob beradi.",
    companyEyebrow: "Kompaniya haqida", companyTitle: "To‘liq siklli muhandislik ekspertizasi", companyText: "BUYURSIN TECHNICS binolarning aqlli tizimlarini loyihalaydi, joriy qiladi va ularga xizmat ko‘rsatadi.", companyMore: "Kompaniya haqida", partners: "Jahon ishlab chiqaruvchilari texnologiyalari",
    contactEyebrow: "Aloqa", contactTitle: "Obyektingizni muhokama qilamiz", contactText: "Kontaktlaringizni qoldiring va vazifani qisqacha yozing. Ariza mas’ul mutaxassisga tuzilgan xabar sifatida yetib boradi.",
    footerText: "Binolarni avtomatlashtirish, xavfsizlik va samarali ekspluatatsiya.", footerNav: "Pastki navigatsiya", discuss: "Loyihani muhokama qilish",
    mapTitle: "Buyursin Technics xaritada", mapOpen: "Yandex Xaritalarda ochish",
  },
} as const;

const systemShortUz: Record<SystemSlug, string> = {
  energy: "Iste’molni hisobga olish va optimallashtirish",
  climate: "Harorat, namlik va havo sifati",
  leak: "Erta aniqlash va avtomatik yopish",
  access: "Kirish va ish vaqtini nazorat qilish",
  fire: "Aniqlash, ogohlantirish va evakuatsiya ssenariylari",
};

const heroSlides = [
  { image: "/assets/portfolio-centristowers.webp", ru: ["Centris Towers", "BMS · климат · контроль доступа"], uz: ["Centris Towers", "BMS · iqlim · kirish nazorati"] },
  { image: "/assets/portfolio-sberbank-city.webp", ru: ["Сбербанк-Сити", "Диспетчеризация · АСКУЭ · безопасность"], uz: ["Sberbank City", "Dispetcherlik · ASKUE · xavfsizlik"] },
  { image: "/assets/portfolio-bmw.webp", ru: ["Офисы BMW", "Климат · освещение · сценарии офиса"], uz: ["BMW ofislari", "Iqlim · yoritish · ofis ssenariylari"] },
  { image: "/assets/portfolio-sheraton.webp", ru: ["Отель Sheraton", "BMS · ОВиК · пожарная безопасность"], uz: ["Sheraton mehmonxonasi", "BMS · HVAC · yong‘in xavfsizligi"] },
] as const;

function HeroCarousel({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setActive((active + 1) % heroSlides.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active]);
  const ui = publicUi[locale];
  const slide = heroSlides[active];
  return <section id="solutions" className="hero-reference">
    <div className="hero-slides" aria-hidden="true">{heroSlides.map((item, index) => <Image key={item.image} src={item.image} alt="" fill priority={index === 0} sizes="100vw" className={`hero-reference-image ${active === index ? "active" : ""}`} />)}</div>
    <div className="hero-wash" />
    <div className="site-shell hero-reference-inner">
      <div className="hero-copy"><h1>{ui.heroTitle}</h1><p>{ui.heroText}</p><div className="hero-buttons"><ArrowLink href="#contacts" className="button-primary">{ui.consultation}</ArrowLink><ArrowLink href="#systems" className="button-secondary">{ui.solutions}</ArrowLink></div></div>
      <div className="hero-project-caption" aria-live="polite"><small>{locale === "ru" ? "Проект и внедрённые решения" : "Loyiha va joriy etilgan yechimlar"}</small><strong>{slide[locale][0]}</strong><span>{slide[locale][1]}</span><div>{heroSlides.map((item, index) => <button type="button" key={item.image} className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-label={`${locale === "ru" ? "Показать" : "Ko‘rsatish"} ${item[locale][0]}`} />)}</div></div>
    </div>
  </section>;
}

function UnifiedSystemsShowcase({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<SystemSlug>("energy");
  const copy = copyFor(locale);
  const ui = publicUi[locale];
  useEffect(() => {
    const timer = window.setTimeout(() => setActive(current => {
      const index = SYSTEMS.findIndex(system => system.slug === current);
      return SYSTEMS[(index + 1) % SYSTEMS.length].slug;
    }), 3000);
    return () => window.clearTimeout(timer);
  }, [active]);
  const activeSystem = SYSTEMS.find(system => system.slug === active)!;
  const ActiveSystemIcon = activeSystem.icon;
  const activeScenario = copy.scenario.items[active];
  const systemName = (slug: SystemSlug) => copy.scenario.tabs[slug];
  const systemShort = (slug: SystemSlug, fallback: string) => locale === "ru" ? fallback : systemShortUz[slug];
  const Card = ({ slug, short, icon }: typeof SYSTEMS[number]) => {
    const Icon = icon;
    return <button type="button" className={`unified-system-card ${active === slug ? "active" : ""}`} onClick={() => setActive(slug)} aria-pressed={active === slug}>
      <IconBox icon={Icon} danger={slug === "fire"} /><span><strong>{systemName(slug)}</strong><small>{systemShort(slug, short)}</small></span><ArrowRight />
    </button>;
  };
  return <div className="unified-showcase">
    <div className="unified-tabs" role="tablist" aria-label={ui.systemEyebrow}>{SYSTEMS.map(({slug,icon:Icon}) => <button type="button" role="tab" aria-selected={active === slug} key={slug} className={active === slug ? "active" : ""} onClick={() => setActive(slug)}><Icon />{systemName(slug)}</button>)}</div>
    <div className="unified-map">
      <div className="unified-side unified-left">{SYSTEMS.slice(0,2).map(system => <Card key={system.slug} {...system} />)}</div>
      <div className="unified-center"><BmsDashboard active={active} locale={locale} /><div className="unified-live-badge"><ActiveSystemIcon />{ui.scenario}: <b>{systemName(active)}</b></div></div>
      <div className="unified-side unified-right">{SYSTEMS.slice(2).map(system => <Card key={system.slug} {...system} />)}</div>
    </div>
    <div className="unified-impact" aria-live="polite"><article><small>01 · {ui.problem}</small><p>{activeScenario.problem}</p></article><ArrowRight /><article><small>02 · {ui.reaction}</small><p>{activeScenario.steps[activeScenario.steps.length - 1]}</p></article><ArrowRight /><article><small>03 · {ui.effect}</small><p>{activeScenario.result}</p></article></div>
  </div>;
}

function YandexMap({ locale }: { locale: Locale }) {
  const ui = publicUi[locale];
  const mapUrl = "https://yandex.ru/map-widget/v1/?ll=69.218040%2C41.279166&mode=poi&poi%5Bpoint%5D=69.217828%2C41.279319&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D40707342179&z=19.8";
  const fullUrl = "https://yandex.uz/maps/10335/tashkent/?ll=69.218040%2C41.279166&mode=poi&poi%5Bpoint%5D=69.217828%2C41.279319&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D40707342179&z=19.8";
  return <section className="contact-map">
    <iframe src={mapUrl} title={ui.mapTitle} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    <span className="contact-map-label"><Globe2 />{locale === "ru" ? "Офис Buyursin Technics" : "Buyursin Technics ofisi"}</span>
    <a href={fullUrl} target="_blank" rel="noreferrer" className="button-secondary" data-label={ui.mapOpen}><span className="button-label">{ui.mapOpen}</span><ArrowRight /></a>
  </section>;
}

function ReferenceFooter() {
  const { locale } = useI18n();
  const ui = publicUi[locale];
  const labels = locale === "ru" ? ["Системы", "Проекты", "Сервисы", "О компании"] : ["Tizimlar", "Loyihalar", "Xizmatlar", "Kompaniya"];
  return <footer className="reference-footer"><div className="site-shell reference-footer-grid"><div><Brand inverse /><p>{ui.footerText}</p></div><nav aria-label={ui.footerNav}>{["systems","projects","services","company"].map((id,index)=><Link key={id} href={`/#${id}`}>{labels[index]}</Link>)}</nav><div className="reference-footer-contacts"><a href={CONTACTS.phoneHref}><Phone />{CONTACTS.phoneDisplay}</a><a href={CONTACTS.emailHref}><Mail />{CONTACTS.email}</a></div></div><div className="site-shell reference-footer-bottom"><span>© {new Date().getFullYear()} Buyursin Technics</span><Link href="/#contacts">{ui.discuss}</Link></div></footer>;
}

export function SolutionsReferencePage() {
  const { locale } = useI18n();
  const ui = publicUi[locale];
  const copy = copyFor(locale);
  const features = locale === "ru"
    ? [[Leaf, "Экономия ресурсов", "Оптимизация потребления энергии и воды"], [ShieldCheck, "Контроль 24/7", "Непрерывный мониторинг всех систем"], [Activity, "Меньше рисков", "Предотвращаем аварии и простои"], [Users, "Комфорт для людей", "Здоровый микроклимат каждый день"]] as const
    : [[Leaf, "Resurslarni tejash", "Energiya va suv iste’molini optimallashtirish"], [ShieldCheck, "24/7 nazorat", "Barcha tizimlarning uzluksiz monitoringi"], [Activity, "Kamroq xavf", "Avariya va to‘xtashlarning oldini olish"], [Users, "Odamlar uchun qulaylik", "Har kuni sog‘lom mikroiqlim"]] as const;
  const services = locale === "ru"
    ? [[ClipboardCheck,"Аудит объекта","Находим потери, риски и точки автоматизации"],[FileText,"Проектирование","Разрабатываем архитектуру и рабочую документацию"],[Wrench,"Монтаж и запуск","Интегрируем оборудование и тестируем сценарии"],[Headphones,"Сервис 24/7","Контролируем состояние систем после запуска"]] as const
    : [[ClipboardCheck,"Obyekt auditi","Yo‘qotish, xavf va avtomatlashtirish nuqtalarini topamiz"],[FileText,"Loyihalash","Arxitektura va ishchi hujjatlarni ishlab chiqamiz"],[Wrench,"Montaj va ishga tushirish","Uskunani integratsiya qilib, ssenariylarni sinaymiz"],[Headphones,"24/7 servis","Ishga tushirilgandan keyin tizimlarni nazorat qilamiz"]] as const;
  return <main className="home-page"><SiteHeader />
    <HeroCarousel locale={locale} />
    <div className="site-shell hero-feature-row">{features.map(([Icon, title, text]) => <ArrowLink href="#systems" key={title} className="hero-feature"><IconBox icon={Icon} /><span><strong>{title}</strong><small>{text}</small></span></ArrowLink>)}</div>

    <section id="systems" className="home-section home-systems"><div className="site-shell"><div className="home-section-head"><div><span className="section-eyebrow">{ui.systemEyebrow}</span><h2>{ui.systemTitle}</h2></div><p>{ui.systemText}</p></div><UnifiedSystemsShowcase locale={locale} /><ArrowLink href="/systems" className="home-text-link">{ui.systemAll}</ArrowLink></div></section>

    <section id="projects" className="home-section home-projects"><div className="site-shell"><div className="home-section-head"><div><span className="section-eyebrow">{ui.projectEyebrow}</span><h2>{ui.projectTitle}</h2></div><p>{ui.projectText}</p></div><ProjectAccordion projects={projectCards.slice(0,4)} locale={locale} /><ArrowLink href="/projects" className="home-text-link">{ui.projectAll}</ArrowLink></div></section>

    <section id="services" className="home-section home-services"><div className="site-shell"><div className="home-section-head"><div><span className="section-eyebrow">{ui.serviceEyebrow}</span><h2>{ui.serviceTitle}</h2></div><p>{ui.serviceText}</p></div><div className="home-service-grid">{services.map(([Icon,title,text],index)=><ArrowLink href="/services" className="home-service-card" key={title}><span className="home-service-number">0{index+1}</span><Icon/><span><strong>{title}</strong><small>{text}</small></span></ArrowLink>)}</div></div></section>

    <section id="company" className="home-section home-company"><div className="site-shell home-company-grid"><div className="home-company-photo"><Image src="/assets/company-control-room.webp" alt={locale === "ru" ? "Инженер в современном диспетчерском центре" : "Zamonaviy dispetcherlik markazidagi muhandis"} fill sizes="(max-width: 980px) 100vw, 50vw"/></div><div className="home-company-copy"><span className="section-eyebrow">{ui.companyEyebrow}</span><h2>{ui.companyTitle}</h2><p>{ui.companyText}</p><div className="home-company-facts">{copy.company.facts.slice(0,3).map(fact=><span key={fact.value}><strong>{fact.value}</strong><small>{fact.label}</small></span>)}</div><ArrowLink href="/company" className="button-secondary">{ui.companyMore}</ArrowLink></div></div><div className="site-shell home-partners"><p>{ui.partners}</p><PartnerLogos /></div></section>

    <section id="contacts" className="home-section home-contacts"><div className="site-shell"><div className="home-contact-grid"><div><span className="section-eyebrow">{ui.contactEyebrow}</span><h2>{ui.contactTitle}</h2><p>{ui.contactText}</p><div className="home-contact-links"><a href={CONTACTS.phoneHref}><Phone/>{CONTACTS.phoneDisplay}</a><a href={CONTACTS.emailHref}><Mail/>{CONTACTS.email}</a></div></div><ContactForm locale={locale} /></div><YandexMap locale={locale} /></div></section>
    <ReferenceFooter />
  </main>;
}

export function SystemsOverviewPage() {
  const { locale } = useI18n();
  const copy = copyFor(locale);
  const name = (slug:SystemSlug) => copy.scenario.tabs[slug];
  const short = (system:typeof SYSTEMS[number]) => locale === "ru" ? system.short : systemShortUz[system.slug];
  const stats = locale === "ru" ? [[Building2,"Объекты","24"],[Bell,"Активные события","3"],[TrendingDown,"Экономия","18%"],[ShieldCheck,"Контроль","24/7"]] : [[Building2,"Obyektlar","24"],[Bell,"Faol voqealar","3"],[TrendingDown,"Tejash","18%"],[ShieldCheck,"Nazorat","24/7"]];
  return <main><SiteHeader /><section className="overview-hero"><Image src="/assets/hero-architectural.png" alt={locale === "ru" ? "Автоматизированное здание" : "Avtomatlashtirilgan bino"} fill className="overview-building" /><div className="site-shell"><h1>{locale === "ru" ? <>Все инженерные системы —<br />в одном контуре управления</> : <>Barcha muhandislik tizimlari —<br />yagona boshqaruv konturida</>}</h1><p>{locale === "ru" ? "Контроль, аналитика и автоматические сценарии для вашего объекта." : "Obyektingiz uchun nazorat, tahlil va avtomatik ssenariylar."}</p></div></section><div className="site-shell overview-body"><div className="system-tabs">{SYSTEMS.map(({ slug, icon: Icon }, i) => <Link href={`/systems/${slug}`} key={slug} className={i === 0 ? "active" : ""}><Icon />{name(slug)}</Link>)}</div><section className="system-map"><div className="map-side">{SYSTEMS.slice(0,2).map(system => <ArrowLink href={`/systems/${system.slug}`} key={system.slug} className="system-mini-card"><IconBox icon={system.icon} /><span><strong>{name(system.slug)}</strong><small>{short(system)}</small></span></ArrowLink>)}</div><BmsDashboard locale={locale} /><div className="map-side">{SYSTEMS.slice(2).map(system => <ArrowLink href={`/systems/${system.slug}`} key={system.slug} className="system-mini-card"><IconBox icon={system.icon} danger={system.slug === "fire"} /><span><strong>{name(system.slug)}</strong><small>{short(system)}</small></span></ArrowLink>)}</div></section><section className="overview-stats"><div><h2>{locale === "ru" ? "Единая панель управления" : "Yagona boshqaruv paneli"}</h2><p>{locale === "ru" ? "Все системы и данные — в одном интерфейсе." : "Barcha tizim va ma’lumotlar — bitta interfeysda."}</p></div>{stats.map(([Icon,label,value]) => <div className="overview-stat" key={String(label)}><IconBox icon={Icon as LucideIcon} danger={value === "3"} /><span><small>{label as string}</small><strong>{value as string}</strong></span></div>)}</section><BlueCta title={locale === "ru" ? "Посмотреть сценарии работы" : "Ish ssenariylarini ko‘rish"} text={locale === "ru" ? "Узнайте, как системы взаимодействуют и автоматически реагируют на события." : "Tizimlar qanday o‘zaro ishlashi va voqealarga avtomatik javob berishini ko‘ring."} button={locale === "ru" ? "Выбрать систему" : "Tizimni tanlash"} /></div><ReferenceFooter /></main>;
}

function BmsDashboard({ active = "energy", locale = "ru" }: { active?: SystemSlug; locale?: Locale }) {
  const labels = locale === "ru"
    ? { overview:"Обзор", objects:"Объекты", events:"События", analytics:"Аналитика", scenarios:"Сценарии", platform:"Платформа BMS", contour:"Единый контур управления объектом", saving:"Экономия", control:"Контроль", latest:"Последние события", actions:"Быстрые действия", report:"Сформировать отчёт" }
    : { overview:"Ko‘rib chiqish", objects:"Obyektlar", events:"Voqealar", analytics:"Tahlil", scenarios:"Ssenariylar", platform:"BMS platformasi", contour:"Obyektning yagona boshqaruv konturi", saving:"Tejash", control:"Nazorat", latest:"So‘nggi voqealar", actions:"Tezkor harakatlar", report:"Hisobot yaratish" };
  const dynamic = {
    energy: locale === "ru" ? ["Потребление энергии", "1 245 кВт·ч", "Пиковая нагрузка снижена"] : ["Energiya iste’moli", "1 245 kVt·soat", "Cho‘qqi yuklama pasaytirildi"],
    climate: locale === "ru" ? ["Качество воздуха", "CO₂ 720 ppm", "Воздухообмен увеличен"] : ["Havo sifati", "CO₂ 720 ppm", "Havo almashinuvi oshirildi"],
    leak: locale === "ru" ? ["Контроль воды", "Клапан закрыт", "Протечка локализована"] : ["Suv nazorati", "Klapan yopildi", "Oqish lokalizatsiya qilindi"],
    access: locale === "ru" ? ["Контроль доступа", "24 зоны", "Права пользователя проверены"] : ["Kirish nazorati", "24 zona", "Foydalanuvchi huquqi tekshirildi"],
    fire: locale === "ru" ? ["Пожарный контур", "Сценарий активен", "Оповещение запущено"] : ["Yong‘in konturi", "Ssenariy faol", "Ogohlantirish ishga tushdi"],
  }[active];
  return <div className={`bms-panel bms-${active}`}><aside><Brand compact /><span className="active">⌂ {labels.overview}</span><span>▣ {labels.objects}</span><span>♧ {labels.events}</span><span>◉ {labels.analytics}</span><span>♢ {labels.scenarios}</span></aside><div className="bms-content"><header><strong>{labels.platform}</strong><small>{labels.contour}</small></header><div className="bms-kpis"><span>{labels.objects} <b>24</b></span><span>{labels.events} <b className="red">3</b></span><span>{labels.saving} <b className="green">18%</b></span><span>{labels.control} <b>24/7</b></span></div><div className="bms-chart"><small>{dynamic[0]}</small><strong>{dynamic[1]}</strong><svg viewBox="0 0 380 90" aria-hidden="true"><polyline points="0,65 35,54 70,60 105,32 140,39 175,74 210,68 245,44 280,50 315,33 350,48 380,42" /></svg></div><div className="bms-bottom"><span><b>{labels.latest}</b><small>{dynamic[2]} · 09:41</small><small>{locale === "ru" ? "Система работает штатно" : "Tizim me’yorda ishlamoqda"} · 09:15</small></span><span><b>{labels.actions}</b><small>{locale === "ru" ? "Открыть сценарий" : "Ssenariyni ochish"}</small><small>{labels.report}</small></span></div></div></div>;
}

const projectCards = [
  { type: "Бизнес-центры", typeUz: "Biznes markazlari", title: "БЦ Centris Towers", titleUz: "Centris Towers BM", image: "/assets/portfolio-centristowers.webp", summary: "Единый контур диспетчеризации для многофункционального комплекса.", summaryUz: "Ko‘p funksiyali majmua uchun yagona dispetcherlik konturi.", systems: ["BMS", "контроль доступа", "видеонаблюдение", "пожарные системы"] },
  { type: "Банки", typeUz: "Banklar", title: "Сбербанк-Сити", titleUz: "Sberbank City", image: "/assets/portfolio-sberbank-city.webp", summary: "Централизованный контроль инженерной инфраструктуры и критических зон.", summaryUz: "Muhandislik infratuzilmasi va muhim zonalarni markazlashgan nazorat qilish.", systems: ["BMS", "АСКУЭ", "СКУД", "мониторинг событий"] },
  { type: "Бизнес-центры", typeUz: "Biznes markazlari", title: "Офисы BMW", titleUz: "BMW ofislari", image: "/assets/portfolio-bmw.webp", summary: "Интеграция комфорта, безопасности и эксплуатационных сценариев офиса.", summaryUz: "Ofis qulayligi, xavfsizligi va ekspluatatsiya ssenariylarini integratsiya qilish.", systems: ["климат", "освещение", "контроль доступа", "BMS"] },
  { type: "Отели", typeUz: "Mehmonxonalar", title: "Отель Sheraton", titleUz: "Sheraton mehmonxonasi", image: "/assets/portfolio-sheraton.webp", summary: "Управление гостевыми зонами, климатом и инженерными событиями.", summaryUz: "Mehmon zonalari, iqlim va muhandislik voqealarini boshqarish.", systems: ["BMS", "ОВиК", "пожарные системы", "видеонаблюдение"] },
  { type: "Отели", typeUz: "Mehmonxonalar", title: "Swissôtel", titleUz: "Swissôtel", image: "/assets/portfolio-swissotel.webp", summary: "Сценарное управление инженерными системами гостиничного комплекса.", summaryUz: "Mehmonxona majmuasining muhandislik tizimlarini ssenariy asosida boshqarish.", systems: ["BMS", "климат", "освещение", "безопасность"] },
  { type: "Торговые центры", typeUz: "Savdo markazlari", title: "ТПЦ IKEA Almaty", titleUz: "IKEA Almaty savdo markazi", image: "/assets/portfolio-ikea-almaty.webp", summary: "Контроль крупного торгового объекта с разными режимами эксплуатации.", summaryUz: "Turli ekspluatatsiya rejimlariga ega yirik savdo obyektini nazorat qilish.", systems: ["АСКУЭ", "ОВиК", "пожарные системы", "диспетчеризация"] },
  { type: "Спорт", typeUz: "Sport", title: "Стадион Ozon Arena", titleUz: "Ozon Arena stadioni", image: "/assets/portfolio-ozon-arena.webp", summary: "Мониторинг инфраструктуры арены и согласованные сценарии безопасности.", summaryUz: "Arena infratuzilmasi monitoringi va muvofiqlashtirilgan xavfsizlik ssenariylari.", systems: ["BMS", "СКУД", "видеонаблюдение", "оповещение"] },
  { type: "Банки", typeUz: "Banklar", title: "Касса A+ «1x»", titleUz: "A+ «1x» kassasi", image: "/assets/portfolio-a-plus-1x.webp", summary: "Компактный защищённый контур для удалённой точки обслуживания.", summaryUz: "Masofaviy xizmat ko‘rsatish nuqtasi uchun ixcham himoyalangan kontur.", systems: ["СКУД", "видеонаблюдение", "охранная сигнализация", "мониторинг"] },
] as const;

type PortfolioProject = typeof projectCards[number];

function ProjectAccordion({ projects, locale = "ru" }: { projects: readonly PortfolioProject[]; locale?: Locale }) {
  const [selected, setSelected] = useState(projects[0]?.title ?? "");
  const activeTitle = projects.some(project => project.title === selected) ? selected : projects[0]?.title;
  return <div className="project-accordion" style={{ "--project-count": projects.length } as React.CSSProperties}>
    {projects.map((project, index) => {
      const active = project.title === activeTitle;
      return <button type="button" className={`project-accordion-panel ${active ? "active" : ""}`} key={project.title} onClick={() => setSelected(project.title)} aria-expanded={active}>
        <Image src={project.image} alt={`${locale === "ru" ? "Архитектурная визуализация" : "Arxitektura vizualizatsiyasi"}: ${locale === "ru" ? project.title : project.titleUz}`} fill sizes={active ? "(max-width: 680px) 100vw, 70vw" : "180px"} />
        <span className="project-accordion-shade" />
        <span className="project-rail-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-rail-title">{locale === "ru" ? project.title : project.titleUz}</span>
        <span className="project-accordion-content">
          <small>{locale === "ru" ? project.type : project.typeUz}</small>
          <strong>{locale === "ru" ? project.title : project.titleUz}</strong>
          <span className="project-summary">{locale === "ru" ? project.summary : project.summaryUz}</span>
          <span className="project-systems-label">{locale === "ru" ? "Профиль решения" : "Yechim profili"}</span>
          <span className="project-system-tags">{project.systems.map(system => <i key={system}>{system}</i>)}</span>
          <span className="project-disclaimer">{locale === "ru" ? "Архитектурная AI-визуализация. Состав кейса подтверждается перед публикацией." : "Arxitektura AI-vizualizatsiyasi. Keys tarkibi nashrdan oldin tasdiqlanadi."}</span>
        </span>
      </button>;
    })}
  </div>;
}

export function ProjectsReferencePage() {
  const { locale } = useI18n();
  const [filter, setFilter] = useState("Все проекты");
  const filters = [
    ["Все проекты","Все проекты","Barcha loyihalar"], ["Бизнес-центры","Бизнес-центры","Biznes markazlari"], ["Банки","Банки","Banklar"], ["Отели","Отели","Mehmonxonalar"], ["Торговые центры","Торговые центры","Savdo markazlari"], ["Спорт","Спорт","Sport"],
  ] as const;
  const shown = filter === "Все проекты" ? projectCards : projectCards.filter(({type}) => type === filter);
  const benefits = locale === "ru" ? [[Building2,"8+","объектов в презентации"],[Settings2,"Полный цикл","от проекта до сервиса"],[Clock3,"Сервис 24/7","круглосуточная поддержка"],[Globe2,"Мировые вендоры","проверенные технологии"]] : [[Building2,"8+","taqdimotdagi obyektlar"],[Settings2,"To‘liq sikl","loyihadan servisgacha"],[Clock3,"24/7 servis","tunu kun yordam"],[Globe2,"Jahon brendlari","sinalgan texnologiyalar"]];
  return <main><SiteHeader /><section className="subhero"><Image src="/assets/portfolio-bmw.webp" alt={locale === "ru" ? "Современный объект" : "Zamonaviy obyekt"} fill /><div className="site-shell"><h1>{locale === "ru" ? "Проекты, которым доверяют" : "Ishonch bildirilgan loyihalar"}</h1><p>{locale === "ru" ? "Комплексные инженерные решения для коммерческой недвижимости и инфраструктуры." : "Tijorat ko‘chmas mulki va infratuzilma uchun kompleks muhandislik yechimlari."}</p></div></section><div className="site-shell projects-body"><div className="filter-pills">{filters.map(([value,ru,uz]) => <button type="button" key={value} onClick={() => setFilter(value)} className={filter === value ? "active" : ""}>{locale === "ru" ? ru : uz}</button>)}</div><ProjectAccordion projects={shown} locale={locale} /><section className="project-benefits">{benefits.map(([Icon,bold,small]) => <div key={String(bold)}><IconBox icon={Icon as LucideIcon} /><span><strong>{bold as string}</strong><small>{small as string}</small></span></div>)}</section><BlueCta title={locale === "ru" ? "Обсудить ваш проект" : "Loyihangizni muhokama qilamiz"} text={locale === "ru" ? "Расскажите о задачах — наши специалисты подберут оптимальное решение." : "Vazifalarni ayting — mutaxassislarimiz mos yechimni tanlaydi."} button={locale === "ru" ? "Получить консультацию" : "Maslahat olish"} /></div><ReferenceFooter /></main>;
}

export function ServicesReferencePage() {
  const { locale } = useI18n();
  const copy = copyFor(locale);
  const services = locale === "ru"
    ? [[ClipboardCheck,"Аудит и обследование","инвентаризация, замеры, поиск потерь"],[FileText,"Проектирование","рабочая документация и подбор оборудования"],[Wrench,"Монтаж и пусконаладка","установка, настройка и ввод в эксплуатацию"],[Headphones,"Техническое сопровождение 24/7","мониторинг, диагностика и обслуживание"]] as const
    : [[ClipboardCheck,"Audit va tekshiruv","inventarizatsiya, o‘lchov va yo‘qotishlarni aniqlash"],[FileText,"Loyihalash","ishchi hujjatlar va uskunani tanlash"],[Wrench,"Montaj va ishga tushirish","o‘rnatish, sozlash va foydalanishga topshirish"],[Headphones,"24/7 texnik yordam","monitoring, diagnostika va xizmat"]] as const;
  const flow = locale === "ru" ? ["Заявка","Диагностика","Выезд инженера","Устранение","Отчёт"] : ["Ariza","Diagnostika","Muhandis tashrifi","Tuzatish","Hisobot"];
  const flowIcons=[ClipboardCheck,Activity,UserCheck,Wrench,FileCheck2];
  return <main><SiteHeader /><section className="subhero services-hero"><Image src="/assets/hero-architectural.png" alt={locale === "ru" ? "Сервис инженерных систем" : "Muhandislik tizimlari servisi"} fill /><div className="site-shell"><h1>{locale === "ru" ? <>Сервис, который<br />сохраняет эффективность систем</> : <>Tizimlar samaradorligini<br />saqlaydigan servis</>}</h1><p>{locale === "ru" ? "От первичного аудита до круглосуточной технической поддержки." : "Dastlabki auditdan tunu kun texnik yordamgacha."}</p></div></section><div className="site-shell services-body"><div className="service-card-grid">{services.map(([Icon,title,text]) => <ArrowLink href="/contacts#lead" className="service-card" key={title}><Icon /><span><strong>{title}</strong><small>{text}</small></span></ArrowLink>)}</div><div className="service-lower service-lower-without-packages"><section className="sla-panel"><h2>{locale === "ru" ? "Наш стандарт обслуживания (SLA)" : "Xizmat ko‘rsatish standartimiz (SLA)"}</h2><div className="sla-flow">{flow.map((name,i) => {const Icon=flowIcons[i];return <div key={name}><IconBox icon={Icon}/><b>{name}</b>{i<4&&<ArrowRight className="sla-arrow"/>}</div>;})}</div></section><div><section className="support-panel"><h2>{locale === "ru" ? "Поддержка объекта" : "Obyektni qo‘llab-quvvatlash"}</h2><div className="support-kpis"><span><CheckCircle2 />{locale === "ru" ? "Системы работают штатно" : "Tizimlar me’yorda ishlamoqda"}</span><span><CalendarDays />{locale === "ru" ? "Следующее ТО: 12 дней" : "Keyingi servis: 12 kun"}</span><span><Bell />{locale === "ru" ? "Открытые заявки: 2" : "Ochiq arizalar: 2"}</span></div><table><thead><tr>{(locale === "ru" ? ["Система","Статус","Последняя проверка","Следующее ТО"] : ["Tizim","Holat","Oxirgi tekshiruv","Keyingi servis"]).map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{SYSTEMS.map((s,i)=>{const Icon=s.icon;return <tr key={s.slug}><td><Icon />{copy.scenario.tabs[s.slug]}</td><td><i />{locale === "ru" ? "Штатно" : "Me’yorda"}</td><td>{locale === "ru" ? "Сегодня" : "Bugun"}, 09:{41-i*2}</td><td>{10+i*2} {locale === "ru" ? "дней" : "kun"}</td></tr>;})}</tbody></table></section><ArrowLink href="/contacts#lead" className="service-calc">{locale === "ru" ? "Рассчитать стоимость обслуживания" : "Xizmat narxini hisoblash"}</ArrowLink></div></div></div><ReferenceFooter /></main>;
}

export function CompanyReferencePage() {
  const { locale } = useI18n();
  const copy = copyFor(locale);
  const badges = locale === "ru" ? [[ShieldCheck,"Сертифицированный Solution Partner Siemens"],[Users,"Партнёрство с Honeywell"],[Globe2,"ISO 9001:2015"],[LockKeyhole,"ISO/IEC 27001:2022"]] : [[ShieldCheck,"Siemens sertifikatlangan Solution Partner"],[Users,"Honeywell bilan hamkorlik"],[Globe2,"ISO 9001:2015"],[LockKeyhole,"ISO/IEC 27001:2022"]];
  const cycle = locale === "ru" ? [[ClipboardCheck,"Аудит","Анализ объекта и техническое задание"],[FileText,"Проектирование","Разработка решений и документации"],[Building2,"Поставка","Комплектация оборудования"],[Wrench,"Внедрение","Монтаж и пусконаладочные работы"],[Headphones,"Сервис 24/7","Поддержка на объекте"]] : [[ClipboardCheck,"Audit","Obyekt tahlili va texnik topshiriq"],[FileText,"Loyihalash","Yechim va hujjatlarni ishlab chiqish"],[Building2,"Yetkazib berish","Uskunalarni komplektlash"],[Wrench,"Joriy etish","Montaj va ishga tushirish"],[Headphones,"24/7 servis","Obyektda qo‘llab-quvvatlash"]];
  return <main><SiteHeader /><section className="company-hero"><div className="site-shell"><div><h1>{locale === "ru" ? <>Инженерная экспертиза,<br />которой доверяют</> : <>Ishonchli muhandislik<br />ekspertizasi</>}</h1><p>{copy.company.text}</p></div><div className="company-hero-photo"><Image src="/assets/company-control-room.webp" alt={locale === "ru" ? "Инженерный диспетчерский центр" : "Muhandislik dispetcherlik markazi"} fill sizes="(max-width: 980px) 100vw, 55vw"/></div></div><div className="site-shell company-badges">{badges.map(([Icon,text])=><div key={String(text)}><IconBox icon={Icon as LucideIcon}/><strong>{text as string}</strong></div>)}</div></section><div className="site-shell company-body"><section className="cycle-panel"><h2>{locale === "ru" ? "Полный цикл ответственности" : "To‘liq mas’uliyat sikli"}</h2><div>{cycle.map(([Icon,title,text],i)=><article key={String(title)}><b>{i+1}</b><Icon /><span><strong>{title as string}</strong><small>{text as string}</small></span>{i<4&&<ArrowRight/>}</article>)}</div></section><section className="partners-panel"><h2>{locale === "ru" ? "Наши партнёры" : "Hamkorlarimiz"}</h2><PartnerLogos /></section><section className="certificate-panel"><div className="certificate-images"><a href="/assets/certificate-iso-9001.jpg" target="_blank" rel="noreferrer"><Image src="/assets/certificate-iso-9001.jpg" alt="ISO 9001:2015" fill /></a><a href="/assets/certificate-iso-27001.jpg" target="_blank" rel="noreferrer"><Image src="/assets/certificate-iso-27001.jpg" alt="ISO/IEC 27001:2022" fill /></a></div><div><h2>{locale === "ru" ? <>Надёжность под защитой<br />мировых вендоров</> : <>Jahon brendlari bilan<br />himoyalangan ishonchlilik</>}</h2><p>{locale === "ru" ? "Мы соответствуем международным стандартам качества и информационной безопасности." : "Biz xalqaro sifat va axborot xavfsizligi standartlariga muvofiqmiz."}</p></div><ArrowLink href="/contacts#lead" className="button-primary">{locale === "ru" ? "Запросить презентацию" : "Taqdimotni so‘rash"}</ArrowLink></section></div><ReferenceFooter /></main>;
}

export function ContactsReferencePage() {
  const { locale } = useI18n();
  const copy = copyFor(locale);
  const steps = locale === "ru"
    ? [[ClipboardCheck,"1. Короткий бриф","Расскажите о проекте и требованиях"],[Calculator,"2. Предварительный расчёт","Подготовим оценку и подберём решения"],[UserCheck,"3. Встреча с инженером","Обсудим решения, сроки и бюджет"]]
    : [[ClipboardCheck,"1. Qisqa brif","Loyiha va talablar haqida ayting"],[Calculator,"2. Dastlabki hisob","Baholash va mos yechimlarni tayyorlaymiz"],[UserCheck,"3. Muhandis bilan uchrashuv","Yechim, muddat va budjetni muhokama qilamiz"]];
  return <main><SiteHeader /><div className="site-shell contacts-page"><section className="contacts-intro"><h1>{locale === "ru" ? "Обсудим ваш объект" : "Obyektingizni muhokama qilamiz"}</h1><p>{locale === "ru" ? "Расскажите о задаче — подготовим предварительную оценку и предложим следующий шаг." : "Vazifani ayting — dastlabki bahoni tayyorlab, keyingi qadamni taklif qilamiz."}</p><div className="contact-list"><a href={CONTACTS.phoneHref}><IconBox icon={Phone}/><span><small>{copy.contact.phone}</small><strong>{CONTACTS.phoneDisplay}</strong></span></a><a href={CONTACTS.emailHref}><IconBox icon={Mail}/><span><small>{copy.contact.email}</small><strong>INFO@BTECHNICS.UZ</strong></span></a><a href={CONTACTS.website}><IconBox icon={Globe2}/><span><small>{locale === "ru" ? "Сайт" : "Sayt"}</small><strong>BTECHNICS.UZ</strong></span></a><div><IconBox icon={Headphones}/><strong>{locale === "ru" ? "Техническая поддержка — 24/7" : "Texnik yordam — 24/7"}</strong></div></div><YandexMap locale={locale} /></section><section id="lead" className="contact-form-wrap"><ContactForm locale={locale} /><div className="contact-steps">{steps.map(([Icon,title,text])=><div key={String(title)}><IconBox icon={Icon as LucideIcon}/><strong>{title as string}</strong><p>{text as string}</p></div>)}</div></section><BlueCta title={locale === "ru" ? "Не ждите следующего счёта — запросите расчёт окупаемости" : "Keyingi hisobni kutmang — qoplanish hisobini so‘rang"} text={locale === "ru" ? "Узнайте, как наши решения снизят затраты именно на вашем объекте." : "Yechimlarimiz aynan sizning obyektingizda xarajatlarni qanday kamaytirishini bilib oling."} button={locale === "ru" ? "Запросить расчёт" : "Hisob so‘rash"} /></div><ReferenceFooter /></main>;
}

function ContactForm({ locale }: { locale: Locale }){
  const [state,setState]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [errorCode,setErrorCode]=useState("");
  const [fallbackUrl,setFallbackUrl]=useState("");
  const labels = locale === "ru" ? {
    name:"Имя", namePlaceholder:"Введите имя", company:"Компания", companyPlaceholder:"Введите компанию", phone:"Телефон", object:"Тип объекта", select:"Выберите тип объекта", task:"Какая задача стоит?", taskPlaceholder:"Опишите вашу задачу, требования и пожелания", send:"Отправить заявку", sending:"Отправляем…", sent:"Заявка отправлена", consent:"Нажимая кнопку, вы соглашаетесь на обработку персональных данных.", success:"Спасибо! Заявка отправлена специалисту.", error:"Не удалось доставить заявку в Telegram.", emailFallback:"Отправить заполненную заявку по email",
    errors:{not_configured:"Telegram не настроен на сервере",invalid_token_format:"Неверный формат токена",invalid_token:"Токен бота недействителен",invalid_chat_id:"Неверный Chat ID",chat_not_found:"Чат не найден — отправьте боту /start",bot_blocked:"Бот заблокирован получателем",chat_migrated:"Изменился Chat ID группы",rate_limited:"Слишком много запросов — повторите позже",network_error:"Сервер не связался с Telegram",telegram_rejected:"Telegram отклонил запрос"} as Record<string,string>,
    types:["Бизнес-центр","Отель","Торговый центр","Жилой комплекс","Склад / производство","Другое"],
  } : {
    name:"Ism", namePlaceholder:"Ismingizni kiriting", company:"Kompaniya", companyPlaceholder:"Kompaniyani kiriting", phone:"Telefon", object:"Obyekt turi", select:"Obyekt turini tanlang", task:"Qanday vazifa bor?", taskPlaceholder:"Vazifa, talab va istaklaringizni yozing", send:"Ariza yuborish", sending:"Yuborilmoqda…", sent:"Ariza yuborildi", consent:"Tugmani bosib, shaxsiy ma’lumotlarni qayta ishlashga rozilik bildirasiz.", success:"Rahmat! Ariza mutaxassisga yuborildi.", error:"Arizani Telegram’ga yetkazib bo‘lmadi.", emailFallback:"To‘ldirilgan arizani email orqali yuborish",
    errors:{not_configured:"Telegram serverda sozlanmagan",invalid_token_format:"Token formati noto‘g‘ri",invalid_token:"Bot tokeni yaroqsiz",invalid_chat_id:"Chat ID noto‘g‘ri",chat_not_found:"Chat topilmadi — botga /start yuboring",bot_blocked:"Qabul qiluvchi botni bloklagan",chat_migrated:"Guruh Chat ID raqami o‘zgargan",rate_limited:"So‘rovlar juda ko‘p — keyinroq urinib ko‘ring",network_error:"Server Telegram bilan bog‘lana olmadi",telegram_rejected:"Telegram so‘rovni rad etdi"} as Record<string,string>,
    types:["Biznes markazi","Mehmonxona","Savdo markazi","Turar joy majmuasi","Ombor / ishlab chiqarish","Boshqa"],
  };
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setState("sending");setErrorCode("");setFallbackUrl("");
    const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));
    try{
      const res=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,locale})});
      const result=await res.json().catch(()=>({})) as {error?:string;fallbackUrl?:string};
      if(res.ok){setState("success");form.reset();}
      else{setErrorCode(result.error ?? "delivery_failed");setFallbackUrl(result.fallbackUrl ?? "");setState("error");}
    }catch{setErrorCode("network_error");setState("error");}
  }
  const buttonText=state==="sending"?labels.sending:state==="success"?labels.sent:labels.send;
  return <form onSubmit={submit} className="contact-form"><div className="form-grid"><label>{labels.name}<input required minLength={2} autoComplete="name" name="name" placeholder={labels.namePlaceholder}/></label><label>{labels.company}<input autoComplete="organization" name="company" placeholder={labels.companyPlaceholder}/></label><label>{labels.phone}<input required minLength={5} autoComplete="tel" inputMode="tel" type="tel" name="phone" placeholder="+998 90 000 00 00"/></label><label>Email<input autoComplete="email" inputMode="email" type="email" name="email" placeholder="name@company.uz"/></label><label className="full">{labels.object}<select required name="objectType" defaultValue=""><option value="" disabled>{labels.select}</option>{labels.types.map(type=><option key={type}>{type}</option>)}</select></label><label className="full">{labels.task}<textarea required minLength={3} name="message" placeholder={labels.taskPlaceholder}/></label><label className="form-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" /></label></div><div className="form-submit"><button type="submit" className="button-primary" data-label={buttonText} disabled={state==="sending"}><span className="button-label">{buttonText}</span></button><span><LockKeyhole/>{labels.consent}</span></div><div className="form-status" aria-live="polite">{state==="success"&&<p className="form-success">{labels.success}</p>}{state==="error"&&<p className="form-error"><strong>{labels.errors[errorCode] ?? labels.error}</strong><small>{errorCode}</small>{fallbackUrl&&<a href={fallbackUrl}>{labels.emailFallback}<ArrowRight /></a>}</p>}</div></form>;
}

export function SystemDetailPage({ slug }: { slug: string }) {
  const { locale } = useI18n();
  const copy = copyFor(locale);
  const active = (SYSTEMS.some(s=>s.slug===slug)?slug:"energy") as SystemSlug;
  const item=SYSTEMS.find(s=>s.slug===active)!;
  const base=systemContent[active];
  const scenario=copy.scenario.items[active];
  const dashboardValues:Record<SystemSlug,string[]>={energy:["1-ombor, texnik xona","24","3","18%"],climate:["Ofis, 3-qavat","22,4 °C","45%","720 ppm"],leak:["Texnik xona","Bugun, 09:41","Oqish datchigi #12","Klapan yopildi"],access:["Server xonasi","Bugun, 09:41","O‘quvchi #08","Karimov A.A."],fire:["Texnik xona","Bugun, 09:41","Tutun datchigi #16","Tasdiq talab qilinadi"]};
  const c = locale === "ru" ? base : {
    ...base,
    problem:scenario.problem,
    steps:scenario.steps.map(step=>[step,"Jarayon loyiha sozlamalari bo‘yicha avtomatik bajariladi."] as [string,string]),
    benefits:scenario.benefits.map(benefit=>[benefit,"Natija boshqaruv panelida o‘lchanadi va nazorat qilinadi."] as [string,string]),
    dashboard:scenario.dashboard.map((label,index)=>[label,dashboardValues[active][index]] as [string,string]),
    facts:[["Ma’lumot","Real vaqt","Datchik va kontroller ma’lumotlari yagona panelda ko‘rsatiladi."],["Reaksiya","Avtomatik ssenariy","Harakatlar tasdiqlangan loyiha algoritmi bo‘yicha bajariladi."],["Nazorat","To‘liq jurnal","Voqealar, buyruqlar va mas’ullar harakati tarixda saqlanadi."]] as [string,string,string][],
    status:base.danger?"E’tibor talab qiladi":"Me’yorda",
  };
  const StepIcons:LucideIcon[] = active==="energy"?[Gauge,BarChart3,SlidersHorizontal]:active==="climate"?[Thermometer,BarChart3,CloudSun]:active==="leak"?[Droplets,Bell,Settings2]:active==="access"?[UserCheck,ShieldCheck,FileText]:[Flame,Bell,Building2];
  const systemName=copy.scenario.tabs[active];
  const labels=locale==="ru"?["Проблема","Схема работы","Выгода для владельца","Что видно в панели","Факты и эффект"]:["Muammo","Ish sxemasi","Bino egasi uchun foyda","Panelda nima ko‘rinadi","Fakt va samara"];
  return <main className="system-detail-page"><header className="system-detail-header"><Brand/><nav>{SYSTEMS.map(s=><Link key={s.slug} href={`/systems/${s.slug}`} className={s.slug===active?"active":""}>{copy.scenario.tabs[s.slug]}</Link>)}</nav><Link href="/" className="system-home"><MenuSquare/><span>{locale === "ru" ? "Сайт" : "Sayt"}</span></Link></header><div className="system-detail-grid"><section className="system-problem panel"><h2>1. {labels[0]}</h2><div className="system-problem-image"><Image src={c.image} alt={`${labels[0]}: ${systemName}`} fill priority /></div><p>{c.problem}</p></section><section className="system-workflow panel"><h2>2. {labels[1]}</h2><div className="workflow-steps">{c.steps.map(([title,text],i)=><article key={title}><b>{i+1}</b><IconBox icon={StepIcons[i]} danger={active==="fire"&&i===0}/><strong>{title}</strong><p>{text}</p>{i<2&&<ArrowRight className="workflow-arrow"/>}</article>)}</div></section><section className="system-benefits panel"><h2>3. {labels[2]}</h2>{c.benefits.map(([title,text],i)=>{const Icons=[ShieldCheck,Clock3,SlidersHorizontal,FileText];const I=Icons[i];return <article key={title}><I/><span><strong>{title}</strong><p>{text}</p></span></article>})}</section><section className="system-dashboard panel"><h2>4. {labels[3]}</h2><div className="dashboard-demo"><div className="event-head"><IconBox icon={item.icon} danger={c.danger}/><span><small>{locale === "ru" ? "Событие" : "Voqea"}</small><strong>{systemName}</strong></span><i className={c.danger?"danger":""}>● {c.status}</i></div>{c.dashboard.map(([label,value])=><div key={label}><b>{label}</b><span>{value}</span></div>)}</div><SystemPanelVisual active={active} danger={c.danger} locale={locale} /></section><section className="system-facts panel"><h2>5. {labels[4]}</h2><div>{c.facts.map(([label,value,detail],i)=>{const Icons=[ShieldCheck,Clock3,FileText];const I=Icons[i];return <article key={label}><IconBox icon={I}/><span><small>{label}</small><strong>{value}</strong><p>{detail}</p></span></article>})}</div><p className="system-facts-note">{locale === "ru" ? "Показатели в интерфейсе выше — демонстрационные. Измеримый эффект и автоматические действия фиксируются в проекте после технического аудита." : "Yuqoridagi interfeys ko‘rsatkichlari namuna sifatida berilgan. O‘lchanadigan samara va avtomatik harakatlar texnik auditdan keyin loyihada belgilanadi."}</p></section></div></main>;
}
