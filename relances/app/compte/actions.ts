"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBilling } from "@/lib/billing";
import { stripe, stripeConfigured } from "@/lib/stripe";

async function origin() {
  const h = await headers();
  return h.get("origin") ?? `https://${h.get("host")}`;
}

const back = (msg: string, kind: "ok" | "err" = "err") => redirect(`/compte?${kind}=${encodeURIComponent(msg)}`);

/** Démarre le paiement de l'abonnement sur la page sécurisée de Stripe. */
export async function subscribe() {
  if (!stripeConfigured()) back("Le paiement en ligne n'est pas encore activé.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const billing = await getMyBilling(supabase);

  let url: string | null = null;
  try {
    const base = await origin();
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      ...(billing?.stripe_customer_id ? { customer: billing.stripe_customer_id } : { customer_email: user.email }),
      client_reference_id: user.id,
      subscription_data: { metadata: { user_id: user.id } },
      metadata: { user_id: user.id },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      locale: "fr",
      success_url: `${base}/compte?ok=${encodeURIComponent("Merci ! Votre abonnement est actif.")}`,
      cancel_url: `${base}/compte`,
    });
    url = session.url;
  } catch (e) {
    console.error("Stripe checkout", e);
  }
  if (!url) back("Impossible d'ouvrir la page de paiement. Réessayez dans un instant.");
  redirect(url!);
}

/** Ouvre l'espace client Stripe : carte bancaire, factures, résiliation. */
export async function manageSubscription() {
  if (!stripeConfigured()) back("Le paiement en ligne n'est pas encore activé.");
  const supabase = await createClient();
  const billing = await getMyBilling(supabase);
  if (!billing?.stripe_customer_id) back("Aucun abonnement à gérer.");

  let url: string | null = null;
  try {
    const portal = await stripe().billingPortal.sessions.create({
      customer: billing!.stripe_customer_id!,
      locale: "fr",
      return_url: `${await origin()}/compte`,
    });
    url = portal.url;
  } catch (e) {
    console.error("Stripe portal", e);
  }
  if (!url) back("Impossible d'ouvrir l'espace de facturation. Réessayez dans un instant.");
  redirect(url!);
}

/** Suppression définitive du compte (RGPD). Résilie d'abord l'abonnement Stripe s'il existe. */
export async function deleteAccount(form: FormData) {
  if (String(form.get("confirm") ?? "").trim().toUpperCase() !== "SUPPRIMER") {
    back("Tapez SUPPRIMER pour confirmer la suppression.");
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const billing = await getMyBilling(supabase);
  if (billing?.stripe_subscription_id && billing.status !== "canceled" && stripeConfigured()) {
    try {
      await stripe().subscriptions.cancel(billing.stripe_subscription_id);
    } catch (e) {
      console.error("Stripe cancel", e);
      back("La résiliation de l'abonnement a échoué : contactez-nous pour supprimer votre compte.");
    }
  }

  const { error } = await supabase.rpc("delete_my_account");
  if (error) back("La suppression a échoué. Réessayez ou contactez-nous.");
  await supabase.auth.signOut();
  redirect(`/login?info=${encodeURIComponent("Votre compte et toutes vos données ont été supprimés.")}`);
}
