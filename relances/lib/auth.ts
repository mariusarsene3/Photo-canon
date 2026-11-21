import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * À appeler au début de chaque action serveur qui touche aux données d'un compte.
 * Vérifie la session côté serveur (jamais seulement dans l'interface) : sans utilisateur connecté,
 * on renvoie vers la page de connexion. Les règles RLS de Supabase restent une seconde protection.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
