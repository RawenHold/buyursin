"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Presentation } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { CONTACTS, copyFor } from "@/content/site";
import { useI18n } from "@/modules/i18n";

export function SiteFooter() {
  const { locale } = useI18n();
  const c = copyFor(locale);
  return (
    <footer className="border-t border-[#e4e7ec] bg-[#f8fafc]">
      <div className="site-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-md text-sm leading-6 text-[#667085]">{c.footer.text}</p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[.12em] text-[#98a2b3]">Navigation</div>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-[#475467]">
            <Link href="/solutions">{c.nav.solutions}</Link>
            <Link href="/projects">{c.nav.projects}</Link>
            <Link href="/company">{c.nav.company}</Link>
            <Link href="/calculator">{c.nav.calculator}</Link>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[.12em] text-[#98a2b3]">Contacts</div>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-[#344054]">
            <a href={CONTACTS.phoneHref} className="inline-flex items-center gap-2 hover:text-[#1769ff]"><Phone className="h-4 w-4" />{CONTACTS.phoneDisplay}</a>
            <a href={CONTACTS.emailHref} className="inline-flex items-center gap-2 hover:text-[#1769ff]"><Mail className="h-4 w-4" />{CONTACTS.email}</a>
            <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#1769ff]">Telegram <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e4e7ec]">
        <div className="site-shell flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-[#98a2b3]">
          <span>© {new Date().getFullYear()} Buyursin Technics</span>
          <Link href="/proposal" className="button-primary min-h-11 px-4" data-label={c.footer.internal} aria-label={c.footer.internal}>
            <span className="button-label"><Presentation aria-hidden="true" className="h-4 w-4" />{c.footer.internal}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
