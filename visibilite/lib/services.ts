import { BRAND } from "./brand";

/** Les 3 offres (accueil, pages métiers, formulaire de contact). */
export const SERVICES = [
  {
    id: "visibilite",
    name: "Être trouvé",
    price: `${BRAND.offer.setup} €`,
    unit: "une fois",
    desc: "Google, ChatGPT, annuaires, avis : je rends votre commerce visible là où vos clients cherchent.",
    items: ["Fiche Google complète", "Annuaires où l'IA cherche", "Message prêt pour demander des avis", "Nouveau test un mois après"],
  },
  {
    id: "site",
    name: "Site + être trouvé",
    price: `${BRAND.offer.pack} €`,
    unit: "une fois",
    desc: "Pas encore de site ? Je vous en fais un simple et clair, et je m'occupe de votre visibilité.",
    items: ["Site de 1 à 3 pages, parfait sur téléphone", "Tout ce qu'il y a dans « Être trouvé »", "Textes rédigés avec vous"],
    star: true,
  },
  {
    id: "reseaux",
    name: "Réseaux sociaux",
    price: `${BRAND.offer.social} €`,
    unit: "par mois",
    desc: `${BRAND.offer.socialPosts} publications par mois sur Facebook et Instagram. Vous validez, je publie.`,
    items: ["Textes et visuels préparés pour vous", "Sans engagement", `${BRAND.offer.socialSeats} commerces maximum, pour bien m'en occuper`],
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];
