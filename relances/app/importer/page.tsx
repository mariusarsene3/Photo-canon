import Link from "next/link";
import type { Metadata } from "next";
import { pdfImportAvailable } from "@/lib/pdf-extract";
import { ImportClient } from "./import-client";
import { AppShell } from "../app-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // la lecture de plusieurs PDF peut prendre du temps
export const metadata: Metadata = { title: "Importer des factures" };

export default async function ImportPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode: m } = await searchParams;
  const mode = m === "pdf" ? "pdf" : "table";
  const { data: { user } } = await (await createClient()).auth.getUser();

  return (
    <AppShell active="importer" email={user?.email}>
    <div className="imp-page">
      <h1>Importer des factures</h1>
      <nav className="imp-tabs">
        <Link href="/importer" className={mode === "table" ? "active" : ""}>Excel / CSV</Link>
        <Link href="/importer?mode=pdf" className={mode === "pdf" ? "active" : ""}>PDF (lecture par IA)</Link>
      </nav>

      <section className="card">
        {mode === "table" ? (
          <p className="muted imp-help">
            Votre fichier doit contenir une ligne d&apos;en-tête avec les colonnes : <b>numéro</b>, <b>client</b>,{" "}
            <b>e-mail</b>, <b>montant</b> (TTC) et <b>échéance</b>. L&apos;ordre n&apos;a pas d&apos;importance.{" "}
            <a href="/modele-import.csv" download>Télécharger le modèle</a>
          </p>
        ) : (
          <p className="muted imp-help">
            Déposez vos factures PDF : l&apos;IA lit le numéro, le client, le montant et l&apos;échéance. Vérifiez le résultat
            avant d&apos;importer : l&apos;e-mail du client n&apos;apparaît pas toujours sur la facture.
          </p>
        )}
        <ImportClient key={mode} mode={mode} pdfEnabled={pdfImportAvailable()} />
      </section>
    </div>
    </AppShell>
  );
}
