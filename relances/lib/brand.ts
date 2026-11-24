// Nom et offre du produit, à un seul endroit pour pouvoir les changer facilement.
export const BRAND = {
  name: "Encaissez",
  tagline: "Relance de factures impayées",
  price: 9, // € HT par mois, formule Pro
  freeInvoices: 3, // version gratuite : nombre de factures en cours (non payées) suivies en même temps
  // Offre de lancement : mois de Pro offerts aux premiers abonnés.
  // Le code se crée dans Stripe (coupon -100 % pendant 3 mois + code promo FONDATEUR limité à 20 utilisations).
  founder: { code: "FONDATEUR", monthsFree: 3, seats: 20, showCounterFrom: 5 }, // compteur affiché à partir de 5 places prises
};

/** Texte de l'offre fondateur : « 3 mois de Pro offerts ». */
export const founderOffer = () => `${BRAND.founder.monthsFree} mois de Pro offerts`;

/** Résumé de l'offre, réutilisé partout : « Gratuit jusqu'à 3 factures · Pro 9 € HT/mois ». */
export const pricingLine = () => `Gratuit jusqu'à ${BRAND.freeInvoices} factures en cours · Pro ${BRAND.price} € HT/mois`;
