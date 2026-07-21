import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/modules/i18n";

export const metadata: Metadata = {
  title: "Buyursin Technics — Smart Building",
  description: "Интерактивная презентация автоматизации инженерных систем здания.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
