import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";
import { createAdminClient } from "@/lib/supabase/server";
import { runLifecycle } from "@/lib/lifecycle";

export const dynamic = "force-dynamic";

// À appeler une fois par jour (cron Vercel, cron-job.org...).
// Traite les factures de TOUS les comptes. Protégé par CRON_SECRET :
//   Authorization: Bearer <CRON_SECRET>
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
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
  return NextResponse.json({ reminders, lifecycle });
}
