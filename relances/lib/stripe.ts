import Stripe from "stripe";
import { createAdminClient } from "./supabase/server";

/** Le paiement est actif quand les 3 variables Stripe sont renseignées. */
export const stripeConfigured = () =>
  Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID && process.env.STRIPE_WEBHOOK_SECRET);

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY manquante");
  return (client ??= new Stripe(process.env.STRIPE_SECRET_KEY));
}

const iso = (unix: number | null | undefined) => (unix ? new Date(unix * 1000).toISOString() : null);

/**
 * Recopie l'état d'un abonnement Stripe dans la table billing (via la clé de service).
 * L'utilisateur est retrouvé grâce au user_id placé dans les métadonnées à la création.
 */
export async function syncSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.user_id;
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const admin = createAdminClient();
  const row = {
    status: sub.status,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    // Depuis l'API 2025-03-31, la période est portée par les éléments de l'abonnement.
    current_period_end: iso(sub.items?.data?.[0]?.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };
  const query = userId
    ? admin.from("billing").upsert({ user_id: userId, ...row })
    : admin.from("billing").update(row).eq("stripe_customer_id", customerId);
  const { error } = await query;
  if (error) throw new Error("Mise à jour de l'abonnement impossible : " + error.message);
}
