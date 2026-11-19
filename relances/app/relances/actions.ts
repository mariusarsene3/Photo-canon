"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_TEMPLATES, type Template } from "@/lib/reminders";

const MIGRATION = "Fonction pas encore activée : appliquez la migration 007 dans Supabase.";

function back(msg: string, kind: "ok" | "err" = "ok", anchor = ""): never {
  redirect(`/relances?${kind}=${encodeURIComponent(msg)}${anchor}`);
}

async function me() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function save(fields: Record<string, unknown>, ok: string, anchor = "") {
  const { supabase, user } = await me();
  const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...fields });
  if (error) back(/column|schema cache/i.test(error.message) ? MIGRATION : "Enregistrement impossible. Réessayez.", "err", anchor);
  revalidatePath("/relances");
  revalidatePath("/");
  back(ok, "ok", anchor);
}

/** Active ou désactive le rappel envoyé 3 jours avant l'échéance. */
export async function setRemindBefore(form: FormData) {
  const on = form.get("remind_before") === "on";
  await save({ remind_before: on }, on ? "Rappel avant échéance activé." : "Rappel avant échéance désactivé.");
}

async function currentTemplates() {
  const { supabase } = await me();
  const { data } = await supabase.from("profiles").select("*").maybeSingle();
  if (data && !("templates" in data)) back(MIGRATION, "err");
  return { ...((data?.templates ?? {}) as Record<string, Template>) };
}

/** Enregistre le texte personnalisé d'une étape (ou revient au texte d'origine s'il est identique). */
export async function saveTemplate(form: FormData) {
  const step = Number(form.get("step"));
  if (!(step in DEFAULT_TEMPLATES)) back("Étape inconnue.", "err");
  const anchor = `#etape-${step}`;
  const subject = String(form.get("subject") ?? "").trim().slice(0, 200);
  const body = String(form.get("body") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 5000);
  if (!subject || !body) back("L'objet et le texte ne peuvent pas être vides.", "err", anchor);
  const templates = await currentTemplates();
  const def = DEFAULT_TEMPLATES[step];
  if (subject === def.subject && body === def.body) delete templates[String(step)];
  else templates[String(step)] = { subject, body };
  await save({ templates }, "Texte enregistré : il sera utilisé pour les prochaines relances.", anchor);
}

/** Revient au texte proposé par défaut pour une étape. */
export async function resetTemplate(form: FormData) {
  const step = Number(form.get("step"));
  const templates = await currentTemplates();
  delete templates[String(step)];
  await save({ templates }, "Texte d'origine rétabli.", `#etape-${step}`);
}
