"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/shared/brand";
import { CONTACTS } from "@/content/site";

const links = [
  ["/solutions", "Решения"],
  ["/systems", "Системы"],
  ["/projects", "Проекты"],
  ["/services", "Сервисы"],
  ["/company", "О компании"],
  ["/contacts", "Контакты"],
] as const;

const systems = [
  ["energy", "Энергия"], ["climate", "Климат"], ["leak", "Протечка"], ["access", "Доступ"], ["fire", "Пожар"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/" || pathname === "/solutions";
  const sectionHref = (href: typeof links[number][0]) => isHome ? `#${href.slice(1)}` : href;

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map(([href, label]) => {
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
          <Link href={isHome ? "#contacts" : "/contacts#lead"} className="button-primary">Получить консультацию</Link>
        </div>
        <button type="button" className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          <nav className="site-shell" aria-label="Мобильная навигация">
            {links.map(([href, label]) => <Link key={href} href={sectionHref(href)} onClick={() => setOpen(false)}>{label}</Link>)}
            <div className="mobile-system-links">{systems.map(([slug, name]) => <Link key={slug} href={`/systems/${slug}`} onClick={() => setOpen(false)}>{name}</Link>)}</div>
            <a href={CONTACTS.phoneHref} className="button-secondary"><Phone size={17} />{CONTACTS.phoneDisplay}</a>
            <Link href={isHome ? "#contacts" : "/contacts#lead"} className="button-primary" onClick={() => setOpen(false)}>Получить консультацию</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
