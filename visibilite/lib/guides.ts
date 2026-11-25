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
  {
    slug: "apparaitre-sur-google-maps",
    title: "Comment apparaître sur Google Maps (et remonter dans la liste)",
    description:
      "Quand on cherche « boulangerie » ou « plombier » sur Google Maps, trois commerces s'affichent en premier. Voici comment Google les choisit, et ce que vous pouvez faire.",
    date: "2026-11-25",
    sections: [
      {
        h: "Comment Google choisit les commerces affichés",
        p: [
          "Google l'explique lui-même : les résultats locaux dépendent de trois choses. La pertinence (votre fiche correspond-elle à ce que la personne cherche ?), la distance (êtes-vous près d'elle ?) et la notoriété (votre commerce est-il connu, cité, bien noté ?).",
          "Vous ne pouvez rien faire contre la distance. En revanche, la pertinence et la notoriété dépendent presque entièrement de vous.",
        ],
      },
      {
        h: "Étape 1 : avoir une fiche, et qu'elle soit validée",
        p: [
          "Allez sur business.google.com et cherchez votre commerce. S'il existe déjà (Google crée parfois des fiches tout seul), revendiquez-le. Sinon, créez-le. Google vous demandera de prouver que c'est bien vous : par téléphone, par e-mail, par vidéo ou par courrier selon les cas.",
          "Tant que la fiche n'est pas validée, vos modifications peuvent ne pas apparaître.",
        ],
      },
      {
        h: "Étape 2 : remplir ce qui compte pour la pertinence",
        p: ["Google ne peut vous afficher pour une recherche que s'il comprend ce que vous faites :"],
        list: [
          "La catégorie principale la plus précise possible (« Fleuriste », pas « Magasin »).",
          "Deux ou trois catégories secondaires si elles sont vraies (« Livraison de fleurs »…).",
          "Une description qui dit ce que vous faites et où, avec des mots simples que vos clients utilisent.",
          "Vos produits ou services, chacun avec une phrase.",
          "Des horaires complets et à jour, y compris les jours fériés.",
        ],
      },
      {
        h: "Étape 3 : construire votre notoriété",
        p: ["C'est ce qui départage deux commerces aussi bien placés :"],
        list: [
          "Des avis réguliers : demandez-les à vos clients contents, avec le lien direct.",
          "Des réponses à vos avis, positifs comme négatifs.",
          "Des photos récentes, ajoutées de temps en temps.",
          "Les mêmes nom, adresse et téléphone partout : site, Pages Jaunes, Facebook, annuaires.",
          "Des mentions ailleurs : site de la mairie, presse locale, office de tourisme.",
        ],
      },
      {
        h: "Ce qui ne marche pas",
        p: [
          "Ajouter des mots-clés dans le nom de votre commerce (« Boulangerie Dupont meilleur pain Lyon ») est contraire aux règles de Google et peut faire suspendre la fiche. Acheter des avis aussi. Et méfiez-vous de ceux qui promettent « la 1re place garantie » : les seules places garanties sont les annonces payantes, marquées « Sponsorisé ».",
        ],
      },
    ],
  },
  {
    slug: "repondre-avis-negatifs",
    title: "Répondre à un avis négatif : la méthode et 5 modèles",
    description:
      "Un avis négatif n'est pas une catastrophe : votre réponse compte autant que l'avis. Méthode simple et modèles de réponses prêts à adapter.",
    date: "2026-11-25",
    sections: [
      {
        h: "Pourquoi il faut répondre",
        p: [
          "Ceux qui lisent un avis négatif lisent aussi votre réponse. Une réponse calme et polie rassure souvent plus qu'une note parfaite. Et pour Google comme pour l'IA, un commerce qui répond à ses avis est un commerce actif.",
        ],
      },
      {
        h: "La méthode en 4 points",
        p: ["Attendez d'être calme, puis :"],
        list: [
          "Remerciez la personne d'avoir pris le temps d'écrire.",
          "Reconnaissez le problème, sans vous justifier longuement.",
          "Proposez une solution ou un échange en privé (téléphone, e-mail).",
          "Restez court : 3 ou 4 phrases suffisent.",
        ],
      },
      {
        h: "5 modèles à adapter",
        p: [
          "Retard ou attente : « Bonjour [prénom], merci pour votre retour. Vous avez raison, l'attente était trop longue ce jour-là et nous en sommes désolés. Nous avons revu notre organisation le samedi. Au plaisir de vous accueillir à nouveau. »",
          "Produit décevant : « Bonjour [prénom], merci de nous l'avoir signalé. Ce n'est pas la qualité que nous voulons vous offrir. Appelez-nous au [téléphone], nous trouverons une solution ensemble. »",
          "Accueil jugé désagréable : « Bonjour [prénom], nous sommes désolés que vous ayez eu ce sentiment. L'accueil compte beaucoup pour nous et nous en avons parlé en équipe. Merci pour votre franchise. »",
          "Avis sans explication (1 étoile, pas de texte) : « Bonjour, nous sommes désolés que votre expérience n'ait pas été bonne. Pouvez-vous nous en dire plus au [téléphone] ou à [e-mail] ? Nous aimerions comprendre et nous améliorer. »",
          "Avis qui ne vous concerne pas (erreur de commerce) : « Bonjour, nous ne retrouvons pas votre passage chez nous et pensons qu'il peut s'agir d'un autre établissement. N'hésitez pas à nous contacter au [téléphone] si nous faisons erreur. »",
        ],
      },
      {
        h: "Ce qu'il ne faut jamais faire",
        list: [
          "Répondre à chaud, ou se moquer du client.",
          "Donner des informations personnelles sur lui (nom complet, commande, adresse).",
          "Demander à quelqu'un de supprimer son avis contre une remise.",
        ],
        p: [],
      },
      {
        h: "Et si l'avis est faux ?",
        p: [
          "Si un avis est faux, injurieux ou ne correspond à aucun client, vous pouvez le signaler à Google depuis votre fiche. Google ne le supprime que s'il enfreint ses règles. En attendant, une réponse calme reste la meilleure protection.",
        ],
      },
    ],
  },
  {
    slug: "site-vitrine-commercant-prix",
    title: "Site vitrine pour un commerce : combien ça coûte et que mettre dedans",
    description:
      "Faut-il un site quand on a déjà une fiche Google ? Combien prévoir ? Ce qu'un site de commerce doit contenir, simplement.",
    date: "2026-11-25",
    sections: [
      {
        h: "Est-ce vraiment utile ?",
        p: [
          "Une fiche Google bien remplie fait déjà beaucoup. Mais un site simple aide de deux façons : il rassure les clients qui veulent en savoir plus, et il donne à Google et aux IA une source claire et fiable sur ce que vous faites. Quand ChatGPT cherche « un bon fleuriste à Nancy », il lit souvent les sites des commerces qu'il cite.",
        ],
      },
      {
        h: "Combien ça coûte, en gros",
        p: ["Les prix varient beaucoup. D'après les offres publiques, on trouve en général :"],
        list: [
          "Le faire soi-même avec un créateur de site en ligne : un abonnement de quelques euros à quelques dizaines d'euros par mois, et beaucoup de temps.",
          "Un indépendant : souvent de quelques centaines à environ 1 500 € pour un site vitrine simple.",
          "Une agence : souvent plus de 1 500 €.",
          "À prévoir dans tous les cas : le nom de domaine (une dizaine d'euros par an) et l'hébergement.",
        ],
      },
      {
        h: "Ce que votre site doit contenir",
        p: ["Pas besoin de 10 pages. L'essentiel tient sur une ou deux :"],
        list: [
          "Ce que vous faites et où, dès la première phrase.",
          "Vos horaires, votre adresse avec une carte, votre téléphone (cliquable sur mobile).",
          "Des photos de votre commerce et de vos produits.",
          "Vos spécialités, vos prix ou une carte si c'est votre métier.",
          "Un lien vers vos avis Google.",
          "Les mentions légales, obligatoires pour tout site professionnel en France.",
        ],
      },
      {
        h: "Les erreurs à éviter",
        list: [
          "Un site illisible sur téléphone : la plupart de vos visiteurs viendront de là.",
          "Des informations différentes de votre fiche Google (horaires, téléphone).",
          "Un site jamais mis à jour, avec les horaires d'il y a trois ans.",
        ],
        p: [],
      },
    ],
  },
  {
    slug: "annuaires-ou-inscrire-son-commerce",
    title: "Sur quels annuaires inscrire son commerce (et lesquels éviter)",
    description:
      "Google, Bing, Apple Plans, Pages Jaunes, annuaires de votre métier : où être présent pour être trouvé, et comment éviter les arnaques aux annuaires.",
    date: "2026-11-25",
    sections: [
      {
        h: "Pourquoi les annuaires comptent encore",
        p: [
          "Les annuaires servent à deux choses : des clients les consultent directement, et Google comme les IA les lisent pour vérifier qu'un commerce existe et que ses informations sont fiables. Quand vos nom, adresse et téléphone sont identiques partout, c'est un signal de confiance.",
        ],
      },
      {
        h: "Les indispensables (gratuits)",
        list: [
          "Google Business Profile : la base de tout, pour Google Maps et la recherche Google.",
          "Bing Places : l'équivalent chez Microsoft. On peut importer sa fiche Google en quelques clics.",
          "Apple Business Connect : pour apparaître correctement dans Plans sur iPhone.",
          "Pages Jaunes : la fiche de base est gratuite ; les options payantes ne sont pas obligatoires.",
          "Une page Facebook à jour, même si vous publiez peu.",
        ],
        p: [],
      },
      {
        h: "Selon votre métier",
        list: [
          "Restaurants : TripAdvisor, TheFork.",
          "Coiffure et beauté : Planity.",
          "Hébergements : office de tourisme, Gîtes de France, plateformes de réservation.",
          "Artisans du bâtiment : annuaires des labels (RGE, Qualibat, Qualifelec) si vous les avez.",
          "Et partout : le site de votre mairie ou de votre communauté de communes, qui liste souvent les commerces.",
        ],
        p: [],
      },
      {
        h: "Attention aux arnaques aux annuaires",
        p: [
          "Des sociétés envoient des formulaires ou des « factures » qui ressemblent à une simple mise à jour de vos coordonnées. En les signant, on s'engage en réalité dans un abonnement coûteux à un annuaire inconnu. Avant de signer quoi que ce soit, lisez les petites lignes et cherchez le nom de la société. Un vrai annuaire utile ne vous oblige jamais à payer pour une fiche de base.",
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
