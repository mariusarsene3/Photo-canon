import { BRAND } from "./brand";

/**
 * Informations légales de l'éditeur du site.
 * ⚠️ Les champs marqués TODO doivent être remplis avant d'ouvrir le service au public
 * (obligation légale : loi pour la confiance dans l'économie numérique, art. 6 III, et RGPD).
 */
export const LEGAL = {
  serviceName: BRAND.name,
  siteUrl: "https://photo-canon.vercel.app",

  // Éditeur
  editorName: "", // TODO : nom et prénom, ou raison sociale
  editorStatus: "", // TODO : ex. « Entrepreneur individuel (micro-entreprise) » ou « SAS au capital de 1 000 € »
  editorAddress: "", // TODO : adresse postale
  editorSiret: "", // TODO : n° SIRET (ou RCS + ville)
  editorVat: "", // facultatif : n° de TVA intracommunautaire (vide si franchise en base de TVA)
  contactEmail: "", // TODO : e-mail de contact (aussi utilisé pour les demandes RGPD)
  publicationDirector: "", // TODO : en général, le nom de l'éditeur

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
