"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { adminOrNull, createClient } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/lifecycle";

function creds(form: FormData) {
  return {
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  };
}

export async function login(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(creds(form));
  if (error) redirect(`/login?error=${encodeURIComponent("E-mail ou mot de passe incorrect.")}`);
  redirect("/");
}

export async function signup(form: FormData) {
  const { email, password } = creds(form);
  if (password.length < 8)
    redirect(`/login?mode=signup&error=${encodeURIComponent("Mot de passe : 8 caractères minimum.")}`);

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
