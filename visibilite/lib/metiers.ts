/**
 * Pages « test par métier » (/test/[slug]) : une page par métier, pour être trouvé sur Google
 * (« est-ce que ChatGPT recommande mon restaurant », etc.). Chaque page a un texte propre au métier.
 */
export type Metier = {
  slug: string;
  name: string; // « restaurant »
  article: string; // « un restaurant »
  plural: string; // « restaurants »
  question: string; // question type d'un client
  intro: string;
  sources: string[]; // sites où l'IA va souvent chercher pour ce métier
  tips: string[];
  examples: string[]; // noms inventés pour l'exemple
};

export const METIERS: Metier[] = [
  {
    slug: "restaurant",
    examples: ["Le Bistrot des Halles", "Chez Paulette"],
    name: "restaurant",
    article: "un restaurant",
    plural: "restaurants",
    question: "Où bien manger ce soir à Tours, pas trop cher ?",
    intro:
      "Pour choisir où manger, beaucoup de gens demandent maintenant directement à ChatGPT ou lisent la réponse d'IA en haut de Google. Ces réponses ne citent que quelques adresses, souvent celles qui ont beaucoup d'avis récents et une fiche bien remplie.",
    sources: ["Google Maps", "TripAdvisor", "TheFork", "les guides et blogs locaux"],
    tips: ["Mettez votre menu et vos prix en ligne (fiche Google et site)", "Répondez aux avis, même courts", "Indiquez clairement le type de cuisine et les spécialités"],
  },
  {
    slug: "fleuriste",
    examples: ["Atelier Pivoine", "La Petite Serre"],
    name: "fleuriste",
    article: "un fleuriste",
    plural: "fleuristes",
    question: "Je cherche un fleuriste à Nancy pour un mariage, lesquels me conseilles-tu ?",
    intro:
      "Bouquet de dernière minute, mariage, deuil : les clients demandent de plus en plus à l'IA quel fleuriste choisir. Elle cite rarement plus de deux ou trois noms, souvent ceux présents sur les réseaux de livraison et les annuaires.",
    sources: ["Google Maps", "Pages Jaunes", "Interflora et Florajet", "les sites des mairies"],
    tips: ["Précisez vos spécialités (mariage, deuil, plantes) et votre zone de livraison", "Ajoutez des photos de vos créations récentes", "Soyez présent sur les réseaux de transmission florale si vous en faites partie"],
  },
  {
    slug: "coiffeur",
    examples: ["Studio Mèche", "L'Atelier de Léa"],
    name: "salon de coiffure",
    article: "un coiffeur",
    plural: "coiffeurs",
    question: "Un bon coiffeur à Rennes pour une coloration, tu me conseilles qui ?",
    intro:
      "Coupe, coloration, barbier : quand un client cherche un nouveau salon, l'IA lui propose une courte liste. Elle s'appuie sur les avis, les prestations affichées et les sites de réservation.",
    sources: ["Google Maps", "Planity", "Pages Jaunes", "Instagram"],
    tips: ["Listez vos prestations et vos prix", "Activez la réservation en ligne si vous l'utilisez", "Publiez régulièrement vos réalisations"],
  },
  {
    slug: "boulangerie",
    examples: ["Au Pain Doré", "Maison Fournil"],
    name: "boulangerie",
    article: "une boulangerie",
    plural: "boulangeries",
    question: "Quelle est la meilleure boulangerie à Lyon 7e ?",
    intro:
      "« La meilleure boulangerie du quartier » : c'est exactement le genre de question qu'on pose à l'IA. Elle répond avec deux ou trois adresses, souvent celles qui ont le plus d'avis et qui apparaissent dans les classements locaux.",
    sources: ["Google Maps", "les classements et articles de presse locale", "Pages Jaunes"],
    tips: ["Indiquez vos horaires exacts, y compris le dimanche et les jours fériés", "Mettez en avant vos spécialités et vos labels", "Demandez des avis à vos clients fidèles"],
  },
  {
    slug: "plombier",
    examples: ["Durand Plomberie", "SOS Fuite Express"],
    name: "plombier",
    article: "un plombier",
    plural: "plombiers",
    question: "J'ai une fuite, quel plombier sérieux à Bordeaux ?",
    intro:
      "En urgence, beaucoup de gens demandent à l'IA un artisan « sérieux » près de chez eux. Elle privilégie ceux qui ont des avis, une zone d'intervention claire et des informations cohérentes partout.",
    sources: ["Google Maps", "Pages Jaunes", "les annuaires d'artisans", "les labels (RGE, Qualibat)"],
    tips: ["Précisez votre zone d'intervention et vos urgences éventuelles", "Affichez vos labels et assurances", "Gardez le même nom, adresse et téléphone partout"],
  },
  {
    slug: "electricien",
    examples: ["Élec Services Martin", "Volt & Co"],
    name: "électricien",
    article: "un électricien",
    plural: "électriciens",
    question: "Un électricien fiable à Lille pour refaire un tableau électrique ?",
    intro:
      "Pour des travaux, les clients veulent quelqu'un de fiable, et demandent de plus en plus conseil à l'IA. Elle cite les artisans dont elle trouve des avis et des informations claires.",
    sources: ["Google Maps", "Pages Jaunes", "les annuaires d'artisans", "les labels (RGE, Qualifelec)"],
    tips: ["Décrivez vos prestations précisément (dépannage, rénovation, borne de recharge…)", "Affichez vos labels", "Demandez un avis après chaque chantier"],
  },
  {
    slug: "garage",
    examples: ["Garage du Centre", "Auto Révision Plus"],
    name: "garage",
    article: "un garage",
    plural: "garages",
    question: "Un garage honnête à Toulouse pour une révision ?",
    intro:
      "« Un garage honnête » : c'est une question très posée à l'IA. Elle répond avec des garages bien notés, aux informations claires (marques, services, horaires).",
    sources: ["Google Maps", "Pages Jaunes", "les comparateurs d'entretien auto"],
    tips: ["Indiquez les marques et services pris en charge", "Affichez vos horaires et votre téléphone partout de la même façon", "Répondez aux avis négatifs calmement"],
  },
  {
    slug: "boucherie",
    examples: ["Boucherie du Marché", "Maison Lefort"],
    name: "boucherie",
    article: "une boucherie",
    plural: "boucheries",
    question: "Une bonne boucherie à Nantes pour des produits locaux ?",
    intro:
      "Produits locaux, qualité, conseils : les clients qui cherchent un bon boucher demandent maintenant aussi à l'IA. Elle cite les commerces dont elle trouve des avis et une description précise.",
    sources: ["Google Maps", "Pages Jaunes", "la presse locale"],
    tips: ["Mettez en avant l'origine de vos produits", "Indiquez vos horaires et vos services (traiteur, commandes)", "Ajoutez des photos de votre vitrine"],
  },
  {
    slug: "esthetique",
    examples: ["Institut Belle Peau", "L'Écrin Beauté"],
    name: "institut de beauté",
    article: "un institut de beauté",
    plural: "instituts de beauté",
    question: "Un bon institut de beauté à Montpellier pour un soin du visage ?",
    intro:
      "Soins, épilation, onglerie : l'IA propose quelques adresses quand on lui demande conseil. Elle s'appuie sur les avis, les prestations listées et les sites de réservation.",
    sources: ["Google Maps", "Planity", "Instagram", "Pages Jaunes"],
    tips: ["Listez vos soins et vos prix", "Proposez la réservation en ligne", "Publiez des photos (avec l'accord de vos clientes)"],
  },
  {
    slug: "gite",
    examples: ["Le Gîte des Tilleuls", "La Grange du Moulin"],
    name: "gîte ou chambre d'hôtes",
    article: "un gîte",
    plural: "gîtes et chambres d'hôtes",
    question: "Un gîte sympa dans le Perche pour un week-end à deux ?",
    intro:
      "Pour un week-end, beaucoup de voyageurs demandent à l'IA « un gîte sympa » dans une région. Elle cite surtout les hébergements présents sur les sites de réservation et les offices de tourisme.",
    sources: ["Google Maps", "l'office de tourisme", "Gîtes de France", "les plateformes de réservation"],
    tips: ["Soyez référencé par l'office de tourisme local", "Décrivez ce qui vous rend unique (calme, piscine, randonnée…)", "Demandez un avis à chaque séjour"],
  },
];

export const metierBySlug = (slug: string) => METIERS.find((m) => m.slug === slug);
