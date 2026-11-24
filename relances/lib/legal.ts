import { BRAND } from "./brand";

/**
 * Informations légales de l'éditeur du site.
 * ⚠️ Les champs marqués TODO doivent être remplis avant d'ouvrir le service au public
 * (obligation légale : loi pour la confiance dans l'économie numérique, art. 6 III, et RGPD).
 */
export const LEGAL = {
  serviceName: BRAND.name,
  // Adresse du site : voir siteUrl() dans lib/payment.ts (variable NEXT_PUBLIC_SITE_URL).

  // Éditeur
  editorName: "", // TODO : nom et prénom, ou raison sociale
  editorStatus: "", // TODO : ex. « Entrepreneur individuel (micro-entreprise) » ou « SAS au capital de 1 000 € »
  editorAddress: "", // TODO : adresse postale
  editorSiret: "", // TODO : n° SIRET (ou RCS + ville)
  editorVat: "", // facultatif : n° de TVA intracommunautaire (vide si franchise en base de TVA)
  contactEmail: "contact@encaissez.fr", // redirigé chez OVH vers la boîte personnelle ; (aussi utilisé pour les demandes RGPD et les réponses aux e-mails)
  publicationDirector: "", // TODO : en général, le nom de l'éditeur
  // TVA : en micro-entreprise sous le seuil, mettre « TVA non applicable, art. 293 B du CGI ».
  // Sinon : « TVA au taux de 20 % en sus ».
  vatMention: "", // TODO
  // Tribunal compétent en cas de litige entre professionnels (en général, celui du siège de l'éditeur).
  court: "", // TODO : ex. « Tribunal de commerce de Lyon »

  // Hébergement du site
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },

  // Région d'hébergement de la base de données Supabase (à vérifier dans Supabase > Project Settings)
  databaseRegion: "Union européenne",

  lastUpdate: "18 novembre 2026",
};

export const legalMissing = () =>
  (["editorName", "editorStatus", "editorAddress", "editorSiret", "contactEmail", "publicationDirector"] as const).filter(
    (k) => !LEGAL[k],
  );

/** Valeur ou mention visible « à compléter ». */
export const v = (value: string) => value || "[à compléter]";
