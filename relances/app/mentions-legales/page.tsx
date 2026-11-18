import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, v } from "@/lib/legal";

export const metadata: Metadata = { title: `Mentions légales — ${LEGAL.serviceName}` };

export default function MentionsLegales() {
  return (
    <main className="legal">
      <p><Link href="/">← {LEGAL.serviceName}</Link></p>
      <h1>Mentions légales</h1>
      <p className="muted small">Dernière mise à jour : {LEGAL.lastUpdate}</p>

      <h2>Éditeur du site</h2>
      <p>
        Le site {LEGAL.siteUrl} et le service {LEGAL.serviceName} sont édités par :<br />
        <strong>{v(LEGAL.editorName)}</strong><br />
        {v(LEGAL.editorStatus)}<br />
        Adresse : {v(LEGAL.editorAddress)}<br />
        SIRET : {v(LEGAL.editorSiret)}<br />
        {LEGAL.editorVat ? <>N° de TVA intracommunautaire : {LEGAL.editorVat}<br /></> : null}
        Contact : {LEGAL.contactEmail ? <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> : v("")}
      </p>
      <p>Directeur de la publication : {v(LEGAL.publicationDirector)}</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par {LEGAL.host.name}, {LEGAL.host.address} —{" "}
        <a href={LEGAL.host.website} rel="noopener">{LEGAL.host.website}</a>.
      </p>
      <p>
        Les données des comptes et des factures sont stockées dans une base de données gérée par Supabase, hébergée dans
        la région : {LEGAL.databaseRegion}.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site (textes, interface, code, marque {LEGAL.serviceName}) est protégé par le droit
        de la propriété intellectuelle. Toute reproduction ou réutilisation sans autorisation préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans la{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise que des cookies strictement nécessaires à son fonctionnement (maintien de la connexion à
        votre compte). Aucun cookie publicitaire ni de mesure d&apos;audience n&apos;est déposé.
      </p>
    </main>
  );
}
