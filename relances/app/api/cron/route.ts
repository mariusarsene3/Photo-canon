import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";
import { createAdminClient } from "@/lib/supabase/server";
import { runLifecycle } from "@/lib/lifecycle";
import { runGuaranteeAlerts } from "@/lib/guarantees";
import { runWeekly } from "@/lib/weekly";

export const dynamic = "force-dynamic";

/** Comparaison en temps constant : ne laisse pas deviner le secret caractère par caractère. */
function sameSecret(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// À appeler une fois par jour (cron Vercel, cron-job.org...).
// Traite les factures de TOUS les comptes. Protégé par CRON_SECRET :
//   Authorization: Bearer <CRON_SECRET>
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !sameSecret(req.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  const reminders = await runReminders(admin);
  // E-mails d'accompagnement de l'essai : une erreur ici ne doit pas bloquer les relances.
  let lifecycle: unknown;
  try {
    lifecycle = await runLifecycle(admin);
  } catch (e) {
    lifecycle = { error: e instanceof Error ? e.message : String(e) };
  }
  let guarantees: unknown;
  try {
    guarantees = await runGuaranteeAlerts(admin);
  } catch (e) {
    guarantees = { error: e instanceof Error ? e.message : String(e) };
  }
  let weekly: unknown;
  try {
    weekly = await runWeekly(admin);
  } catch (e) {
    weekly = { error: e instanceof Error ? e.message : String(e) };
  }
  return NextResponse.json({ reminders, lifecycle, guarantees, weekly });
}
