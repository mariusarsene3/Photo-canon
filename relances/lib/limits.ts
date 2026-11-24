import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { adminOrNull } from "./supabase/server";
import type { Access } from "./billing";
import { LEGAL } from "./legal";

/**
 * Limites anti-abus. Elles protègent la réputation d'envoi du domaine : sans elles, quelqu'un pourrait
 * créer un compte d'essai, ajouter des centaines de « factures » vers des adresses au hasard et envoyer
 * du spam depuis notre adresse. Un artisan normal n'en approche jamais.
 */
export const LIMITS = {
  trial: { emailsPerDay: 50, invoices: 200 },
  subscribed: { emailsPerDay: 300, invoices: Number.POSITIVE_INFINITY },
} as const;

export type Plan = keyof typeof LIMITS;

/** Formule d'un compte : abonné, sinon limites de l'essai (par prudence). */
export const planOf = (access: Access | { ok: true; reason: "trial" | "subscribed" }): Plan =>
  access.ok && access.reason === "subscribed" ? "subscribed" : "trial";

/** Début de la journée en cours (UTC), pour compter les envois du jour. */
export const startOfDay = (now = new Date()) => now.toISOString().slice(0, 10) + "T00:00:00Z";

export const contactHint = () =>
  LEGAL.contactEmail ? ` Besoin de plus ? Écrivez-nous à ${LEGAL.contactEmail}.` : "";

/** Nombre de factures que ce compte peut encore ajouter (Infinity si aucune limite). */
export async function invoicesLeft(supabase: SupabaseClient, plan: Plan): Promise<number> {
  const max = LIMITS[plan].invoices;
  if (!Number.isFinite(max)) return max;
  const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true });
  return Math.max(0, max - (count ?? 0));
}

export const invoiceLimitMessage = (plan: Plan) =>
  `Limite de ${LIMITS[plan].invoices} factures atteinte pendant l'essai gratuit. Abonnez-vous pour en ajouter davantage.${contactHint()}`;

/**
 * Réserve un envoi d'e-mail dans le quota du jour de ce compte. Renvoie false si le quota est atteint.
 * Le compteur vit dans une table réservée au serveur (migration 009) : l'utilisateur ne peut ni le lire ni
 * le remettre à zéro. Fenêtre glissante de 24 h. Sans clé de service, on se rabat sur `fallbackCount`
 * (envois déjà comptés par l'appelant), moins robuste.
 */
export async function takeEmailQuota(userId: string, plan: Plan, fallbackCount: number): Promise<boolean> {
  const max = LIMITS[plan].emailsPerDay;
  const admin = adminOrNull();
  if (admin) {
    const { data, error } = await admin.rpc("hit_rate_limit", { p_key: `email:${userId}`, p_max: max, p_window: 86_400, p_block: 300 });
    if (!error) return !data;
    console.error("Quota d'e-mails : compteur indisponible, repli sur le comptage local.", error.message);
  }
  return fallbackCount < max;
}
