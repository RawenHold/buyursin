import type { Metadata } from "next";
import { Geologica, Onest } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/modules/i18n";

const geologica = Geologica({
  subsets: ["cyrillic", "latin"],
  variable: "--font-geologica",
  display: "swap",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://btechnics.uz"),
  title: { default: "Buyursin Technics — автоматизация зданий", template: "%s | Buyursin Technics" },
  description: "BMS, АСКУЭ, автоматизация инженерных и слаботочных систем коммерческих зданий.",
  openGraph: {
    title: "Buyursin Technics",
    description: "Управляйте зданием. Снижайте потери.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geologica.variable} ${onest.variable}`}>
      <body><I18nProvider>{children}</I18nProvider></body>
    </html>
  );
}
