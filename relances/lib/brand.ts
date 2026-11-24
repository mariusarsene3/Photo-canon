// Nom et offre du produit, à un seul endroit pour pouvoir les changer facilement.
export const BRAND = {
  name: "Encaissez",
  tagline: "Relance de factures impayées",
  price: 29,
  trialDays: 14,
  // Offre de lancement : réduction à vie pour les premiers abonnés.
  // Le code se crée dans Stripe (coupon -50 % « pour toujours » + code promo FONDATEUR limité à 20 utilisations).
  founder: { code: "FONDATEUR", discount: 50, seats: 20, showCounterFrom: 5 }, // compteur affiché à partir de 5 places prises
};

/** Prix fondateur affiché : « 14,50 € ». */
export const founderPrice = () =>
  (BRAND.price * (1 - BRAND.founder.discount / 100)).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
