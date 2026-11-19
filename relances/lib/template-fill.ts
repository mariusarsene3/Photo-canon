/** Remplissage des textes de relance ({client}, {montant}…), sans dépendance serveur (utilisable dans le navigateur). */
export type Template = { subject: string; body: string };

export function fillTemplate(t: Template, vars: Record<string, string>) {
  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
  let body = t.body;
  // Les moyens de paiement figurent toujours dans la relance, même si le texte personnalisé les a oubliés.
  if (vars.paiement && !body.includes("{paiement}")) body += "\n\n{paiement}";
  const text = fill(body).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { subject: fill(t.subject).replace(/\s+/g, " ").trim(), text };
}
