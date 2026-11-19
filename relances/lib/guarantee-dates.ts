/** Calculs de dates de la retenue de garantie, sans dépendance serveur (utilisables dans le navigateur). */

/** Date de libération : même jour, un an plus tard (29 février → 1er mars). */
export function releaseDate(reception: string): string {
  const [y, m, d] = reception.split("-").map(Number);
  // Date.UTC fait déborder le 29 février d'une année non bissextile sur le 1er mars.
  return new Date(Date.UTC(y + 1, m - 1, d)).toISOString().slice(0, 10);
}

/** Jours restants avant la libération (négatif si la date est passée). */
export function daysUntilRelease(reception: string, now = new Date()): number {
  const rel = Date.parse(releaseDate(reception) + "T00:00:00Z");
  const today = Date.parse(now.toISOString().slice(0, 10) + "T00:00:00Z");
  return Math.round((rel - today) / 86_400_000);
}

export const frLong = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }).replace(/^1 /, "1er ");
