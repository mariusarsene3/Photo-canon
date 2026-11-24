import "server-only";
import { BRAND } from "./brand";
import { unstable_cache } from "next/cache";
import { adminOrNull } from "./supabase/server";

/**
 * Places restantes pour l'offre fondateur : nombre d'abonnés payants comptés dans la base.
 * Sans accès à la base (clé de service absente), on affiche toutes les places.
 */
async function countSeatsLeft(): Promise<number> {
  const admin = adminOrNull();
  if (!admin) return BRAND.founder.seats;
  const { count, error } = await admin
    .from("billing")
    .select("user_id", { count: "exact", head: true })
    .in("status", ["active", "trialing", "past_due"])
    .not("stripe_subscription_id", "is", null);
  if (error || count === null) return BRAND.founder.seats;
  return Math.max(0, BRAND.founder.seats - count);
}

/** Résultat gardé en cache 5 minutes : la page d'accueil n'interroge pas la base à chaque visite. */
export const founderSeatsLeft = unstable_cache(countSeatsLeft, ["founder-seats"], { revalidate: 300 });

/** Le compteur de places n'est affiché qu'à partir de quelques abonnés : « 20 places sur 20 » montrerait qu'il n'y en a aucun. */
export const showSeatCounter = (left: number) => BRAND.founder.seats - left >= BRAND.founder.showCounterFrom;
