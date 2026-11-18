import { RATES, defaultPenaltyRate, minimumPenaltyRate, pct } from "./rates";

/**
 * Guides pratiques (référencement naturel). Contenu informatif, relu pour rester prudent sur le plan juridique :
 * ce ne sont pas des conseils juridiques personnalisés.
 */
export type Block =
  | { p: string }
  | { h: string }
  | { list: string[] }
  | { steps: { title: string; text: string }[] }
  | { tip: string }
  | { tool: { href: string; label: string } };

export type Guide = {
  slug: string;
  title: string; // titre affiché (h1)
  seoTitle: string; // balise <title>
  description: string; // meta description
  intro: string;
  readMinutes: number;
  updated: string; // AAAA-MM-JJ
  blocks: Block[];
};

const UPDATED = "2026-11-18";

export const GUIDES: Guide[] = [
  {
    slug: "relancer-client-qui-ne-paie-pas",
    title: "Comment relancer un client qui ne paie pas (sans le fâcher)",
    seoTitle: "Relancer un client qui ne paie pas : la méthode en 4 étapes",
    description:
      "Rappel courtois, relance ferme, mise en demeure : la méthode simple pour se faire payer une facture en retard tout en gardant une bonne relation client. Modèles gratuits inclus.",
    intro:
      "Une facture en retard est rarement de la mauvaise foi : la plupart du temps, c'est un oubli ou un problème de trésorerie. Bien relancer, c'est être payé plus vite sans abîmer la relation.",
    readMinutes: 4,
    updated: UPDATED,
    blocks: [
      { h: "Avant de relancer : vérifiez votre facture" },
      {
        list: [
          "La date d'échéance est-elle bien indiquée ? Sans elle, il est difficile de parler de retard.",
          "Le client a-t-il bien reçu la facture, à la bonne adresse e-mail ou au bon service comptable ?",
          "Le travail est-il terminé et sans réserve ? Un litige en cours bloque souvent le paiement.",
        ],
      },
      { h: "Les 4 étapes d'une relance efficace" },
      {
        steps: [
          {
            title: "Le lendemain de l'échéance : un rappel courtois",
            text: "Un e-mail court et poli, qui laisse au client le bénéfice du doute : « Sauf erreur de notre part, la facture n'a pas encore été réglée. Si le paiement est déjà parti, ne tenez pas compte de ce message. » Ajoutez vos coordonnées bancaires pour qu'il puisse payer tout de suite.",
          },
          {
            title: "Une semaine plus tard : une relance ferme",
            text: "Le ton devient plus direct, avec un délai précis (par exemple 8 jours). Entre professionnels, rappelez que les pénalités de retard et l'indemnité forfaitaire de 40 € sont dues. Un coup de téléphone à ce moment-là débloque souvent la situation.",
          },
          {
            title: "Deux semaines plus tard : le dernier avis",
            text: "Prévenez que, sans paiement, vous engagerez une procédure de recouvrement. Restez factuel : montant, numéro de facture, date d'échéance, nouveau délai.",
          },
          {
            title: "Si rien ne bouge : la mise en demeure",
            text: "Un courrier recommandé avec accusé de réception, qui fixe un dernier délai. Il fait courir les intérêts et il est indispensable avant de saisir le tribunal (injonction de payer).",
          },
        ],
      },
      { tool: { href: "/outils/lettre-relance", label: "Générer une lettre de relance gratuite" } },
      { h: "Le bon ton : ferme sur le fond, poli sur la forme" },
      {
        list: [
          "Restez factuel : numéro de facture, montant, date d'échéance. Pas de reproche.",
          "Montez le ton progressivement : un premier message agressif braque le client.",
          "Facilitez le paiement : IBAN, lien de paiement, référence à indiquer.",
          "Notez chaque relance (date, moyen, réponse) : c'est utile si vous allez plus loin.",
        ],
      },
      {
        tip: "Le plus difficile n'est pas d'écrire la relance, c'est d'y penser au bon moment. Automatiser le rappel du lendemain, puis la relance de la semaine suivante, suffit souvent à récupérer la plupart des factures.",
      },
    ],
  },
  {
    slug: "facture-impayee-que-faire",
    title: "Facture impayée : que faire ? Les étapes jusqu'à l'injonction de payer",
    seoTitle: "Facture impayée : que faire ? Relance, mise en demeure, injonction de payer",
    description:
      "Votre client ne paie pas sa facture ? Les étapes dans l'ordre : relances amiables, mise en demeure, injonction de payer, commissaire de justice. Délais de prescription et pièges à éviter.",
    intro:
      "Une facture impayée se traite par étapes : on commence à l'amiable, on formalise avec une mise en demeure, et seulement ensuite on passe par la justice. Voici le parcours, dans l'ordre.",
    readMinutes: 5,
    updated: UPDATED,
    blocks: [
      { h: "1. Les relances amiables" },
      {
        p: "Rappel courtois le lendemain de l'échéance, relance ferme une semaine plus tard, puis dernier avis. Un appel téléphonique en parallèle est souvent ce qui débloque la situation. La majorité des retards se règlent à ce stade.",
      },
      { h: "2. La mise en demeure" },
      {
        p: "C'est le courrier officiel qui exige le paiement dans un délai précis (souvent 8 à 15 jours). Envoyez-le en recommandé avec accusé de réception : c'est la preuve que vous avez réclamé votre argent. Elle fait courir les intérêts de retard et elle est demandée avant toute procédure.",
      },
      { tool: { href: "/outils/mise-en-demeure", label: "Rédiger une mise en demeure gratuite" } },
      { h: "3. L'injonction de payer" },
      {
        p: "C'est une procédure judiciaire simple, rapide et peu coûteuse, sans audience et sans avocat obligatoire. Vous déposez une requête avec vos pièces (facture, bon de commande ou devis signé, relances, mise en demeure) :",
      },
      {
        list: [
          "au tribunal de commerce si votre client est un commerçant ou une société commerciale ;",
          "au tribunal judiciaire dans les autres cas (particulier, profession libérale, association…).",
        ],
      },
      {
        p: "Si le juge accepte, il rend une ordonnance que vous faites signifier au débiteur par un commissaire de justice. Sans opposition du client dans le délai prévu, elle devient exécutoire.",
      },
      { h: "4. Le recouvrement forcé" },
      {
        p: "Avec un titre exécutoire, un commissaire de justice (anciennement huissier) peut procéder à des saisies. Ses frais peuvent, en grande partie, être mis à la charge du débiteur.",
      },
      { h: "Attention aux délais de prescription" },
      {
        list: [
          "Entre professionnels : en principe 5 ans pour agir (article L110-4 du Code de commerce).",
          "Facture à un particulier pour un bien ou un service : en principe 2 ans (article L218-2 du Code de la consommation).",
        ],
      },
      {
        tip: "Plus vous relancez tôt, plus vous avez de chances d'être payé. Une facture qui dort plusieurs mois devient beaucoup plus difficile à recouvrer.",
      },
    ],
  },
  {
    slug: "retenue-de-garantie-recuperer",
    title: "Retenue de garantie : comment récupérer vos 5 %",
    seoTitle: "Retenue de garantie : délai d'un an, libération et comment la récupérer",
    description:
      "Retenue de garantie de 5 % sur vos chantiers : quand elle doit être libérée, ce que peut faire le client, et comment la réclamer en pratique. Calculateur et modèle de lettre gratuits.",
    intro:
      "Sur de nombreux chantiers, le client garde jusqu'à 5 % du montant des travaux pendant un an. Cet argent vous revient… mais il faut souvent le réclamer. Beaucoup d'artisans l'oublient.",
    readMinutes: 4,
    updated: UPDATED,
    blocks: [
      { h: "À quoi sert la retenue de garantie ?" },
      {
        p: "Prévue par la loi n° 71-584 du 16 juillet 1971, elle garantit que les réserves faites à la réception des travaux seront levées. Elle est plafonnée à 5 % du montant des travaux.",
      },
      { h: "Quand doit-elle être libérée ?" },
      {
        p: "Un an après la réception des travaux, qu'elle ait été prononcée avec ou sans réserves, la retenue doit vous être versée, même sans mainlevée. Seule exception : si le client vous a notifié avant cette date, par lettre recommandée, une opposition motivée (par exemple des réserves non levées).",
      },
      { tool: { href: "/outils/retenue-de-garantie", label: "Calculer la date de libération" } },
      { h: "Comment la récupérer en pratique" },
      {
        steps: [
          { title: "Notez la date de réception", text: "C'est elle qui fait courir le délai d'un an. Gardez le procès-verbal de réception." },
          { title: "Levez les réserves", text: "Si des réserves ont été émises, réglez-les et gardez-en la trace : c'est le motif d'opposition le plus courant." },
          { title: "Réclamez-la à l'échéance", text: "Envoyez une demande de restitution au client dès la date anniversaire, en rappelant la loi de 1971 et en joignant vos coordonnées bancaires." },
          { title: "Relancez si besoin", text: "Sans réponse, traitez-la comme une facture impayée : relance, mise en demeure, puis injonction de payer." },
        ],
      },
      { h: "Et si vous avez fourni une caution bancaire ?" },
      {
        p: "La retenue peut être remplacée par une caution d'une banque. Dans ce cas, à l'échéance, la caution est libérée : demandez la mainlevée au client pour ne plus payer de frais à votre banque.",
      },
      {
        tip: "Le vrai problème, c'est d'y penser un an après. Notez chaque retenue avec sa date de réception dès la fin du chantier, et programmez un rappel.",
      },
    ],
  },
  {
    slug: "penalites-de-retard-calcul",
    title: "Pénalités de retard : comment les calculer et les réclamer",
    seoTitle: `Pénalités de retard de paiement : taux ${pct(defaultPenaltyRate())}, calcul et indemnité de 40 €`,
    description: `Entre professionnels, une facture payée en retard donne droit à des pénalités (taux légal de ${pct(defaultPenaltyRate())} au ${RATES.period}) et à une indemnité de 40 €. Calcul, mentions obligatoires et exemple.`,
    intro:
      "Entre professionnels, tout retard de paiement entraîne automatiquement des pénalités et une indemnité forfaitaire. Peu d'entreprises les réclament, alors que c'est un vrai levier pour être payé.",
    readMinutes: 4,
    updated: UPDATED,
    blocks: [
      { h: "Ce que dit la loi" },
      {
        p: `L'article L441-10 du Code de commerce prévoit des pénalités de retard dues de plein droit, sans rappel préalable. Leur taux est celui de vos conditions générales de vente. À défaut, c'est le taux de refinancement de la BCE majoré de 10 points, soit ${pct(defaultPenaltyRate())} pour le ${RATES.period}. Il ne peut jamais être inférieur à trois fois le taux d'intérêt légal, soit ${pct(minimumPenaltyRate())}.`,
      },
      {
        p: `S'y ajoute une indemnité forfaitaire de ${RATES.recoveryFee} € pour frais de recouvrement, par facture payée en retard (article D441-5).`,
      },
      { h: "Comment les calculer" },
      { p: "Pénalités = montant TTC de la facture × taux annuel × nombre de jours de retard ÷ 365." },
      {
        p: `Exemple : une facture de 1 250 € payée avec 48 jours de retard, au taux de ${pct(defaultPenaltyRate())}, donne environ 20,38 € de pénalités, plus 40 € d'indemnité.`,
      },
      { tool: { href: "/outils/calcul-penalites", label: "Calculer vos pénalités de retard" } },
      { h: "Les mentions obligatoires sur vos factures" },
      {
        list: [
          "La date d'échéance du paiement.",
          "Le taux des pénalités de retard.",
          `La mention de l'indemnité forfaitaire de ${RATES.recoveryFee} € pour frais de recouvrement.`,
        ],
      },
      { h: "Et pour un client particulier ?" },
      {
        p: "Les pénalités de l'article L441-10 et l'indemnité de 40 € ne s'appliquent pas. Vous pouvez en revanche réclamer des intérêts au taux légal à compter d'une mise en demeure.",
      },
      {
        tip: "Rappeler les pénalités dans votre relance ferme suffit souvent à faire payer : le client comprend que le retard a un coût.",
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
