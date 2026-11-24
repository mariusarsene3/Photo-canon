export const BRAND = {
  name: "Repérez",
  domain: "reperez.fr",
  tagline: "Est-ce que ChatGPT recommande votre commerce ?",
  contactEmail: "contact@encaissez.fr", // provisoire, en attendant une adresse @reperez.fr
  area: "partout en France, par téléphone et en visio",
  offer: {
    audit: "offert",
    setup: 149, // € une fois : visibilité Google + IA
    followUp: 19, // € par mois : suivi, sans engagement
    website: 490, // € une fois : site vitrine 1 à 3 pages
    social: 149, // € par mois : réseaux sociaux, 8 publications
    socialPosts: 8,
    socialSeats: 3, // nombre maximum de commerces suivis en même temps pour les réseaux sociaux
  },
};

/** Informations légales de l'éditeur. ⚠️ À compléter avant de facturer (SIRET, adresse…). */
export const LEGAL = {
  editorName: "", // TODO : nom et prénom de l'entrepreneur
  editorStatus: "", // TODO : « Entrepreneur individuel (micro-entreprise) »
  editorAddress: "", // TODO
  editorSiret: "", // TODO
  host: { name: "Vercel Inc.", address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis" },
  lastUpdate: "24 novembre 2026",
};
export const v = (value: string) => value || "[en cours d'immatriculation]";
