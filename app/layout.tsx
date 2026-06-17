import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

export const metadata: Metadata = {
  title: "Succedix — Nachfolge-Intelligenz für Unternehmen",
  description: "Wir verbinden Schweizer Eigentümer mit den richtigen Nachfolgern. Ohne Zwischenhändler.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <LocaleProvider>
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
