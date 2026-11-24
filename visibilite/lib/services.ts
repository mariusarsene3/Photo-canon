import { BRAND } from "./brand";

/** Les services proposés (affichés sur l'accueil et dans le formulaire de contact). */
export const SERVICES = [
  {
    id: "visibilite",
    name: "Visibilité Google et IA",
    price: `${BRAND.offer.setup} €`,
    unit: "une fois",
    desc: "Pour que Google, ChatGPT et les autres IA vous trouvent et vous recommandent.",
    items: ["Audit offert", "Fiche Google complète", "Annuaires où l'IA cherche", "Message prêt pour demander des avis", "Nouveau test un mois après"],
    main: true,
  },
  {
    id: "site",
    name: "Site vitrine",
    price: `${BRAND.offer.website} €`,
    unit: "une fois",
    desc: "Un site simple et clair, fait pour être trouvé et pour donner envie de venir.",
    items: ["1 à 3 pages", "Parfait sur téléphone", "Horaires, adresse, téléphone, carte", "Relié à votre fiche Google", "Textes rédigés avec vous"],
  },
  {
    id: "reseaux",
    name: "Réseaux sociaux",
    price: `${BRAND.offer.social} €`,
    unit: "par mois",
    desc: "Une page Facebook et Instagram vivante, sans y passer vos soirées.",
    items: [`${BRAND.offer.socialPosts} publications par mois`, "Facebook et Instagram", "Textes et visuels préparés pour vous", "Vous validez avant publication", "Sans engagement", `${BRAND.offer.socialSeats} commerces maximum, pour bien m'en occuper`],
  },
  {
    id: "suivi",
    name: "Suivi mensuel",
    price: `${BRAND.offer.followUp} €`,
    unit: "par mois",
    desc: "Un test chaque mois sur plusieurs questions de clients, un résumé clair, et les corrections.",
    items: ["En option, après la visibilité", "Sans engagement"],
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];
