"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MAX_ROWS, parseCsv, parseXlsx, tableToRows, validateRow, type ImportRow } from "@/lib/import";
import { extractInvoiceFromPdf, pdfImportAvailable } from "@/lib/pdf-extract";

const MAX_FILE = 10 * 1024 * 1024; // 10 Mo par fichier
const MAX_PDFS = 10;

export type PreviewResult = { rows: ImportRow[]; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ? supabase : null;
}

/** Lit les fichiers envoyés (CSV, Excel ou PDF) et renvoie un aperçu à vérifier. Rien n'est enregistré. */
export async function previewImport(form: FormData): Promise<PreviewResult> {
  if (!(await requireUser())) return { rows: [], error: "Session expirée, reconnectez-vous." };
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { rows: [], error: "Choisissez un fichier." };
  if (files.some((f) => f.size > MAX_FILE)) return { rows: [], error: "Fichier trop volumineux (10 Mo maximum)." };

  const ext = (f: File) => f.name.toLowerCase().split(".").pop() ?? "";
  const pdfs = files.filter((f) => ext(f) === "pdf");

  if (pdfs.length) {
    if (pdfs.length !== files.length) return { rows: [], error: "Importez soit des PDF, soit un tableau, pas les deux en même temps." };
    if (!pdfImportAvailable()) return { rows: [], error: "L'import PDF n'est pas encore activé (clé ANTHROPIC_API_KEY manquante)." };
    if (pdfs.length > MAX_PDFS) return { rows: [], error: `${MAX_PDFS} PDF maximum à la fois.` };
    // Lecture en parallèle, par petits groupes pour rester dans les limites de l'API.
    const rows: ImportRow[] = [];
    for (let i = 0; i < pdfs.length; i += 4) {
      const batch = pdfs.slice(i, i + 4);
      rows.push(...(await Promise.all(batch.map(async (f) => extractInvoiceFromPdf(f.name, await f.arrayBuffer())))));
    }
    return { rows: withErrors(rows) };
  }

  if (files.length > 1) return { rows: [], error: "Un seul fichier Excel ou CSV à la fois." };
  const file = files[0];
  try {
    let table: unknown[][];
    if (ext(file) === "csv" || ext(file) === "txt") table = parseCsv(await file.text());
    else if (ext(file) === "xlsx") table = await parseXlsx(await file.arrayBuffer());
    else if (ext(file) === "xls") return { rows: [], error: "Ancien format .xls : enregistrez le fichier en .xlsx ou .csv depuis Excel." };
    else return { rows: [], error: "Format non pris en charge. Utilisez un fichier .xlsx, .csv ou .pdf." };

    const { rows, missing } = tableToRows(table);
    if (missing.length) {
      return {
        rows: [],
        error: `Colonnes introuvables : ${missing.join(", ")}. Ajoutez une ligne d'en-tête (voir le modèle à télécharger).`,
      };
    }
    if (table.length - 1 > MAX_ROWS) {
      return { rows: withErrors(rows), error: `Seules les ${MAX_ROWS} premières lignes ont été lues.` };
    }
    return { rows: withErrors(rows) };
  } catch (e) {
    console.error("Import tableau", e);
    return { rows: [], error: "Impossible de lire ce fichier. Vérifiez qu'il n'est pas protégé ou endommagé." };
  }
}

// Une ligne qui a déjà une erreur de lecture (PDF illisible…) la garde ; sinon on la vérifie.
const withErrors = (rows: ImportRow[]) =>
  rows.map((r) => (r.errors?.length ? r : { ...r, errors: validateRow(r).errors }));

/** Enregistre les lignes valides. Les lignes invalides sont renvoyées pour correction. */
export async function commitImport(rows: ImportRow[]): Promise<{ imported: number; skipped: number; error?: string }> {
  const supabase = await requireUser();
  if (!supabase) return { imported: 0, skipped: rows.length, error: "Session expirée, reconnectez-vous." };
  const clean = rows.slice(0, MAX_ROWS).map((r) => validateRow(r).clean).filter((c) => c !== undefined);
  if (!clean.length) return { imported: 0, skipped: rows.length, error: "Aucune ligne valide à importer." };
  const { error } = await supabase.from("invoices").insert(clean);
  if (error) return { imported: 0, skipped: rows.length, error: "Erreur d'enregistrement : " + error.message };
  revalidatePath("/");
  return { imported: clean.length, skipped: rows.length - clean.length };
}
