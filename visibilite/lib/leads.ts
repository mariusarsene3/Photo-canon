import "server-only";
import { BRAND } from "./brand";

export type Lead = {
  business: string;
  trade: string;
  city: string;
  contact_name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  cited: boolean | null;
};

const supabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const leadsAvailable = () => Boolean(supabaseUrl() && supabaseKey());

/** Enregistre la demande d'audit (table reperez_leads, en ajout seul) puis prévient par e-mail si Resend est configuré. */
export async function saveLead(lead: Lead) {
  const res = await fetch(`${supabaseUrl()}/rest/v1/reperez_leads`, {
    method: "POST",
    headers: {
      apikey: supabaseKey()!,
      Authorization: `Bearer ${supabaseKey()}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  await notify(lead).catch((e) => console.error("[lead] e-mail non envoyé", e));
}

async function notify(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const text = [
    `Nouvelle demande d'audit ${BRAND.name}`,
    "",
    `Commerce : ${lead.business} (${lead.trade}, ${lead.city})`,
    `Cité par l'IA : ${lead.cited === null ? "?" : lead.cited ? "oui" : "non"}`,
    `Contact : ${lead.contact_name}`,
    `Téléphone : ${lead.phone ?? "-"}`,
    `E-mail : ${lead.email ?? "-"}`,
    `Message : ${lead.message ?? "-"}`,
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${BRAND.name} <notifications@encaissez.fr>`, // domaine déjà vérifié chez Resend
      to: [BRAND.contactEmail],
      reply_to: lead.email ?? undefined,
      subject: `Demande d'audit : ${lead.business} (${lead.city})`,
      text,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}
