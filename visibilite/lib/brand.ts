export const BRAND = {
  name: "Repérez",
  domain: "reperez.fr",
  tagline: "Est-ce que ChatGPT recommande votre commerce ?",
  contactEmail: "contact@encaissez.fr", // provisoire, en attendant une adresse @reperez.fr
  // ⚠️ À confirmer : la région où tu te déplaces (affichée sur le site).
  region: "de l'Orne et du Perche", // s'affiche après « les commerces »
  offer: {
    audit: "offert",
    setup: 149, // € une fois : mise en place
    followUp: 19, // € par mois : suivi, sans engagement
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
