"use server";
import { z } from "zod";
import { runCheck, providersAvailable, type CheckResult } from "@/lib/check";
import { allowCheck } from "@/lib/rate-limit";

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
