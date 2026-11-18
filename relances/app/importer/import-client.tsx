"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { commitImport, previewImport } from "./actions";
import type { ImportRow } from "@/lib/import";

const COLS: { key: keyof ImportRow; label: string; placeholder: string }[] = [
  { key: "number", label: "N°", placeholder: "F-042" },
  { key: "client_name", label: "Client", placeholder: "Nom du client" },
  { key: "client_email", label: "E-mail", placeholder: "client@exemple.fr" },
  { key: "amount", label: "Montant TTC", placeholder: "1250,00" },
  { key: "due_date", label: "Échéance", placeholder: "AAAA-MM-JJ" },
];

// Vérification rapide côté navigateur (le serveur revérifie tout à l'import).
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const looksValid = (r: ImportRow) =>
  !!r.number.trim() && !!r.client_name.trim() && EMAIL.test(r.client_email.trim()) &&
  /^\d[\d\s.,]*$/.test(r.amount.trim()) && /^\d{4}-\d{2}-\d{2}$/.test(r.due_date.trim());

export function ImportClient({ mode, pdfEnabled }: { mode: "table" | "pdf"; pdfEnabled: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [phase, setPhase] = useState<"read" | "save" | null>(null);

  const read = (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    setError(null);
    setPhase("read");
    start(async () => {
      const res = await previewImport(fd);
      setRows(res.rows.length ? res.rows : null);
      setError(res.error ?? null);
      setPhase(null);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  const update = (i: number, key: keyof ImportRow, value: string) =>
    setRows((rs) => rs && rs.map((r, j) => (j === i ? { ...r, [key]: value, errors: [] } : r)));
  const remove = (i: number) => setRows((rs) => (rs && rs.length > 1 ? rs.filter((_, j) => j !== i) : null));

  const save = () => {
    if (!rows) return;
    setPhase("save");
    start(async () => {
      const res = await commitImport(rows);
      setPhase(null);
      if (res.error) return setError(res.error);
      const msg = `${res.imported} facture(s) importée(s)` + (res.skipped ? `, ${res.skipped} ignorée(s) car incomplète(s)` : "") + ".";
      router.push(`/?ok=${encodeURIComponent(msg)}`);
    });
  };

  const valid = rows?.filter(looksValid).length ?? 0;

  if (mode === "pdf" && !pdfEnabled) {
    return (
      <p className="alert err">
        L&apos;import PDF n&apos;est pas encore activé sur ce site : il faut ajouter la clé <code>ANTHROPIC_API_KEY</code> dans les
        variables d&apos;environnement Vercel.
      </p>
    );
  }

  return (
    <div className="imp">
      {!rows && (
        <label className={`imp-drop${pending ? " busy" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept={mode === "pdf" ? "application/pdf,.pdf" : ".xlsx,.csv,text/csv"}
            multiple={mode === "pdf"}
            disabled={pending}
            onChange={(e) => read(e.target.files)}
          />
          <strong>
            {phase === "read"
              ? mode === "pdf" ? "Lecture des factures par l'IA…" : "Lecture du fichier…"
              : mode === "pdf" ? "Choisir des factures PDF" : "Choisir un fichier Excel ou CSV"}
          </strong>
          <span className="muted small">
            {mode === "pdf" ? "Jusqu'à 10 PDF à la fois · quelques secondes par facture" : "Fichier .xlsx ou .csv avec une ligne d'en-tête"}
          </span>
        </label>
      )}

      {error && <p className="alert err">{error}</p>}

      {rows && (
        <>
          <p className="imp-summary">
            <strong>{valid}</strong> facture(s) prête(s) sur {rows.length}.{" "}
            {valid < rows.length && <span className="muted">Corrigez les cases en rouge ou retirez la ligne.</span>}
          </p>
          <div className="table-wrap">
            <table className="imp-table">
              <thead>
                <tr>{COLS.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const ok = looksValid(r);
                  return (
                    <tr key={i} className={ok ? "" : "imp-bad"}>
                      {COLS.map((c) => (
                        <td key={c.key}>
                          <input
                            value={String(r[c.key] ?? "")}
                            placeholder={c.placeholder}
                            type={c.key === "due_date" ? "date" : c.key === "client_email" ? "email" : "text"}
                            inputMode={c.key === "amount" ? "decimal" : undefined}
                            onChange={(e) => update(i, c.key, e.target.value)}
                            aria-label={`${c.label}, ligne ${i + 1}`}
                          />
                        </td>
                      ))}
                      <td className="imp-side">
                        <button type="button" className="small ghost" onClick={() => remove(i)} title="Retirer cette ligne">✕</button>
                        {r.source && <span className="muted small">{r.source}</span>}
                        {!ok && r.errors?.length ? <span className="imp-err small">{r.errors.join(", ")}</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="row imp-actions">
            <button type="button" className="secondary" onClick={() => { setRows(null); setError(null); }} disabled={pending}>
              Changer de fichier
            </button>
            <button type="button" onClick={save} disabled={pending || valid === 0}>
              {phase === "save" ? "Import en cours…" : `Importer ${valid} facture(s)`}
            </button>
          </div>
        </>
      )}

    </div>
  );
}
