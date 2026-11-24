import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { LEGAL, v } from "@/lib/legal";

export const metadata: Metadata = { title: `Conditions générales de vente — ${BRAND.name}` };

export default function CGV() {
  const S = BRAND.name;
  return (
    <main className="legal">
      <p><Link href="/">← {S}</Link></p>
      <h1>Conditions générales de vente</h1>
      <p className="muted small">Dernière mise à jour : {LEGAL.lastUpdate}</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent l&apos;utilisation du service en ligne {S}, édité par {v(LEGAL.editorName)}{" "}
        (ci-après « l&apos;Éditeur », coordonnées dans les <Link href="/mentions-legales">mentions légales</Link>), par
        toute personne qui crée un compte (ci-après « le Client »). La création d&apos;un compte vaut acceptation des
        présentes conditions.
      </p>
      <p>
        <strong>Le service est réservé aux professionnels</strong> (entreprises, artisans, indépendants, associations)
        agissant dans le cadre de leur activité. Le droit de rétractation de 14 jours, réservé aux consommateurs, ne
        s&apos;applique donc pas ; la version gratuite permet de tester le service avant tout paiement.
      </p>

      <h2>2. Description du service</h2>
      <p>
        {S} permet au Client d&apos;enregistrer ses factures et d&apos;envoyer automatiquement des e-mails de relance à ses
        propres clients en cas de retard de paiement, selon un calendrier prédéfini (J+1, J+7, J+15 après
        l&apos;échéance), avec une page de paiement par facture. Le service comprend un tableau de bord, l&apos;import de
        factures et les fonctionnalités décrites sur le site au moment de la souscription.
      </p>
      <p>
        {S} est un outil d&apos;aide à la relance : <strong>l&apos;Éditeur ne garantit pas le recouvrement</strong> des
        sommes dues et n&apos;agit pas en qualité de société de recouvrement ni de conseil juridique.
      </p>

      <h2>3. Version gratuite et formule Pro</h2>
      <p>
        Chaque compte peut utiliser gratuitement le service, sans carte bancaire et sans limite de durée, pour suivre
        jusqu&apos;à {BRAND.freeInvoices} factures en cours (non payées) en même temps. La formule Pro, payante, permet de
        suivre un nombre illimité de factures et donne accès à l&apos;ensemble des fonctionnalités. L&apos;Éditeur peut faire
        évoluer le contenu de la version gratuite en prévenant les Clients au moins 30 jours à l&apos;avance.
      </p>

      <h2>4. Prix et paiement</h2>
      <p>
        La formule Pro est facturée <strong>{BRAND.price} € HT par mois</strong>. {v(LEGAL.vatMention)}. Le prix en vigueur
        est celui affiché sur le site au moment de la souscription.
      </p>
      <p>
        Le paiement s&apos;effectue par carte bancaire, mensuellement et d&apos;avance, via le prestataire de paiement
        sécurisé Stripe. L&apos;Éditeur n&apos;a jamais accès aux numéros de carte. Une facture est mise à disposition du
        Client à chaque échéance dans son espace de facturation.
      </p>
      <p>
        En cas d&apos;échec de paiement, de nouvelles tentatives sont effectuées pendant quelques jours ; à défaut de
        régularisation, l&apos;abonnement est suspendu.
      </p>
      <p>
        L&apos;Éditeur peut modifier ses prix en prévenant le Client par e-mail au moins 30 jours à l&apos;avance. Le
        nouveau prix s&apos;applique à la période suivante ; le Client peut résilier avant cette date s&apos;il le refuse.
      </p>

      <h2>5. Durée et résiliation</h2>
      <p>
        L&apos;abonnement est <strong>sans engagement</strong> : il est conclu pour un mois et se renouvelle
        automatiquement chaque mois. Le Client peut le résilier à tout moment depuis la page « Mon compte » ; la
        résiliation prend effet à la fin de la période mensuelle en cours, déjà payée, sans remboursement au prorata.
      </p>
      <p>
        L&apos;Éditeur peut suspendre ou résilier le compte d&apos;un Client en cas de manquement grave aux présentes
        conditions (notamment usage abusif ou illicite décrit à l&apos;article 6), après mise en demeure restée sans effet
        pendant 8 jours, ou immédiatement en cas d&apos;urgence ou d&apos;atteinte aux droits de tiers.
      </p>
      <p>
        Le Client peut supprimer son compte et toutes ses données à tout moment depuis la page « Mon compte ».
      </p>

      <h2>6. Obligations du Client</h2>
      <ul>
        <li>Ne relancer que des créances réelles, certaines et exigibles, et des personnes qui sont bien ses clients.</li>
        <li>Fournir des informations exactes (factures, coordonnées, IBAN) et les tenir à jour.</li>
        <li>Respecter la réglementation applicable, notamment en matière de protection des données et de recouvrement.</li>
        <li>Ne pas utiliser le service pour envoyer des messages abusifs, trompeurs, menaçants ou non sollicités.</li>
        <li>Préserver la confidentialité de ses identifiants.</li>
      </ul>
      <p>Le Client est seul responsable du contenu des factures et des relances envoyées à ses clients.</p>

      <h2>7. Disponibilité</h2>
      <p>
        L&apos;Éditeur met en œuvre les moyens raisonnables pour assurer l&apos;accès au service 24 h/24, mais ne garantit
        pas une disponibilité sans interruption (maintenance, incident d&apos;un prestataire technique, force majeure).
        L&apos;envoi des e-mails dépend de services tiers ; l&apos;Éditeur ne garantit pas leur bonne réception par les
        destinataires.
      </p>

      <h2>8. Responsabilité</h2>
      <p>
        L&apos;Éditeur est tenu d&apos;une obligation de moyens. Sa responsabilité ne peut être engagée qu&apos;en cas de
        faute prouvée et est limitée aux dommages directs, dans la limite des sommes payées par le Client au cours des 12
        mois précédant le fait générateur. L&apos;Éditeur n&apos;est pas responsable des pertes indirectes (perte de chiffre
        d&apos;affaires, créances non recouvrées, atteinte à l&apos;image), ni des conséquences d&apos;informations
        inexactes fournies par le Client.
      </p>

      <h2>9. Données personnelles et sous-traitance</h2>
      <p>
        Le traitement des données du Client est décrit dans la <Link href="/confidentialite">politique de
        confidentialité</Link>.
      </p>
      <p>
        Pour les données des clients du Client (noms, e-mails, factures), le Client est responsable du traitement et
        l&apos;Éditeur agit en qualité de <strong>sous-traitant</strong> au sens de l&apos;article 28 du RGPD. À ce titre,
        l&apos;Éditeur s&apos;engage à :
      </p>
      <ul>
        <li>ne traiter ces données que pour fournir le service, sur instruction du Client ;</li>
        <li>garantir la confidentialité des données et mettre en œuvre des mesures de sécurité appropriées ;</li>
        <li>
          ne recourir qu&apos;aux sous-traitants ultérieurs listés dans la politique de confidentialité, et informer le
          Client de tout changement ;
        </li>
        <li>aider le Client à répondre aux demandes d&apos;exercice des droits des personnes concernées ;</li>
        <li>notifier au Client toute violation de données dans les meilleurs délais ;</li>
        <li>supprimer les données à la fin du contrat ou à la suppression du compte ;</li>
        <li>mettre à disposition les informations nécessaires pour démontrer le respect de ces obligations.</li>
      </ul>

      <h2>10. Propriété intellectuelle</h2>
      <p>
        Le service, son code, son interface et la marque {S} restent la propriété de l&apos;Éditeur. Le Client bénéficie
        d&apos;un droit d&apos;utilisation personnel et non transférable pendant la durée de son abonnement. Les données
        saisies par le Client restent sa propriété.
      </p>

      <h2>11. Modification des conditions</h2>
      <p>
        L&apos;Éditeur peut faire évoluer les présentes conditions. Le Client est informé par e-mail de toute modification
        importante au moins 30 jours avant son entrée en vigueur et peut résilier son abonnement s&apos;il la refuse.
      </p>

      <h2>12. Droit applicable et litiges</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de litige, les parties rechercheront d&apos;abord
        une solution amiable. À défaut, le litige sera porté devant {LEGAL.court || "[tribunal à compléter]"}.
      </p>
    </main>
  );
}
