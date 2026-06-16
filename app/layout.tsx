import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Succedix — Inteligência de Sucessão Empresarial",
  description:
    "Conectamos proprietários suíços e compradores certos. Sem intermediários.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
