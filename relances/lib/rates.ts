/**
 * Taux officiels utilisés par les outils gratuits. À METTRE À JOUR CHAQUE SEMESTRE (janvier et juillet).
 *
 * - Pénalités de retard entre professionnels (art. L441-10 du Code de commerce) : à défaut de taux prévu dans les
 *   CGV, taux de refinancement de la BCE + 10 points. Le taux BCE retenu est celui en vigueur au 1er janvier
 *   (1er semestre) ou au 1er juillet (2e semestre). Minimum : 3 fois le taux d'intérêt légal.
 * - Indemnité forfaitaire pour frais de recouvrement : 40 € par facture (art. D441-5), entre professionnels.
 * - Taux d'intérêt légal : fixé chaque semestre par arrêté.
 *
 * Sources (2e semestre 2026) : arrêté du 26 juin 2026 (JO du 30 juin 2026) pour le taux légal ;
 * décision de la BCE du 11 juin 2026 (refinancement à 2,40 %, en vigueur au 1er juillet 2026).
 */
export const RATES = {
  period: "2e semestre 2026",
  validUntil: "2026-12-31",
  bceRate: 2.4, // % — taux de refinancement BCE au 1er juillet 2026
  legalRatePro: 2.75, // % — taux de l'intérêt légal, « autres cas »
  legalRateIndividual: 6.84, // % — créancier personne physique hors activité professionnelle
  recoveryFee: 40, // € — indemnité forfaitaire par facture
};

export const defaultPenaltyRate = () => Math.round((RATES.bceRate + 10) * 100) / 100; // 12,40 %
export const minimumPenaltyRate = () => Math.round(RATES.legalRatePro * 3 * 100) / 100; // 8,25 %

export const pct = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + " %";
export const eur = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

/** Nombre de jours entre deux dates AAAA-MM-JJ (0 si la fin est avant le début). */
export function daysBetween(from: string, to: string): number {
  const a = Date.parse(from + "T00:00:00Z"), b = Date.parse(to + "T00:00:00Z");
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

/** Pénalités de retard : montant × taux × jours / 365. */
export function penalties(amount: number, ratePct: number, days: number): number {
  return Math.round(amount * (ratePct / 100) * (days / 365) * 100) / 100;
}
