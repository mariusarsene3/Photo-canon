import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import type { Profile } from "@/lib/reminders";
import { formatIban, siteUrl } from "@/lib/payment";
import { RelancesView } from "./view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Mes relances — ${BRAND.name}` };

export default async function RelancesPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data }, probe] = await Promise.all([
    supabase.from("profiles").select("*").maybeSingle(),
    supabase.from("profiles").select("templates").limit(1), // échoue si la migration 007 n'est pas appliquée
  ]);
  const profile = (data ?? { company_name: "", iban: "" }) as Profile;
  // Sans la migration 007, la page s'affiche mais rien ne peut être modifié.
  const ready = !probe.error;
  const remindBefore = data?.remind_before === true;

  const due = new Date(Date.now() + 10 * 86_400_000).toLocaleDateString("fr-FR");
  const pay = [`Régler en ligne (IBAN, QR code) : ${siteUrl()}/payer/…`];
  if (profile.iban) pay.push(`Règlement par virement : ${formatIban(profile.iban)}`);
  const vars = {
    client: "Boulangerie Dupont",
    numero: "F-042",
    montant: "1 250,00 €",
    echeance: due,
    entreprise: profile.company_name || "Votre entreprise",
    paiement: pay.join("\n"),
  };

  return <RelancesView email={user?.email} ok={ok} err={err} profile={profile} ready={ready} remindBefore={remindBefore} vars={vars} />;
}
