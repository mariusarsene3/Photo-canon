import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// À appeler une fois par jour (cron Vercel, cron-job.org...).
// Traite les factures de TOUS les comptes. Protégé par CRON_SECRET :
//   Authorization: Bearer <CRON_SECRET>
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await runReminders(createAdminClient()));
}
