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
const UPDATED_2 = "2026-11-24";

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
  {
    slug: "lettre-relance-facture-impayee-modele",
    title: "Lettre de relance pour facture impayée : 3 modèles gratuits",
    seoTitle: "Lettre de relance facture impayée : 3 modèles gratuits (rappel, relance, dernier avis)",
    description:
      "Trois modèles de lettre de relance prêts à copier : rappel courtois, relance ferme et dernier avis avant mise en demeure. Avec les mentions à ne pas oublier.",
    intro:
      "Une bonne relance est courte, polie et précise. Voici trois modèles, du plus doux au plus ferme, à adapter selon le retard de votre client.",
    readMinutes: 5,
    updated: UPDATED_2,
    blocks: [
      { h: "Les informations à toujours indiquer" },
      {
        list: [
          "Le numéro de la facture et sa date.",
          "Le montant dû (TTC) et la date d'échéance dépassée.",
          "Un délai clair pour payer (par exemple 8 jours).",
          "Le moyen de payer : IBAN, lien de paiement, référence à rappeler.",
        ],
      },
      { h: "Modèle 1 : le rappel courtois (le lendemain de l'échéance)" },
      {
        p: "« Bonjour, sauf erreur de notre part, la facture n° [numéro] du [date], d'un montant de [montant] €, arrivée à échéance le [date], n'a pas encore été réglée. S'il s'agit d'un oubli, merci de procéder au règlement dès que possible. Si le paiement est déjà parti, ne tenez pas compte de ce message. Cordialement, [votre entreprise]. »",
      },
      { h: "Modèle 2 : la relance ferme (une semaine après)" },
      {
        p: "« Bonjour, malgré notre précédent rappel, la facture n° [numéro] ([montant] €, échue le [date]) reste impayée à ce jour. Nous vous remercions de régulariser la situation sous 8 jours, ou de nous contacter si vous rencontrez une difficulté. Nous vous rappelons qu'entre professionnels, tout retard entraîne des pénalités de retard et une indemnité forfaitaire de 40 € pour frais de recouvrement. »",
      },
      { h: "Modèle 3 : le dernier avis (deux semaines après)" },
      {
        p: "« Bonjour, la facture n° [numéro] ([montant] €, échue le [date]) demeure impayée malgré nos relances. Sans règlement de votre part sous 8 jours, nous serons contraints d'engager une procédure de recouvrement, en commençant par une mise en demeure. »",
      },
      { tool: { href: "/outils/lettre-relance", label: "Générer votre lettre de relance personnalisée" } },
      { h: "E-mail ou courrier ?" },
      {
        p: "Pour les deux premières relances, l'e-mail suffit : il est rapide et le client peut payer tout de suite. Gardez le courrier recommandé avec accusé de réception pour la mise en demeure, qui sert de preuve si vous allez plus loin.",
      },
      {
        tip: "Ne laissez pas passer de semaines entre deux relances : la régularité montre que vous suivez vos factures, et c'est souvent ce qui fait payer.",
      },
    ],
  },
  {
    slug: "mise-en-demeure-facture-impayee-modele",
    title: "Mise en demeure de payer une facture : modèle et mode d'emploi",
    seoTitle: "Mise en demeure facture impayée : modèle gratuit et mentions obligatoires",
    description:
      "Comment rédiger et envoyer une mise en demeure de payer une facture impayée : modèle gratuit, mentions à indiquer, délai à laisser et suites possibles.",
    intro:
      "La mise en demeure est la dernière étape avant la justice. Elle doit être claire, précise et envoyée de façon à garder une preuve.",
    readMinutes: 4,
    updated: UPDATED_2,
    blocks: [
      { h: "À quoi sert la mise en demeure ?" },
      {
        list: [
          "Elle constate officiellement le retard de paiement de votre client.",
          "Elle fait courir les intérêts de retard (article 1344-1 du Code civil).",
          "Elle est presque toujours demandée avant une injonction de payer.",
        ],
      },
      { h: "Ce qu'elle doit contenir" },
      {
        list: [
          "Le titre « Mise en demeure de payer ».",
          "Vos coordonnées et celles du client.",
          "Le numéro, la date et le montant de chaque facture impayée.",
          "Un délai précis pour payer, en général 8 à 15 jours.",
          "Les pénalités de retard et l'indemnité de 40 € si votre client est un professionnel.",
          "La mention des suites : procédure judiciaire en l'absence de paiement.",
        ],
      },
      { h: "Le modèle" },
      {
        p: "« Objet : mise en demeure de payer. Madame, Monsieur, malgré nos relances, la facture n° [numéro] du [date], d'un montant de [montant] € TTC, échue le [date], reste impayée. Par la présente, nous vous mettons en demeure de nous régler cette somme sous [8] jours à compter de la réception de ce courrier. À défaut, nous engagerons une procédure judiciaire de recouvrement, sans autre avis. [Entre professionnels : nous vous rappelons que des pénalités de retard et une indemnité forfaitaire de 40 € sont dues.] Veuillez agréer, Madame, Monsieur, nos salutations distinguées. »",
      },
      { tool: { href: "/outils/mise-en-demeure", label: "Rédiger votre mise en demeure en 2 minutes" } },
      { h: "Comment l'envoyer" },
      {
        p: "Par lettre recommandée avec accusé de réception, ou par recommandé électronique. Gardez une copie du courrier et l'accusé de réception : ce sont vos preuves.",
      },
      {
        tip: "Restez factuel et poli, même si vous êtes agacé : ce courrier pourra être lu par un juge.",
      },
    ],
  },
  {
    slug: "delai-de-paiement-entre-professionnels",
    title: "Délais de paiement entre professionnels : ce que dit la loi",
    seoTitle: "Délai de paiement facture entre professionnels : 30, 45 ou 60 jours ?",
    description:
      "Quel délai de paiement pour une facture entre professionnels ? 30 jours par défaut, 60 jours maximum ou 45 jours fin de mois : les règles, les pénalités et les mentions à indiquer.",
    intro:
      "Entre professionnels, on ne peut pas fixer n'importe quel délai de paiement. La loi encadre la durée maximale et prévoit des pénalités en cas de retard.",
    readMinutes: 4,
    updated: UPDATED_2,
    blocks: [
      { h: "Les règles de base (article L441-10 du Code de commerce)" },
      {
        list: [
          "Sans accord particulier : 30 jours après la réception des marchandises ou la fin de la prestation.",
          "Délai maximal convenu : 60 jours après la date d'émission de la facture.",
          "Ou, si c'est prévu au contrat : 45 jours fin de mois après la date d'émission de la facture.",
        ],
      },
      {
        p: "Certains secteurs ont des règles particulières (transport, produits alimentaires périssables…). Et pour les marchés publics, le délai est en principe de 30 jours, avec des intérêts moratoires dus automatiquement en cas de retard.",
      },
      { h: "Indiquez toujours la date d'échéance" },
      {
        p: "Votre facture doit mentionner la date à laquelle le paiement doit intervenir, le taux des pénalités de retard et l'indemnité forfaitaire de 40 € pour frais de recouvrement. Sans date d'échéance claire, il est plus difficile de prouver le retard.",
      },
      { h: "Et si le client dépasse le délai ?" },
      {
        p: `Les pénalités de retard sont dues dès le lendemain de l'échéance, sans rappel préalable. À défaut de taux dans vos conditions générales, c'est le taux de la BCE majoré de 10 points, soit ${pct(defaultPenaltyRate())} pour le ${RATES.period}, plus 40 € par facture.`,
      },
      { tool: { href: "/outils/calcul-penalites", label: "Calculer les pénalités de retard" } },
      {
        tip: "Un délai court et clair (par exemple 30 jours) et une relance dès le lendemain de l'échéance sont la meilleure protection contre les retards.",
      },
    ],
  },
  {
    slug: "eviter-les-factures-impayees",
    title: "Comment éviter les factures impayées : 8 réflexes simples",
    seoTitle: "Éviter les factures impayées : 8 réflexes pour artisans et indépendants",
    description:
      "Devis signé, acompte, échéance claire, relance dès J+1 : 8 réflexes simples pour limiter les factures impayées quand on est artisan, indépendant ou petite entreprise.",
    intro:
      "La meilleure facture impayée, c'est celle qui n'arrive jamais. Quelques réflexes avant et après la prestation suffisent à éviter la plupart des retards.",
    readMinutes: 4,
    updated: UPDATED_2,
    blocks: [
      { h: "Avant le travail" },
      {
        steps: [
          { title: "Faites signer un devis", text: "Avec le prix, le délai et les conditions de paiement. C'est votre meilleure preuve en cas de désaccord." },
          { title: "Demandez un acompte", text: "Pour les gros chantiers ou les nouveaux clients, un acompte (souvent 20 à 30 %) limite le risque." },
          { title: "Vérifiez votre client professionnel", text: "Les informations publiques sur les entreprises (registre national, procédures collectives) permettent de repérer une société en difficulté." },
          { title: "Ayez des conditions générales", text: "Elles fixent le délai de paiement et le taux des pénalités de retard." },
        ],
      },
      { h: "Après le travail" },
      {
        steps: [
          { title: "Facturez tout de suite", text: "Une facture envoyée tard est payée tard. Envoyez-la le jour même de la fin du travail." },
          { title: "Mettez une échéance claire", text: "« À régler avant le 15 mars » est plus efficace que « 30 jours »." },
          { title: "Facilitez le paiement", text: "IBAN, référence à indiquer, QR code ou lien de paiement : moins il y a d'efforts, plus le client paie vite." },
          { title: "Relancez dès le lendemain de l'échéance", text: "Un rappel poli à J+1 règle la plupart des oublis. Plus vous attendez, plus c'est difficile." },
        ],
      },
      { tool: { href: "/outils/lettre-relance", label: "Préparer une lettre de relance gratuite" } },
      {
        tip: "Les retards viennent rarement de la mauvaise foi : la plupart sont des oublis. Une relance régulière et automatique suffit souvent.",
      },
    ],
  },
  {
    slug: "facture-impayee-client-particulier",
    title: "Facture impayée par un particulier : quels recours ?",
    seoTitle: "Facture impayée par un particulier : relance, intérêts, injonction de payer",
    description:
      "Votre client est un particulier et ne paie pas ? Les règles diffèrent des professionnels : pas d'indemnité de 40 €, intérêts au taux légal, prescription de 2 ans. Les étapes pour être payé.",
    intro:
      "Quand votre client est un particulier, les règles ne sont pas les mêmes qu'entre professionnels. Voici ce qui change et comment récupérer votre argent.",
    readMinutes: 4,
    updated: UPDATED_2,
    blocks: [
      { h: "Ce qui change avec un particulier" },
      {
        list: [
          "Pas d'indemnité forfaitaire de 40 € : elle ne concerne que les clients professionnels.",
          "Pas de pénalités de retard « automatiques » : vous pouvez réclamer des intérêts au taux légal à partir de la mise en demeure.",
          "Un délai pour agir plus court : en principe 2 ans (article L218-2 du Code de la consommation).",
        ],
      },
      { h: "Les étapes" },
      {
        steps: [
          { title: "Relancez à l'amiable", text: "Un rappel poli, puis une relance plus ferme, par e-mail ou SMS. Un appel aide souvent." },
          { title: "Proposez un échéancier", text: "Un particulier en difficulté paiera plus facilement en plusieurs fois qu'en une seule." },
          { title: "Envoyez une mise en demeure", text: "En recommandé avec accusé de réception. Elle fait courir les intérêts au taux légal." },
          { title: "Saisissez la justice si besoin", text: "L'injonction de payer devant le tribunal judiciaire est simple et sans avocat. Pour les petites sommes, un commissaire de justice peut aussi proposer une procédure simplifiée de recouvrement." },
        ],
      },
      { tool: { href: "/outils/mise-en-demeure", label: "Rédiger une mise en demeure gratuite" } },
      {
        tip: "Avec les particuliers, demander un acompte avant le début des travaux reste la meilleure protection.",
      },
    ],
  },
  {
    slug: "factures-impayees-artisans-batiment",
    title: "Artisans du bâtiment : se faire payer ses chantiers",
    seoTitle: "Factures impayées dans le bâtiment : acomptes, situations, retenue de garantie",
    description:
      "Acomptes, situations de travaux, retenue de garantie, marchés publics : les règles et les bons réflexes pour être payé quand on est artisan du bâtiment.",
    intro:
      "Dans le bâtiment, les montants sont élevés et les chantiers longs : un retard de paiement peut vite mettre la trésorerie en difficulté. Voici les outils pour vous protéger.",
    readMinutes: 5,
    updated: UPDATED_2,
    blocks: [
      { h: "Sécurisez le chantier dès le devis" },
      {
        list: [
          "Un devis signé, avec le prix, le délai et l'échéancier de paiement.",
          "Un acompte à la commande, surtout pour les particuliers et les nouveaux clients.",
          "Des factures de situation (ou d'avancement) sur les chantiers longs, plutôt qu'une seule facture à la fin.",
        ],
      },
      { h: "La retenue de garantie" },
      {
        p: "Le client peut retenir jusqu'à 5 % du montant des travaux pendant un an après la réception (loi du 16 juillet 1971). Cette somme doit ensuite vous être rendue, sauf opposition motivée. Notez la date de réception de chaque chantier pour ne pas l'oublier.",
      },
      { tool: { href: "/outils/retenue-de-garantie", label: "Calculer la date de libération de votre retenue" } },
      { h: "Marchés publics et sous-traitance" },
      {
        list: [
          "Pour un marché public, le délai de paiement est en principe de 30 jours, et des intérêts moratoires sont dus automatiquement en cas de retard.",
          "Un sous-traitant accepté par le maître d'ouvrage peut, dans certains cas, être payé directement par lui (loi du 31 décembre 1975 sur la sous-traitance).",
        ],
      },
      { h: "Relancez sans attendre" },
      {
        p: "Un rappel dès le lendemain de l'échéance, une relance ferme la semaine suivante, puis une mise en demeure : plus vous agissez tôt, plus vous avez de chances d'être payé avant que le client ne rencontre d'autres difficultés.",
      },
      {
        tip: "Pensez aussi à réclamer les pénalités de retard et l'indemnité de 40 € à vos clients professionnels : elles sont dues de plein droit.",
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
