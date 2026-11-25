import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { Header, Footer } from "../site-chrome";
import { GuideLinks } from "../blocks";

export const metadata: Metadata = {
  title: "Guides pratiques : être trouvé sur Google et ChatGPT",
  alternates: { canonical: "/guides" },
  description: "Des guides simples pour les commerçants : apparaître dans ChatGPT, compléter sa fiche Google, obtenir des avis clients.",
};

export default function Guides() {
  return (
    <>
      <Header />
      <main>
        <GuideLinks asPage />
      </main>
      <Footer />
    </>
  );
}
