import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, v } from "@/lib/legal";

export const metadata: Metadata = { title: `Politique de confidentialité — ${LEGAL.serviceName}` };

const contact = LEGAL.contactEmail
  ? <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
  : <>{v("")}</>;

export default function Confidentialite() {
  return (
    <main className="legal">
      <p><Link href="/">← {LEGAL.serviceName}</Link></p>
      <h1>Politique de confidentialité</h1>
      <p className="muted small">Dernière mise à jour : {LEGAL.lastUpdate}</p>

      <p>
        Cette page explique quelles données personnelles {LEGAL.serviceName} traite, pourquoi, combien de temps, et
        quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD).
      </p>

      <h2>1. Qui est responsable ?</h2>
      <p>
        <strong>Pour les données de votre compte</strong> (votre e-mail, vos paramètres), le responsable du traitement
        est {v(LEGAL.editorName)}, éditeur de {LEGAL.serviceName} (coordonnées dans les{" "}
        <Link href="/mentions-legales">mentions légales</Link>). Contact : {contact}.
      </p>
      <p>
        <strong>Pour les données de vos clients</strong> que vous saisissez ou importez (nom, e-mail, factures), c&apos;est{" "}
        <strong>vous, utilisateur, qui êtes responsable du traitement</strong> : vous décidez de relancer vos clients.{" "}
        {LEGAL.serviceName} agit comme <strong>sous-traitant</strong> (article 28 du RGPD) : ces données ne sont
        utilisées que pour exécuter le service à votre demande (stockage, envoi des relances, page de paiement), jamais à
        d&apos;autres fins.
      </p>

      <h2>2. Quelles données ?</h2>
      <table className="legal-table">
        <thead><tr><th>Données</th><th>Pourquoi</th><th>Base légale</th></tr></thead>
        <tbody>
          <tr>
            <td>Votre adresse e-mail et votre mot de passe (stocké sous forme chiffrée, illisible)</td>
            <td>Créer et sécuriser votre compte</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Nom de votre entreprise, IBAN</td>
            <td>Signer les relances et permettre à vos clients de vous payer</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Factures et données de vos clients : numéro, nom, e-mail, montant, échéance, historique des relances</td>
            <td>Envoyer les relances et afficher votre tableau de bord</td>
            <td>Exécution du contrat (traitement pour votre compte)</td>
          </tr>
          <tr>
            <td>Fichiers importés (Excel, CSV, PDF)</td>
            <td>Lire les factures à importer. Les fichiers ne sont pas conservés après la lecture.</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Données techniques (journaux de connexion, adresse IP)</td>
            <td>Sécurité du service et résolution des incidents</td>
            <td>Intérêt légitime</td>
          </tr>
        </tbody>
      </table>
      <p>Aucune donnée n&apos;est vendue, louée ni utilisée à des fins publicitaires.</p>

      <h2>3. Qui reçoit ces données ?</h2>
      <p>Seuls des prestataires techniques indispensables au service, qui agissent sur nos instructions :</p>
      <table className="legal-table">
        <thead><tr><th>Prestataire</th><th>Rôle</th><th>Localisation</th></tr></thead>
        <tbody>
          <tr><td>Supabase</td><td>Base de données et authentification</td><td>{LEGAL.databaseRegion}</td></tr>
          <tr><td>Vercel</td><td>Hébergement du site</td><td>États-Unis / réseau mondial</td></tr>
          <tr><td>Resend</td><td>Envoi des e-mails de relance</td><td>États-Unis</td></tr>
          <tr><td>Stripe</td><td>Paiement des abonnements (vos données de carte bancaire ne passent jamais par nos serveurs)</td><td>Irlande / États-Unis</td></tr>
          <tr><td>Anthropic</td><td>Lecture des factures PDF (uniquement si vous utilisez l&apos;import PDF)</td><td>États-Unis</td></tr>
        </tbody>
      </table>
      <p>
        Lorsque des données sont transférées hors de l&apos;Union européenne, ce transfert est encadré par le cadre de
        protection des données UE–États-Unis (Data Privacy Framework) ou par les clauses contractuelles types de la
        Commission européenne, selon le prestataire.
      </p>

      <h2>4. Combien de temps ?</h2>
      <ul>
        <li>Données du compte et factures : tant que votre compte est actif.</li>
        <li>Après suppression du compte : effacement sous 30 jours, sauf obligation légale de conservation.</li>
        <li>Journaux techniques : 12 mois maximum.</li>
      </ul>

      <h2>5. Sécurité</h2>
      <p>
        Les échanges sont chiffrés (HTTPS). Chaque compte est strictement cloisonné : un utilisateur ne peut accéder
        qu&apos;à ses propres données. Les pages de paiement envoyées à vos clients utilisent un lien secret propre à
        chaque facture et n&apos;affichent que les informations nécessaires au paiement.
      </p>

      <h2>6. Vos droits</h2>
      <p>
        Vous pouvez à tout moment demander l&apos;accès à vos données, leur rectification, leur effacement, leur
        portabilité, la limitation du traitement ou vous y opposer, en écrivant à {contact}. Nous répondons sous un mois.
      </p>
      <p>
        <strong>Vous êtes un client relancé via {LEGAL.serviceName} ?</strong> Vos données ont été saisies par
        l&apos;entreprise qui vous a facturé, qui est responsable de leur traitement : adressez-vous d&apos;abord à elle.
        Vous pouvez aussi nous écrire, nous transmettrons votre demande.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL :{" "}
        <a href="https://www.cnil.fr/fr/plaintes" rel="noopener">www.cnil.fr/fr/plaintes</a>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        {LEGAL.serviceName} n&apos;utilise que des cookies strictement nécessaires (maintien de votre connexion). Ils ne
        nécessitent pas votre consentement. Aucun cookie publicitaire ni de mesure d&apos;audience n&apos;est utilisé.
      </p>
    </main>
  );
}
