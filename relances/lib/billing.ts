import type { SupabaseClient } from "@supabase/supabase-js";

export type Billing = {
  user_id: string;
  trial_ends_at: string;
  status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

// Statuts Stripe qui donnent accès au service. « past_due » : paiement en échec, Stripe réessaie
// pendant quelques jours ; on laisse l'accès pendant ce délai.
const PAID = new Set(["active", "trialing", "past_due"]);

/**
 * Formule d'un compte. Il n'y a plus d'essai qui expire : sans abonnement, le compte est sur la version
 * gratuite (nombre limité de factures en cours, voir BRAND.freeInvoices) ; avec un abonnement Stripe, c'est Pro.
 */
export type Access =
  | { ok: true; reason: "subscribed"; billing: Billing }
  | { ok: true; reason: "free"; billing: Billing | null };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function accessFrom(b: Billing | null, _now = new Date()): Access {
  if (b?.status && PAID.has(b.status)) return { ok: true, reason: "subscribed", billing: b };
  return { ok: true, reason: "free", billing: b };
}

/** Abonnement de l'utilisateur connecté (lecture seule, via RLS). Null si la migration 003 n'est pas appliquée. */
export async function getMyBilling(supabase: SupabaseClient): Promise<Billing | null> {
  const { data, error } = await supabase.from("billing").select("*").maybeSingle();
  if (error) return null;
  return (data as Billing | null) ?? null;
}

/**
 * Formule de l'utilisateur connecté (gratuite tant qu'aucun abonnement n'est actif).
 */
export async function getMyAccess(supabase: SupabaseClient): Promise<Access> {
  const { data, error } = await supabase.from("billing").select("*").maybeSingle();
  if (error) return { ok: true, reason: "free", billing: null };
  return accessFrom((data as Billing | null) ?? null);
}

export const STATUS_LABEL: Record<string, string> = {
  active: "Actif",
  trialing: "Actif",
  past_due: "Paiement en échec — mettez à jour votre carte",
  canceled: "Résilié",
  unpaid: "Impayé",
  incomplete: "Paiement non finalisé",
  incomplete_expired: "Paiement non finalisé",
  paused: "En pause",
};
