"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
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
import { CONTACTS } from "@/content/site";

const SYSTEMS = [
  { slug: "energy", name: "Энергия", short: "Учёт и оптимизация потребления", icon: Zap },
  { slug: "climate", name: "Климат", short: "Температура, влажность и качество воздуха", icon: CloudSun },
  { slug: "leak", name: "Протечка", short: "Раннее обнаружение и автоматическое перекрытие", icon: Droplets },
  { slug: "access", name: "Доступ", short: "Контроль доступа и учёт рабочего времени", icon: LockKeyhole },
  { slug: "fire", name: "Пожар", short: "Обнаружение, оповещение и эвакуационные сценарии", icon: Flame },
] as const;

const PARTNER_LOGOS = [
  { name: "Siemens", src: "/assets/partners/siemens.svg" },
  { name: "Honeywell", src: "/assets/partners/honeywell.svg" },
  { name: "Legrand", src: "/assets/partners/legrand.svg" },
  { name: "Schneider Electric", src: "/assets/partners/schneider-electric.svg" },
  { name: "ABB", src: "/assets/partners/abb.svg" },
  { name: "Hikvision", src: "/assets/partners/hikvision.svg" },
  { name: "Dahua Technology", src: "/assets/partners/dahua.svg" },
  { name: "Bosch", src: "/assets/partners/bosch.svg" },
  { name: "Teltonika", src: "/assets/partners/teltonika.png" },
  { name: "Axis Communications", src: "/assets/partners/axis.png" },
  { name: "Crestron", src: "/assets/partners/crestron.png" },
  { name: "Grandstream", src: "/assets/partners/grandstream.png" },
  { name: "Jabra GN", src: "/assets/partners/jabra.png" },
] as const;

type SystemSlug = typeof SYSTEMS[number]["slug"];

const systemContent: Record<SystemSlug, {
  problem: string; image: string; steps: [string, string][]; benefits: [string, string][];
  dashboard: [string, string][]; facts: [string, string][]; status: string; danger?: boolean;
}> = {
  energy: {
    problem: "Избыточное потребление и отсутствие прозрачного контроля приводят к непредсказуемым расходам.", image: "/assets/system-energy.png",
    steps: [["Счётчики собирают данные", "Интеллектуальные счётчики фиксируют потребление электроэнергии."], ["BMS выявляет отклонения", "Платформа анализирует данные и находит аномалии."], ["Система оптимизирует режимы", "Оборудование автоматически переводится в экономичный режим."]],
    benefits: [["Снижение затрат", "Оптимизация энергопотребления и операционных расходов."], ["Прозрачный учёт", "Детализация по всем объектам, зонам и арендаторам."], ["Контроль пиковых нагрузок", "Снижение пиков и штрафов энергоснабжающих организаций."], ["Прогнозируемый бюджет", "Точный прогноз потребления и планирование бюджета."]],
    dashboard: [["Зона", "Склад 1, техническое помещение"], ["Объекты", "24"], ["Отклонения", "3"], ["Экономия", "18%"]], facts: [["До", "30% экономии"], ["Данные", "в реальном времени"], ["Контроль", "24/7"]], status: "Активно",
  },
  climate: {
    problem: "Нестабильная температура, влажность и качество воздуха снижают комфорт и производительность.", image: "/assets/system-climate.png",
    steps: [["Датчики измеряют климат", "Температура, влажность и качество воздуха измеряются по зонам."], ["BMS сравнивает с нормой", "Параметры сравниваются с заданными значениями."], ["Оборудование регулируется", "Вентиляция, охлаждение и нагрев меняются автоматически."]],
    benefits: [["Комфорт арендаторов", "Стабильный климат повышает комфорт пользователей."], ["Стабильный микроклимат", "Оптимальные параметры поддерживаются во всех зонах."], ["Экономия энергии", "Автоматическая регулировка снижает потребление."], ["Меньше жалоб", "Система быстрее реагирует на отклонения."]],
    dashboard: [["Зона", "Офис, 3 этаж"], ["Температура", "22,4 °C"], ["Влажность", "45%"], ["CO₂", "720 ppm"]], facts: [["Контроль", "24/7"], ["Режим", "автоматический"], ["Журнал", "единый"]], status: "Норма",
  },
  leak: {
    problem: "Скрытые протечки приводят к повреждению имущества, простоям и дорогостоящему ремонту.", image: "/assets/scenario-leak.jpg",
    steps: [["Датчик обнаруживает воду", "Фиксирует появление воды в контролируемой зоне."], ["Система отправляет сигнал", "BMS регистрирует событие и уведомляет ответственных."], ["Подача воды перекрывается", "Электропривод автоматически закрывает клапан."]],
    benefits: [["Минимизация ущерба", "Раннее обнаружение снижает риск повреждения помещений."], ["Автоматическое перекрытие", "Подача воды прекращается без участия персонала."], ["Мгновенные уведомления", "Ответственные получают сигнал сразу после события."], ["Журнал событий", "Все действия фиксируются для анализа."]],
    dashboard: [["Зона", "Техническое помещение"], ["Время", "Сегодня, 09:41"], ["Датчик", "Датчик протечки #12"], ["Статус", "Клапан перекрыт"]], facts: [["Обнаружение", "24/7"], ["Защита", "автоматическая"], ["Панель", "единая"]], status: "Требует внимания", danger: true,
  },
  access: {
    problem: "Разрозненные системы доступа не дают единой картины посещений, зон и рабочего времени.", image: "/assets/system-access.png",
    steps: [["Сотрудник проходит идентификацию", "Карта, биометрия или PIN-код используются для входа."], ["Система проверяет права", "Проверяются зона, время и правила прохода."], ["Событие фиксируется", "Запись сохраняется для отчётности и анализа."]],
    benefits: [["Защита зон", "Ограничение доступа в критически важные помещения."], ["Учёт рабочего времени", "Точный учёт прихода, ухода и опозданий."], ["Управление правами", "Гибкая настройка ролей и временных правил."], ["Расследование событий", "Полный журнал для быстрого анализа инцидентов."]],
    dashboard: [["Зона", "Серверная"], ["Время", "Сегодня, 09:41"], ["Устройство", "Считыватель #08"], ["Пользователь", "Иванов И.И."]], facts: [["Права", "мгновенно"], ["Журнал", "единый"], ["Контроль", "24/7"]], status: "Доступ разрешён",
  },
  fire: {
    problem: "Позднее обнаружение и несогласованное оповещение увеличивают риск для людей и имущества.", image: "/assets/system-fire.png",
    steps: [["Датчик фиксирует угрозу", "Датчики дыма и температуры передают сигнал системе."], ["Система запускает оповещение", "Звуковые и световые сигналы отправляются пользователям."], ["BMS выполняет сценарий", "Инженерные системы выполняют аварийные действия."]],
    benefits: [["Раннее обнаружение", "Снижение рисков благодаря оперативному выявлению."], ["Оповещение людей", "Своевременное сообщение для быстрой эвакуации."], ["Управление системами", "Автоматическое отключение вентиляции и электропитания."], ["Журнал событий", "Полная история тревог и действий."]],
    dashboard: [["Зона", "Техническое помещение"], ["Время", "Сегодня, 09:41"], ["Датчик", "Датчик дыма #16"], ["Статус", "Требует подтверждения"]], facts: [["Контроль", "24/7"], ["Сценарии", "автоматические"], ["Панель", "единая"]], status: "Требует подтверждения", danger: true,
  },
};

function IconBox({ icon: Icon, danger = false }: { icon: LucideIcon; danger?: boolean }) {
  return <span className={`icon-box ${danger ? "danger" : ""}`}><Icon aria-hidden="true" /></span>;
}

function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`arrow-link ${className}`}>{children}<ArrowRight /></Link>;
}

function BlueCta({ title, text, button }: { title: string; text: string; button: string }) {
  return <section className="blue-cta"><div><h2>{title}</h2><p>{text}</p></div><ArrowLink href="/contacts#lead" className="blue-cta-button">{button}</ArrowLink></section>;
}

function PartnerLogos() {
  return <div className="partner-logo-grid">{PARTNER_LOGOS.map(({name,src})=><div className="partner-logo-card" key={name}><Image src={src} alt={`Логотип ${name}`} width={170} height={56} sizes="170px" /></div>)}</div>;
}

function ReferenceFooter() {
  return <footer className="reference-footer"><div className="site-shell reference-footer-grid"><div><Brand inverse /><p>Автоматизация, безопасность и эффективная эксплуатация зданий.</p></div><nav aria-label="Навигация в подвале"><Link href="/#systems">Системы</Link><Link href="/#projects">Проекты</Link><Link href="/#services">Сервисы</Link><Link href="/#company">О компании</Link></nav><div className="reference-footer-contacts"><a href={CONTACTS.phoneHref}><Phone />{CONTACTS.phoneDisplay}</a><a href={CONTACTS.emailHref}><Mail />{CONTACTS.email}</a></div></div><div className="site-shell reference-footer-bottom"><span>© {new Date().getFullYear()} Buyursin Technics</span><Link href="/#contacts">Обсудить проект</Link></div></footer>;
}

export function SolutionsReferencePage() {
  const features = [[Leaf, "Экономия ресурсов", "Оптимизация потребления энергии и воды до 30%"], [ShieldCheck, "Контроль 24/7", "Непрерывный мониторинг всех систем"], [Activity, "Меньше рисков", "Предотвращаем аварии и простои"], [Users, "Комфорт для людей", "Здоровый микроклимат каждый день"]] as const;
  const services = [[ClipboardCheck,"Аудит объекта","Находим потери, риски и точки автоматизации"],[FileText,"Проектирование","Разрабатываем архитектуру и рабочую документацию"],[Wrench,"Монтаж и запуск","Интегрируем оборудование и тестируем сценарии"],[Headphones,"Сервис 24/7","Контролируем состояние систем после запуска"]] as const;
  return <main className="home-page"><SiteHeader />
    <section id="solutions" className="hero-reference"><Image src="/assets/hero-architectural.png" alt="Современное офисное здание с автоматизированными инженерными системами" fill priority className="hero-reference-image" /><div className="hero-wash" /><div className="site-shell hero-reference-inner"><div className="hero-copy"><h1>Инженерные системы,<br />которые работают<br />на ваш результат</h1><p>Проектируем, внедряем и обслуживаем интеллектуальные системы зданий — от автоматизации и энергоконтроля до безопасности.</p><div className="hero-buttons"><ArrowLink href="#contacts" className="button-primary">Получить консультацию</ArrowLink><ArrowLink href="#systems" className="button-secondary">Смотреть решения</ArrowLink></div></div><div className="hero-float-card energy-card"><small>Энергопотребление</small><strong>1 245 кВт·ч</strong><span>−18% к вчера</span><svg viewBox="0 0 120 38" aria-hidden="true"><polyline points="0,31 13,27 25,29 38,20 51,24 65,13 78,18 91,5 105,11 120,8" /></svg></div><div className="hero-float-card climate-card"><small>Климат</small><strong>22,4 °C</strong><span>Комфорт</span></div><div className="hero-float-card status-card"><small>Статус систем</small><strong>Все системы</strong><span><CheckCircle2 /> В норме</span></div></div><div className="site-shell hero-feature-row">{features.map(([Icon, title, text]) => <ArrowLink href="#systems" key={title} className="hero-feature"><IconBox icon={Icon} /><span><strong>{title}</strong><small>{text}</small></span></ArrowLink>)}</div></section>

    <section id="systems" className="home-section home-systems"><div className="site-shell"><div className="home-section-head"><div><span className="section-eyebrow">Единый контур</span><h2>Все инженерные системы<br />под вашим контролем</h2></div><p>Данные, тревоги и автоматические сценарии объединены в одной панели — без разрозненных пультов и таблиц.</p></div><div className="home-system-layout"><div className="home-system-list">{SYSTEMS.map(({slug,name,short,icon})=><ArrowLink key={slug} href={`/systems/${slug}`} className="home-system-card"><IconBox icon={icon} danger={slug==="fire"}/><span><strong>{name}</strong><small>{short}</small></span></ArrowLink>)}</div><BmsDashboard /></div><ArrowLink href="/systems" className="home-text-link">Посмотреть все системы</ArrowLink></div></section>

    <section id="projects" className="home-section home-projects"><div className="site-shell"><div className="home-section-head"><div><span className="section-eyebrow">Проекты</span><h2>Решения для объектов<br />разного масштаба</h2></div><p>Реальные архитектурные фотографии показывают типы объектов, для которых проектируются системы автоматизации и безопасности.</p></div><div className="home-project-grid">{projectCards.slice(0,4).map(({type,title,image})=><article className="home-project-card" key={title}><Image src={image} alt={`Современный объект: ${title}`} fill sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 25vw"/><div className="home-project-overlay"><small>{type}</small><strong>{title}</strong><span>Иллюстративное фото объекта</span></div></article>)}</div><ArrowLink href="/projects" className="home-text-link">Смотреть все проекты</ArrowLink></div></section>

    <section id="services" className="home-section home-services"><div className="site-shell"><div className="home-section-head"><div><span className="section-eyebrow">Полный цикл</span><h2>От обследования<br />до сервиса 24/7</h2></div><p>Одна команда отвечает за проектирование, внедрение, запуск и дальнейшую работоспособность системы.</p></div><div className="home-service-grid">{services.map(([Icon,title,text],index)=><ArrowLink href="/services" className="home-service-card" key={title}><span className="home-service-number">0{index+1}</span><Icon/><span><strong>{title}</strong><small>{text}</small></span></ArrowLink>)}</div></div></section>

    <section id="company" className="home-section home-company"><div className="site-shell home-company-grid"><div className="home-company-photo"><Image src="/assets/company-control-room.webp" alt="Инженер работает в современном диспетчерском центре" fill sizes="(max-width: 980px) 100vw, 50vw"/></div><div className="home-company-copy"><span className="section-eyebrow">О компании</span><h2>Инженерная экспертиза полного цикла</h2><p>BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы зданий.</p><div className="home-company-facts"><span><strong>15 лет</strong><small>инженерной практики</small></span><span><strong>24/7</strong><small>сервис и мониторинг</small></span><span><strong>ISO</strong><small>стандарты качества</small></span></div><ArrowLink href="/company" className="button-secondary">Подробнее о компании</ArrowLink></div></div><div className="site-shell home-partners"><p>Технологии мировых производителей</p><PartnerLogos /></div></section>

    <section id="contacts" className="home-section home-contacts"><div className="site-shell home-contact-grid"><div><span className="section-eyebrow">Контакты</span><h2>Обсудим ваш объект</h2><p>Оставьте контакты и кратко опишите задачу. Заявка придёт ответственному специалисту одним структурированным сообщением.</p><div className="home-contact-links"><a href={CONTACTS.phoneHref}><Phone/>{CONTACTS.phoneDisplay}</a><a href={CONTACTS.emailHref}><Mail/>{CONTACTS.email}</a></div></div><ContactForm /></div></section>
    <ReferenceFooter />
  </main>;
}

export function SystemsOverviewPage() {
  return <main><SiteHeader /><section className="overview-hero"><Image src="/assets/hero-architectural.png" alt="Автоматизированное здание" fill className="overview-building" /><div className="site-shell"><h1>Все инженерные системы —<br />в одном контуре управления</h1><p>Контроль, аналитика и автоматические сценарии для вашего объекта.</p></div></section><div className="site-shell overview-body"><div className="system-tabs">{SYSTEMS.map(({ slug, name, icon: Icon }, i) => <Link href={`/systems/${slug}`} key={slug} className={i === 0 ? "active" : ""}><Icon />{name}</Link>)}</div><section className="system-map"><div className="map-side">{SYSTEMS.slice(0,2).map(({ slug, name, short, icon }) => <ArrowLink href={`/systems/${slug}`} key={slug} className="system-mini-card"><IconBox icon={icon} /><span><strong>{name}</strong><small>{short}</small></span></ArrowLink>)}</div><BmsDashboard /><div className="map-side">{SYSTEMS.slice(2).map(({ slug, name, short, icon }) => <ArrowLink href={`/systems/${slug}`} key={slug} className="system-mini-card"><IconBox icon={icon} danger={slug === "fire"} /><span><strong>{name}</strong><small>{short}</small></span></ArrowLink>)}</div></section><section className="overview-stats"><div><h2>Единая панель управления</h2><p>Все системы и данные — в одном интерфейсе.</p></div>{[[Building2,"Объекты","24"],[Bell,"Активные события","3"],[TrendingDown,"Экономия","18%"],[ShieldCheck,"Контроль","24/7"]].map(([Icon,label,value]) => <div className="overview-stat" key={String(label)}><IconBox icon={Icon as LucideIcon} danger={value === "3"} /><span><small>{label as string}</small><strong>{value as string}</strong></span></div>)}</section><BlueCta title="Посмотреть сценарии работы" text="Узнайте, как системы взаимодействуют и автоматически реагируют на события." button="Выбрать систему" /></div><ReferenceFooter /></main>;
}

function BmsDashboard() {
  return <div className="bms-panel"><aside><Brand compact /><span className="active">⌂ Обзор</span><span>▣ Объекты</span><span>♧ События</span><span>◉ Аналитика</span><span>♢ Сценарии</span></aside><div className="bms-content"><header><strong>Платформа BMS</strong><small>Единый контур управления объектом</small></header><div className="bms-kpis"><span>Объекты <b>24</b></span><span>События <b className="red">3</b></span><span>Экономия <b className="green">18%</b></span><span>Контроль <b>24/7</b></span></div><div className="bms-chart"><small>Потребление энергии</small><strong>1 245 кВт·ч</strong><svg viewBox="0 0 380 90" aria-hidden="true"><polyline points="0,65 35,54 70,60 105,32 140,39 175,74 210,68 245,44 280,50 315,33 350,48 380,42" /></svg></div><div className="bms-bottom"><span><b>Последние события</b><small>Протечка воды · 09:41</small><small>Пожарное оповещение · 09:15</small></span><span><b>Быстрые действия</b><small>Открыть шлагбаум</small><small>Сформировать отчёт</small></span></div></div></div>;
}

const projectCards = [
  { type: "Бизнес-центры", title: "БЦ Centris Towers", image: "/assets/project-business-center.webp" },
  { type: "Банки", title: "Сбербанк-Сити", image: "/assets/project-bank.webp" },
  { type: "Бизнес-центры", title: "Офисы BMW", image: "/assets/project-office.webp" },
  { type: "Отели", title: "Отель Sheraton", image: "/assets/project-hotel.webp" },
  { type: "Отели", title: "Swissotel", image: "/assets/project-retail.webp" },
  { type: "Торговые центры", title: "ТПЦ IKEA Almaty", image: "/assets/project-mall.webp" },
  { type: "Спорт", title: "Стадион Ozon Arena", image: "/assets/project-arena.webp" },
  { type: "Банки", title: "Касса A+ «1x»", image: "/assets/project-stadium.webp" },
] as const;

export function ProjectsReferencePage() {
  const [filter, setFilter] = useState("Все проекты");
  const filters = ["Все проекты", "Бизнес-центры", "Банки", "Отели", "Торговые центры", "Спорт"];
  const shown = filter === "Все проекты" ? projectCards : projectCards.filter(({type}) => type === filter);
  return <main><SiteHeader /><section className="subhero"><Image src="/assets/project-office.webp" alt="Современный объект" fill /><div className="site-shell"><h1>Проекты, которым доверяют</h1><p>Комплексные инженерные решения для коммерческой недвижимости и инфраструктуры.</p></div></section><div className="site-shell projects-body"><div className="filter-pills">{filters.map(item => <button type="button" key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div><div className="project-grid">{shown.map(({type,title,image}) => <article className="project-card" key={title}><div className="project-photo"><Image src={image} alt={`Современный объект: ${title}`} fill sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 25vw"/><span className="project-photo-note">Иллюстративное фото</span></div><div className="project-info"><small>{type}</small><ArrowLink href="/contacts#lead"><strong>{title}</strong></ArrowLink><span>Реализованные системы:</span><div className="project-tags"><i>BMS</i><i>контроль доступа</i><i>видеонаблюдение</i><i>пожарные системы</i></div></div></article>)}</div><section className="project-benefits">{[[Building2,"8+","знаковых объектов"],[Settings2,"Полный цикл","от проекта до сервиса"],[Clock3,"Сервис 24/7","круглосуточная поддержка"],[Globe2,"Мировые вендоры","проверенные технологии"]].map(([Icon,bold,small]) => <div key={String(bold)}><IconBox icon={Icon as LucideIcon} /><span><strong>{bold as string}</strong><small>{small as string}</small></span></div>)}</section><BlueCta title="Обсудить ваш проект" text="Расскажите о задачах — наши специалисты подберут оптимальное решение." button="Получить консультацию" /></div><ReferenceFooter /></main>;
}

export function ServicesReferencePage() {
  const services = [[ClipboardCheck,"Аудит и обследование","инвентаризация, замеры, поиск потерь"],[FileText,"Проектирование","рабочая документация и подбор оборудования"],[Wrench,"Монтаж и пусконаладка","установка, настройка и ввод в эксплуатацию"],[Headphones,"Техническое сопровождение 24/7","мониторинг, диагностика и обслуживание"]] as const;
  return <main><SiteHeader /><section className="subhero services-hero"><Image src="/assets/hero-architectural.png" alt="Сервис инженерных систем" fill /><div className="site-shell"><h1>Сервис, который<br />сохраняет эффективность систем</h1><p>От первичного аудита до круглосуточной технической поддержки.</p></div></section><div className="site-shell services-body"><div className="service-card-grid">{services.map(([Icon,title,text]) => <ArrowLink href="/contacts#lead" className="service-card" key={title}><Icon /><span><strong>{title}</strong><small>{text}</small></span></ArrowLink>)}</div><div className="service-lower"><div><section className="sla-panel"><h2>Наш стандарт обслуживания (SLA)</h2><div className="sla-flow">{[[ClipboardCheck,"Заявка"],[Activity,"Диагностика"],[UserCheck,"Выезд инженера"],[Wrench,"Устранение"],[FileCheck2,"Отчёт"]].map(([Icon,name],i) => <div key={String(name)}><IconBox icon={Icon as LucideIcon}/><b>{name as string}</b>{i<4&&<ArrowRight className="sla-arrow"/>}</div>)}</div></section><section className="package-panel"><h2>Пакеты сервисного обслуживания</h2><div className="package-grid">{[["Базовый",["Плановые выезды","Регламентное обслуживание","Удалённый мониторинг"]],["Расширенный",["Всё из пакета «Базовый»","Приоритетная поддержка","Сокращённые сроки"]],["24/7",["Всё из пакета «Расширенный»","Круглосуточная поддержка","Максимальный приоритет"]]].map(([name,items],i)=><div key={name as string} className={i===2?"featured":""}><strong>{name as string}</strong>{(items as string[]).map(x=><span key={x}>• {x}</span>)}</div>)}</div></section></div><div><section className="support-panel"><h2>Поддержка объекта</h2><div className="support-kpis"><span><CheckCircle2 />Системы работают штатно</span><span><CalendarDays />Следующее ТО: 12 дней</span><span><Bell />Открытые заявки: 2</span></div><table><thead><tr><th>Система</th><th>Статус</th><th>Последняя проверка</th><th>Следующее ТО</th></tr></thead><tbody>{SYSTEMS.map((s,i)=><tr key={s.slug}><td><s.icon />{s.name}</td><td><i />Штатно</td><td>Сегодня, 09:{41-i*2}</td><td>{10+i*2} дней</td></tr>)}</tbody></table></section><ArrowLink href="/contacts#lead" className="service-calc"><Calculator />Рассчитать стоимость обслуживания</ArrowLink></div></div></div><ReferenceFooter /></main>;
}

export function CompanyReferencePage() {
  return <main><SiteHeader /><section className="company-hero"><div className="site-shell"><div><h1>Инженерная экспертиза,<br />которой доверяют</h1><p>BUYURSIN TECHNICS проектирует, внедряет и обслуживает интеллектуальные системы зданий.</p></div><div className="company-hero-photo"><Image src="/assets/company-control-room.webp" alt="Инженерный диспетчерский центр" fill sizes="(max-width: 980px) 100vw, 55vw"/></div></div><div className="site-shell company-badges">{[[ShieldCheck,"Сертифицированный Solution Partner Siemens"],[Users,"Партнёрство с Honeywell"],[Globe2,"ISO 9001:2015"],[LockKeyhole,"ISO/IEC 27001:2022"]].map(([Icon,text])=><div key={String(text)}><IconBox icon={Icon as LucideIcon}/><strong>{text as string}</strong></div>)}</div></section><div className="site-shell company-body"><section className="cycle-panel"><h2>Полный цикл ответственности</h2><div>{[[ClipboardCheck,"Аудит","Анализ объекта и техническое задание"],[FileText,"Проектирование","Разработка решений и документации"],[Building2,"Поставка","Комплектация оборудования"],[Wrench,"Внедрение","Монтаж и пусконаладочные работы"],[Headphones,"Сервис 24/7","Поддержка на объекте"]].map(([Icon,title,text],i)=><article key={String(title)}><b>{i+1}</b><Icon /><span><strong>{title as string}</strong><small>{text as string}</small></span>{i<4&&<ArrowRight/>}</article>)}</div></section><section className="partners-panel"><h2>Наши партнёры</h2><PartnerLogos /></section><section className="certificate-panel"><div className="certificate-images"><a href="/assets/certificate-iso-9001.jpg" target="_blank" rel="noreferrer"><Image src="/assets/certificate-iso-9001.jpg" alt="Сертификат ISO 9001:2015" fill /></a><a href="/assets/certificate-iso-27001.jpg" target="_blank" rel="noreferrer"><Image src="/assets/certificate-iso-27001.jpg" alt="Сертификат ISO/IEC 27001:2022" fill /></a></div><div><h2>Надёжность под защитой<br />мировых вендоров</h2><p>Мы соответствуем международным стандартам качества и информационной безопасности.</p></div><ArrowLink href="/contacts#lead" className="button-primary">Запросить презентацию</ArrowLink></section></div><ReferenceFooter /></main>;
}

export function ContactsReferencePage() {
  return <main><SiteHeader /><div className="site-shell contacts-page"><section className="contacts-intro"><h1>Обсудим ваш объект</h1><p>Расскажите о задаче — подготовим предварительную оценку и предложим следующий шаг.</p><div className="contact-list"><a href={CONTACTS.phoneHref}><IconBox icon={Phone}/><span><small>Телефон</small><strong>{CONTACTS.phoneDisplay}</strong></span></a><a href={CONTACTS.emailHref}><IconBox icon={Mail}/><span><small>Email</small><strong>INFO@BTECHNICS.UZ</strong></span></a><a href={CONTACTS.website}><IconBox icon={Globe2}/><span><small>Сайт</small><strong>BTECHNICS.UZ</strong></span></a><div><IconBox icon={Headphones}/><strong>Техническая поддержка — 24/7</strong></div></div><div className="contact-actions"><h2>Свяжитесь с нами</h2><div><a href={CONTACTS.phoneHref}><Phone/>Позвонить нам</a><a href={CONTACTS.emailHref}><Mail/>Написать на email</a><a href={CONTACTS.website}><Globe2/>Перейти на сайт</a></div></div></section><section id="lead" className="contact-form-wrap"><ContactForm /><div className="contact-steps">{[[ClipboardCheck,"1. Короткий бриф","Расскажите о проекте и требованиях"],[Calculator,"2. Предварительный расчёт","Подготовим оценку и подберём решения"],[UserCheck,"3. Встреча с инженером","Обсудим решения, сроки и бюджет"]].map(([Icon,title,text])=><div key={String(title)}><IconBox icon={Icon as LucideIcon}/><strong>{title as string}</strong><p>{text as string}</p></div>)}</div></section><BlueCta title="Не ждите следующего счёта — запросите расчёт окупаемости" text="Узнайте, как наши решения снизят затраты именно на вашем объекте." button="Запросить расчёт" /></div><ReferenceFooter /></main>;
}

function ContactForm(){
  const [state,setState]=useState<"idle"|"sending"|"success"|"error">("idle");
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setState("sending");const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));try{const res=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,locale:"ru"})});if(res.ok){setState("success");form.reset();}else setState("error");}catch{setState("error");}}
  return <form onSubmit={submit} className="contact-form"><div className="form-grid"><label>Имя<input required autoComplete="name" name="name" placeholder="Введите имя"/></label><label>Компания<input autoComplete="organization" name="company" placeholder="Введите компанию"/></label><label>Телефон<input required autoComplete="tel" inputMode="tel" type="tel" name="phone" placeholder="+998 90 000 00 00"/></label><label>Email<input autoComplete="email" inputMode="email" type="email" name="email" placeholder="name@company.uz"/></label><label className="full">Тип объекта<select required name="objectType" defaultValue=""><option value="" disabled>Выберите тип объекта</option><option>Бизнес-центр</option><option>Отель</option><option>Торговый центр</option><option>Жилой комплекс</option><option>Склад / производство</option><option>Другое</option></select></label><label className="full">Какая задача стоит?<textarea required name="message" placeholder="Опишите вашу задачу, требования и пожелания"/></label></div><div className="form-submit"><button type="submit" className="button-primary" disabled={state==="sending"}>{state==="sending"?"Отправляем…":state==="success"?"Заявка отправлена":"Отправить заявку"}</button><span><LockKeyhole/>Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</span></div><div className="form-status" aria-live="polite">{state==="success"&&<p className="form-success">Спасибо! Заявка отправлена специалисту.</p>}{state==="error"&&<p className="form-error">Не удалось отправить. Позвоните нам или напишите на email.</p>}</div></form>;
}

export function SystemDetailPage({ slug }: { slug: string }) {
  const active = (SYSTEMS.some(s=>s.slug===slug)?slug:"energy") as SystemSlug;
  const item=SYSTEMS.find(s=>s.slug===active)!; const c=systemContent[active];
  const StepIcons:LucideIcon[] = active==="energy"?[Gauge,BarChart3,SlidersHorizontal]:active==="climate"?[Thermometer,BarChart3,CloudSun]:active==="leak"?[Droplets,Bell,Settings2]:active==="access"?[UserCheck,ShieldCheck,FileText]:[Flame,Bell,Building2];
  return <main className="system-detail-page"><header className="system-detail-header"><Brand/><nav>{SYSTEMS.map(s=><Link key={s.slug} href={`/systems/${s.slug}`} className={s.slug===active?"active":""}>{s.name}</Link>)}</nav><Link href="/" className="system-home"><MenuSquare/><span>Сайт</span></Link></header><div className="system-detail-grid"><section className="system-problem panel"><h2>1. Проблема</h2><div className="system-problem-image"><Image src={c.image} alt={`Проблема: ${item.name}`} fill priority /></div><p>{c.problem}</p></section><section className="system-workflow panel"><h2>2. Схема работы</h2><div className="workflow-steps">{c.steps.map(([title,text],i)=><article key={title}><b>{i+1}</b><IconBox icon={StepIcons[i]} danger={active==="fire"&&i===0}/><strong>{title}</strong><p>{text}</p>{i<2&&<ArrowRight className="workflow-arrow"/>}</article>)}</div></section><section className="system-benefits panel"><h2>3. Выгода для владельца</h2>{c.benefits.map(([title,text],i)=>{const Icons=[ShieldCheck,Clock3,SlidersHorizontal,FileText];const I=Icons[i];return <article key={title}><I/><span><strong>{title}</strong><p>{text}</p></span></article>})}</section><section className="system-dashboard panel"><h2>4. Что видно в панели</h2><div className="dashboard-demo"><div className="event-head"><IconBox icon={item.icon} danger={c.danger}/><span><small>Событие</small><strong>{item.name}</strong></span><i className={c.danger?"danger":""}>● {c.status}</i></div>{c.dashboard.map(([label,value])=><div key={label}><b>{label}</b><span>{value}</span></div>)}</div><div className="floorplan"><span className={c.danger?"danger":""}/></div></section><section className="system-facts panel"><h2>5. Факты и эффект</h2><div>{c.facts.map(([label,value],i)=>{const Icons=[ShieldCheck,Clock3,FileText];const I=Icons[i];return <article key={label}><IconBox icon={I}/><span><small>{label}</small><strong>{value}</strong></span></article>})}</div></section></div><nav className="system-bottom-nav">{SYSTEMS.filter(s=>s.slug!==active).map(s=><ArrowLink href={`/systems/${s.slug}`} key={s.slug}><IconBox icon={s.icon} danger={s.slug==="fire"}/><span><strong>{s.name}</strong><small>{s.short}</small></span></ArrowLink>)}</nav></main>;
}
