"use client";

import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { LiveDemo } from "@/components/site/live-demo";
import { BeforeAfter } from "@/components/site/before-after";
import { Benefits } from "@/components/site/benefits";
import { Services } from "@/components/site/services";
import { Cta } from "@/components/site/cta";
import { useI18n } from "@/modules/i18n";

export default function Home() {
  const { t } = useI18n();
  return (
    <main>
      <Header />
      <Hero />
      <LiveDemo />
      <BeforeAfter />
      <Benefits />
      <Services />
      <Cta />
      <footer className="border-t border-[var(--line)] py-8">
        <div className="site-shell flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[var(--muted)]">
          <span>{t("footer.note")}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
