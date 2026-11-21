import "server-only"; // ce fichier manipule des clés secrètes : interdit dans le navigateur
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client lié à l'utilisateur connecté (les règles RLS s'appliquent). */
export async function createClient() {
  const store = await cookies();
  return createServerClient(url(), anonKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Appelé depuis un Server Component : le middleware rafraîchit la session.
        }
      },
    },
  });
}

/** Client administrateur si la clé de service est configurée, sinon null. */
export function adminOrNull() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

/** Client administrateur (contourne RLS). Serveur uniquement, pour le cron quotidien. */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante");
  return createPlainClient(url(), key, { auth: { persistSession: false } });
}
