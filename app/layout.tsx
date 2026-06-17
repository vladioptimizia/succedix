import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Succedix — Inteligência de Sucessão Empresarial",
  description: "Conectamos proprietários suíços e compradores certos. Sem intermediários.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Header />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
