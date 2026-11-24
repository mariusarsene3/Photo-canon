import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { adminOrNull } from "./supabase/server";
import type { Access } from "./billing";
import { LEGAL } from "./legal";
import { BRAND } from "./brand";

/**
 * Limites par formule.
 * - Version gratuite : quelques factures en cours à la fois (BRAND.freeInvoices).
 * - Anti-abus : plafond d'e-mails par jour. Il protège la réputation d'envoi du domaine : sans lui, quelqu'un
 *   pourrait envoyer du spam depuis notre adresse. Un artisan normal n'en approche jamais.
 */
export const LIMITS = {
  free: { emailsPerDay: 30, pending: BRAND.freeInvoices },
  subscribed: { emailsPerDay: 300, pending: Number.POSITIVE_INFINITY },
} as const;

export type Plan = keyof typeof LIMITS;

export const planOf = (access: Access): Plan => (access.reason === "subscribed" ? "subscribed" : "free");

/** Début de la journée en cours (UTC), pour compter les envois du jour. */
export const startOfDay = (now = new Date()) => now.toISOString().slice(0, 10) + "T00:00:00Z";

export const contactHint = () =>
  LEGAL.contactEmail ? ` Besoin de plus ? Écrivez-nous à ${LEGAL.contactEmail}.` : "";

/** Nombre de factures en cours (non payées) que ce compte peut encore ajouter (Infinity en Pro). */
export async function pendingLeft(supabase: SupabaseClient, plan: Plan): Promise<number> {
  const max = LIMITS[plan].pending;
  if (!Number.isFinite(max)) return max;
  const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true }).eq("status", "pending");
  return Math.max(0, max - (count ?? 0));
}

export const freeLimitMessage = () =>
  `Version gratuite : ${BRAND.freeInvoices} factures en cours maximum. Marquez une facture comme payée, ou passez au Pro (${BRAND.price} € HT/mois) pour en suivre autant que vous voulez.`;

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
