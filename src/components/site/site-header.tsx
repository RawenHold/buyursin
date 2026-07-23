"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/shared/brand";
import { CONTACTS, copyFor } from "@/content/site";
import { useI18n, type Locale } from "@/modules/i18n";

const linkPaths = ["/solutions", "/systems", "/projects", "/services", "/company", "/contacts"] as const;
const systemSlugs = ["energy", "climate", "leak", "access", "fire"] as const;

const headerLabels = {
  ru: { links: ["Решения", "Системы", "Проекты", "Сервисы", "О компании", "Контакты"], consultation: "Получить консультацию", open: "Открыть меню", close: "Закрыть меню", nav: "Основная навигация", mobile: "Мобильная навигация" },
  uz: { links: ["Yechimlar", "Tizimlar", "Loyihalar", "Xizmatlar", "Kompaniya", "Aloqa"], consultation: "Maslahat olish", open: "Menyuni ochish", close: "Menyuni yopish", nav: "Asosiy navigatsiya", mobile: "Mobil navigatsiya" },
} as const;

function LanguageSwitch({ locale, onSelect, mobile = false }: { locale: Locale; onSelect: (locale: Locale) => void; mobile?: boolean }) {
  return <div className={`language-switch ${mobile ? "language-switch-mobile" : ""}`} role="group" aria-label={locale === "ru" ? "Выбор языка" : "Tilni tanlash"}>
    {(["ru", "uz"] as const).map(code => <button type="button" key={code} className={locale === code ? "active" : ""} onClick={() => onSelect(code)} aria-pressed={locale === code} aria-label={code === "ru" ? "Русский" : "O‘zbekcha"} title={code === "ru" ? "Русский" : "O‘zbekcha"}>
      <Image src={`/assets/lang-${code}.svg`} alt="" width={22} height={16} />
    </button>)}
  </div>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useI18n();
  const labels = headerLabels[locale];
  const scenarioTabs = copyFor(locale).scenario.tabs;
  const systems = systemSlugs.map(slug => [slug, scenarioTabs[slug]] as const);
  const isHome = pathname === "/" || pathname === "/solutions";
  const sectionHref = (href: typeof linkPaths[number]) => {
    if (href === "/services") return "/systems/energy";
    return isHome ? `#${href.slice(1)}` : href;
  };

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label={labels.nav}>
          {linkPaths.map((href, index) => {
            const label = labels.links[index];
            const active = href === "/solutions" ? pathname === "/" || pathname === href : pathname.startsWith(href);
            const target = sectionHref(href);
            return href === "/systems" ? (
              <div className="nav-dropdown" key={href}>
                <Link href={target} className={`nav-link ${active ? "is-active" : ""}`}>{label}<ChevronDown size={15} /></Link>
                <div className="nav-dropdown-panel">
                  {systems.map(([slug, name]) => <Link key={slug} href={`/systems/${slug}`}>{name}</Link>)}
                </div>
              </div>
            ) : <Link key={href} href={target} className={`nav-link ${active ? "is-active" : ""}`}>{label}</Link>;
          })}
        </nav>
        <div className="header-actions">
          <a href={CONTACTS.phoneHref} className="header-phone"><Phone size={17} />{CONTACTS.phoneDisplay}</a>
          <LanguageSwitch locale={locale} onSelect={setLocale} />
          <Link href={isHome ? "#contacts" : "/contacts#lead"} className="button-primary" data-label={labels.consultation}><span className="button-label">{labels.consultation}</span></Link>
        </div>
        <button type="button" className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? labels.close : labels.open} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          <nav className="site-shell" aria-label={labels.mobile}>
            <LanguageSwitch locale={locale} mobile onSelect={next => { setLocale(next); setOpen(false); }} />
            {linkPaths.map((href, index) => <Link key={href} href={sectionHref(href)} onClick={() => setOpen(false)}>{labels.links[index]}</Link>)}
            <div className="mobile-system-links">{systems.map(([slug, name]) => <Link key={slug} href={`/systems/${slug}`} onClick={() => setOpen(false)}>{name}</Link>)}</div>
            <a href={CONTACTS.phoneHref} className="button-secondary" data-label={CONTACTS.phoneDisplay}><span className="button-label"><Phone size={17} />{CONTACTS.phoneDisplay}</span></a>
            <Link href={isHome ? "#contacts" : "/contacts#lead"} className="button-primary" data-label={labels.consultation} onClick={() => setOpen(false)}><span className="button-label">{labels.consultation}</span></Link>
          </nav>
        </div>
      )}
    </header>
  );
}
