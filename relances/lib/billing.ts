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

export type Access =
  | { ok: true; reason: "subscribed"; billing: Billing }
  | { ok: true; reason: "trial"; daysLeft: number; billing: Billing }
  | { ok: false; reason: "expired" | "unknown"; billing: Billing | null };

export function accessFrom(b: Billing | null, now = new Date()): Access {
  if (!b) return { ok: false, reason: "unknown", billing: null };
  if (b.status && PAID.has(b.status)) return { ok: true, reason: "subscribed", billing: b };
  const msLeft = new Date(b.trial_ends_at).getTime() - now.getTime();
  if (msLeft > 0) return { ok: true, reason: "trial", daysLeft: Math.ceil(msLeft / 86_400_000), billing: b };
  return { ok: false, reason: "expired", billing: b };
}

/** Abonnement de l'utilisateur connecté (lecture seule, via RLS). Null si la migration 003 n'est pas appliquée. */
export async function getMyBilling(supabase: SupabaseClient): Promise<Billing | null> {
  const { data, error } = await supabase.from("billing").select("*").maybeSingle();
  if (error) return null;
  return (data as Billing | null) ?? null;
}

/**
 * Accès de l'utilisateur connecté. Tant que la migration 003 n'est pas appliquée (table absente),
 * on laisse l'accès ouvert pour ne pas bloquer le service.
 */
export async function getMyAccess(supabase: SupabaseClient): Promise<Access> {
  const { data, error } = await supabase.from("billing").select("*").maybeSingle();
  if (error) {
    const open: Billing = { user_id: "", trial_ends_at: "2999-01-01", status: null, stripe_customer_id: null, stripe_subscription_id: null, current_period_end: null, cancel_at_period_end: false };
    return { ok: true, reason: "trial", daysLeft: 999, billing: open };
  }
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
