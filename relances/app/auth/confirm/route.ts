import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { adminOrNull, createClient } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/lifecycle";

// Lien de confirmation reçu par e-mail après l'inscription.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const supabase = await createClient();

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : token_hash && type
      ? await supabase.auth.verifyOtp({ type, token_hash })
      : { error: new Error("lien invalide") };

  // Destination après connexion : uniquement un chemin interne (pas de redirection vers un autre site).
  const nextParam = searchParams.get("next") ?? "";
  const next = /^\/[a-z0-9\-/]*$/i.test(nextParam) && !nextParam.startsWith("//") ? nextParam : "/";

  // E-mail confirmé : le compte est actif, on envoie la bienvenue (une seule fois). Pas pour un mot de passe oublié.
  if (!error && type !== "recovery" && next === "/") {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) await sendWelcome(user.id, user.email, adminOrNull());
  }
  const dest = error ? "/login?error=" + encodeURIComponent("Lien expiré ou invalide.") : next;
  return NextResponse.redirect(new URL(dest, request.url));
}
