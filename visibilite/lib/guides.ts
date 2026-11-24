/** Guides pratiques (pages /guides/[slug]) : du contenu utile pour être trouvé sur Google. */
export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string; // AAAA-MM-JJ
  sections: { h: string; p: string[]; list?: string[] }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "apparaitre-dans-chatgpt-commerce",
    title: "Comment faire apparaître son commerce dans ChatGPT",
    description:
      "Pourquoi ChatGPT cite certains commerces et pas d'autres, et ce que vous pouvez faire concrètement pour qu'il vous recommande.",
    date: "2026-11-24",
    sections: [
      {
        h: "Ce qui se passe quand un client demande à ChatGPT",
        p: [
          "Quand quelqu'un demande « un bon fleuriste à Nancy », ChatGPT fait une recherche sur Internet, lit quelques pages (fiches Google, annuaires, sites des commerces, articles), puis rédige une réponse avec deux à cinq noms.",
          "Il ne « connaît » pas votre commerce par magie : il cite ceux sur lesquels il trouve des informations claires, cohérentes et rassurantes. Si votre commerce n'apparaît nulle part, ou avec des informations incomplètes, il n'a aucune raison de le citer.",
        ],
      },
      {
        h: "Les 5 choses sur lesquelles l'IA se base",
        p: ["D'après nos tests, ce sont toujours les mêmes éléments qui reviennent dans les sources citées par l'IA :"],
        list: [
          "Votre fiche Google : catégorie, description, horaires, photos.",
          "Vos avis : leur nombre, leur fraîcheur, et ce qu'ils disent.",
          "Les annuaires : Pages Jaunes, Bing, Apple Plans, et ceux de votre métier.",
          "Votre site (s'il existe) : une page claire qui dit quoi, où, quand.",
          "Les mentions ailleurs : presse locale, site de la mairie, office de tourisme.",
        ],
      },
      {
        h: "Par où commencer",
        p: [
          "Commencez par faire le test : vous verrez si ChatGPT vous cite, qui il cite à votre place, et surtout sur quels sites il s'est appuyé. Ce sont ces sites-là qu'il faut soigner en premier.",
          "Ensuite, complétez votre fiche Google à 100 %, et demandez des avis à vos clients fidèles. Ce sont les deux leviers les plus rapides.",
          "Attention aux promesses : personne ne contrôle ChatGPT, et ses réponses varient d'une fois à l'autre. Méfiez-vous de quiconque vous « garantit » la première place.",
        ],
      },
    ],
  },
  {
    slug: "fiche-google-checklist",
    title: "Fiche Google : les 10 points à vérifier",
    description: "La liste simple pour une fiche Google complète, qui aide aussi ChatGPT et les autres IA à vous recommander.",
    date: "2026-11-24",
    sections: [
      {
        h: "Pourquoi la fiche Google compte autant",
        p: [
          "Votre fiche Google (Google Business Profile) est souvent la première source d'information sur votre commerce. Google Maps l'utilise, les réponses d'IA de Google aussi, et ChatGPT la retrouve très souvent quand il cherche.",
        ],
      },
      {
        h: "La liste",
        p: ["Prenez 30 minutes et vérifiez chaque point sur business.google.com :"],
        list: [
          "Le nom exact de votre commerce, sans mots-clés ajoutés.",
          "La bonne catégorie principale, la plus précise possible, et 2 ou 3 catégories secondaires.",
          "Une description qui dit clairement ce que vous faites, et où.",
          "Les horaires complets, y compris les horaires exceptionnels (fêtes, congés).",
          "L'adresse et le téléphone, écrits exactement comme sur vos autres fiches.",
          "Votre zone de livraison ou d'intervention, si vous vous déplacez.",
          "Vos produits ou services, avec une phrase pour chacun.",
          "Des photos récentes : devanture, intérieur, réalisations.",
          "Un lien vers votre site ou, à défaut, votre page Facebook.",
          "Des réponses à vos avis, même courtes.",
        ],
      },
      {
        h: "Et ensuite",
        p: [
          "Une fiche complète ne suffit pas toujours : il faut aussi des avis réguliers et une présence cohérente sur les annuaires. Faites le test pour voir où vous en êtes.",
        ],
      },
    ],
  },
  {
    slug: "obtenir-des-avis-clients",
    title: "Obtenir plus d'avis clients, simplement (et légalement)",
    description: "Les avis comptent pour Google comme pour l'IA. Voici comment en obtenir régulièrement, sans jamais tricher.",
    date: "2026-11-24",
    sections: [
      {
        h: "Pourquoi les avis comptent",
        p: [
          "Quand l'IA choisit qui recommander, elle regarde le nombre d'avis, leur fraîcheur et ce qu'ils racontent. Un commerce avec 80 avis récents passe souvent devant un commerce avec 6 avis datant de trois ans.",
        ],
      },
      {
        h: "La méthode simple",
        p: ["Le plus efficace, c'est de demander, au bon moment, avec un lien direct :"],
        list: [
          "Récupérez le lien « Demander des avis » dans votre fiche Google.",
          "Envoyez-le par SMS à vos clients satisfaits, avec un mot personnel.",
          "Mettez un petit carton avec un QR code sur le comptoir.",
          "Répondez à chaque avis, même en une phrase : ça encourage les suivants.",
        ],
      },
      {
        h: "Ce qu'il ne faut jamais faire",
        p: [
          "N'achetez jamais de faux avis et n'en écrivez pas vous-même : c'est interdit en France (pratique commerciale trompeuse), et Google peut suspendre votre fiche. Ne récompensez pas non plus les avis positifs.",
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
