import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { Header, Footer } from "../site-chrome";
import { LeadForm } from "../lead-form";

export const metadata: Metadata = {
  title: "Me contacter",
  alternates: { canonical: "/contact" },
  description: "Visibilité Google et ChatGPT, site vitrine, réseaux sociaux : parlons de votre commerce. Premier échange gratuit et sans engagement.",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function Contact({ searchParams }: Props) {
  const service = (await searchParams).service;
  const defaults = service && ["visibilite", "site", "reseaux"].includes(service) ? [service] : ["visibilite"];
  return (
    <>
      <Header />
      <main className="wrap narrow contact">
        <h1>Parlons de votre commerce</h1>
        <p className="lead">
          Dites-moi ce dont vous avez besoin. Je vous recontacte sous 48 h, par téléphone ou par e-mail, pour un premier échange gratuit
          et sans engagement.
        </p>
        <div className="card">
          <LeadForm defaultInterests={defaults} submitLabel="Envoyer" />
        </div>
        <p className="fine">
          Vous préférez écrire ? <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
        </p>
      </main>
      <Footer />
    </>
  );
}
