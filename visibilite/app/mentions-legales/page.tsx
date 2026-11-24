import type { Metadata } from "next";
import { BRAND, LEGAL, v } from "@/lib/brand";
import { siteUrl } from "@/lib/site";
import { Header, Footer } from "../site-chrome";

export const metadata: Metadata = { title: `Mentions légales — ${BRAND.name}` };

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="wrap legal">
        <h1>Mentions légales</h1>
        <h2>Éditeur du site</h2>
        <p>
          {v(LEGAL.editorName)} — {v(LEGAL.editorStatus)}
          <br />
          Adresse : {v(LEGAL.editorAddress)}
          <br />
          SIRET : {v(LEGAL.editorSiret)}
          <br />
          Contact : <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
          <br />
          Directeur de la publication : {v(LEGAL.editorName)}
        </p>
        <h2>Hébergement</h2>
        <p>
          {LEGAL.host.name}, {LEGAL.host.address}.
        </p>
        <h2>Le service</h2>
        <p>
          {BRAND.name} ({siteUrl().replace(/^https?:\/\//, "")}) propose un test gratuit qui interroge un assistant d&apos;intelligence
          artificielle (ChatGPT, d&apos;OpenAI) avec la question qu&apos;un client pourrait poser, puis affiche les commerces qu&apos;il
          recommande. Les réponses des IA varient d&apos;une fois à l&apos;autre et ne reflètent ni un classement officiel, ni un avis de{" "}
          {BRAND.name}. Les noms de commerces affichés sont ceux cités par l&apos;IA. {BRAND.name} propose aussi des prestations
          (visibilité en ligne, création de site vitrine, gestion de réseaux sociaux), réalisées à distance après accord sur un devis.
        </p>
        <p className="fine">Dernière mise à jour : {LEGAL.lastUpdate}.</p>
      </main>
      <Footer />
    </>
  );
}
