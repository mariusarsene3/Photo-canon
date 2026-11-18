import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relances — factures payées, sans y penser",
  description: "Relance automatiquement vos factures impayées.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
