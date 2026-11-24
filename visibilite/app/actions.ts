"use server";
import { z } from "zod";
import { runCheck, providersAvailable, type CheckResult } from "@/lib/check";
import { allowCheck, allowLead } from "@/lib/rate-limit";
import { saveLead, leadsAvailable } from "@/lib/leads";
import { BRAND } from "@/lib/brand";

export type CheckState = { result?: CheckResult; error?: string; values?: Record<string, string> };

const clean = (max: number) => z.string().trim().min(2, "trop court").max(max, "trop long").transform((s) => s.replace(/\s+/g, " "));
const Input = z.object({ business: clean(80), trade: clean(60), city: clean(60) });

export async function checkAction(_prev: CheckState, form: FormData): Promise<CheckState> {
  const values = {
    business: String(form.get("business") ?? ""),
    trade: String(form.get("trade") ?? ""),
    city: String(form.get("city") ?? ""),
  };
  const parsed = Input.safeParse(values);
  if (!parsed.success) return { values, error: "Remplissez les trois champs (nom du commerce, activité, ville)." };
  if (!providersAvailable()) return { values, error: "L'analyse est momentanément indisponible." };
  if (!(await allowCheck())) return { values, error: "Vous avez fait beaucoup d'analyses : réessayez dans une heure." };

  const { business, trade, city } = parsed.data;
  const result = await runCheck(business, trade, city);
  if (result.results.every((r) => !r.ok)) return { values, error: "L'analyse n'a pas abouti. Réessayez dans un instant." };
  return { values, result };
}

// ---------- Demande d'audit ----------

export type LeadState = { ok?: boolean; error?: string };

const opt = (max: number) =>
  z.string().trim().max(max, "trop long").transform((s) => (s ? s.replace(/\s+/g, " ") : null));
const LeadInput = z.object({
  business: clean(80),
  trade: clean(60),
  city: clean(60),
  contact_name: clean(80),
  phone: opt(25).refine((p) => !p || /^[+\d][\d .-]{5,24}$/.test(p), "numéro de téléphone invalide"),
  email: opt(120).refine((e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), "adresse e-mail invalide"),
  message: opt(1000),
  cited: z.enum(["oui", "non", ""]).transform((c) => (c === "oui" ? true : c === "non" ? false : null)),
});

export async function leadAction(_prev: LeadState, form: FormData): Promise<LeadState> {
  if (form.get("website")) return { ok: true }; // champ piège invisible : rempli seulement par les robots
  const parsed = LeadInput.safeParse(Object.fromEntries(["business", "trade", "city", "contact_name", "phone", "email", "message", "cited"].map((k) => [k, String(form.get(k) ?? "")])));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message === "trop court" ? "Indiquez votre nom." : `Vérifiez le formulaire : ${parsed.error.issues[0]?.message}.` };
  if (!parsed.data.phone && !parsed.data.email) return { error: "Laissez un téléphone ou un e-mail pour qu'on puisse vous recontacter." };
  if (!leadsAvailable()) return { error: `Le formulaire est momentanément indisponible : écrivez-nous à ${BRAND.contactEmail}.` };
  if (!(await allowLead())) return { error: "Vous avez déjà envoyé plusieurs demandes : on vous recontacte très vite." };
  try {
    await saveLead(parsed.data);
    return { ok: true };
  } catch (e) {
    console.error("[lead]", e);
    return { error: "L'envoi n'a pas abouti. Réessayez dans un instant." };
  }
}
