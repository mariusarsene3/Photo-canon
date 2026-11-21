"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { adminOrNull, createClient } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/lifecycle";
import { clearRateLimit, clientIp, hitRateLimit, tooManyMessage } from "@/lib/rate-limit";

function creds(form: FormData) {
  return {
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  };
}

export async function login(form: FormData) {
  // 5 essais par minute et par adresse IP, puis blocage de 15 minutes (vérifié côté serveur).
  const ip = await clientIp();
  const rate = await hitRateLimit("login", ip);
  if (!rate.ok) redirect(`/login?error=${encodeURIComponent(tooManyMessage(rate.retryAfter))}`);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(creds(form));
  if (error) redirect(`/login?error=${encodeURIComponent("E-mail ou mot de passe incorrect.")}`);
  await clearRateLimit("login", ip);
  redirect("/");
}

export async function signup(form: FormData) {
  const { email, password } = creds(form);
  if (password.length < 8)
    redirect(`/login?mode=signup&error=${encodeURIComponent("Mot de passe : 8 caractères minimum.")}`);
  const rate = await hitRateLimit("signup");
  if (!rate.ok) redirect(`/login?mode=signup&error=${encodeURIComponent(tooManyMessage(rate.retryAfter))}`);

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`);
  // Compte utilisable tout de suite (confirmation d'e-mail désactivée) : bienvenue maintenant.
  if (data.session && data.user) await sendWelcome(data.user.id, email, adminOrNull());
  if (!data.session)
    redirect(`/login?info=${encodeURIComponent("Compte créé ! Cliquez sur le lien reçu par e-mail pour l'activer.")}`);
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Mot de passe oublié : Supabase envoie un lien qui ramène vers la page de nouveau mot de passe. */
export async function requestReset(form: FormData) {
  const email = String(form.get("email") ?? "").trim();
  if (!email.includes("@")) redirect(`/login?mode=reset&error=${encodeURIComponent("Indiquez votre adresse e-mail.")}`);
  const rate = await hitRateLimit("reset");
  if (!rate.ok) redirect(`/login?mode=reset&error=${encodeURIComponent(tooManyMessage(rate.retryAfter))}`);
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/confirm?next=/nouveau-mot-de-passe` });
  // Même message que le compte existe ou non : on ne révèle pas quelles adresses sont inscrites.
  redirect(`/login?info=${encodeURIComponent("Si un compte existe pour cette adresse, un lien pour choisir un nouveau mot de passe vient d'être envoyé.")}`);
}

/** Enregistre le nouveau mot de passe (l'utilisateur est connecté via le lien reçu par e-mail). */
export async function updatePassword(form: FormData) {
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  const back = (m: string) => redirect(`/nouveau-mot-de-passe?error=${encodeURIComponent(m)}`);
  if (password.length < 8) back("8 caractères minimum.");
  if (password !== confirm) back("Les deux mots de passe ne correspondent pas.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) back("Le lien a expiré : refaites une demande depuis la page de connexion.");
  redirect(`/?ok=${encodeURIComponent("Mot de passe mis à jour.")}`);
}
