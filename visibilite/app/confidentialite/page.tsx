import type { Metadata } from "next";
import { BRAND, LEGAL, v } from "@/lib/brand";
import { Header, Footer } from "../site-chrome";

export const metadata: Metadata = { title: `Confidentialité — ${BRAND.name}` };

export default function Confidentialite() {
  return (
    <>
      <Header />
      <main className="wrap legal">
        <h1>Confidentialité</h1>
        <p>Responsable du traitement : {v(LEGAL.editorName)}, joignable à <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>.</p>
        <h2>Le test gratuit</h2>
        <p>
          Le nom du commerce, l&apos;activité et la ville que vous saisissez sont envoyés à OpenAI (ChatGPT) pour obtenir sa réponse, puis
          analysés. Nous ne créons pas de compte et ne gardons pas ces informations, sauf une copie temporaire de la réponse de l&apos;IA
          (24 heures au plus) pour ne pas refaire la même recherche. Votre adresse IP sert seulement, de façon temporaire, à limiter le
          nombre de tests.
        </p>
        <h2>La demande d&apos;audit</h2>
        <p>
          Si vous demandez l&apos;audit offert, nous enregistrons votre nom, votre téléphone et/ou votre e-mail, votre message et le résultat
          du test. Ils servent uniquement à vous recontacter pour l&apos;audit et, si vous le souhaitez, pour la prestation. Base légale : votre
          demande (mesures précontractuelles). Durée : 3 ans après notre dernier échange, puis suppression.
        </p>
        <h2>Sous-traitants</h2>
        <ul>
          <li>Vercel (hébergement du site)</li>
          <li>Supabase (base de données des demandes d&apos;audit)</li>
          <li>OpenAI (réponse de ChatGPT au test)</li>
          <li>Resend (e-mail de notification d&apos;une nouvelle demande)</li>
        </ul>
        <p>Certains de ces prestataires sont situés hors de l&apos;Union européenne ; les transferts sont encadrés par les clauses contractuelles types de la Commission européenne.</p>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant à{" "}
          <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>. Vous pouvez aussi saisir la CNIL (cnil.fr).
        </p>
        <p className="fine">Ce site n&apos;utilise pas de cookies publicitaires ni de mesure d&apos;audience. Dernière mise à jour : {LEGAL.lastUpdate}.</p>
      </main>
      <Footer />
    </>
  );
}
