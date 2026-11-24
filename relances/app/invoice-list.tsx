"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { markPaid } from "./actions";
import { SubmitButton } from "./submit-button";

/** Ligne de facture déjà préparée par le serveur (dates et statuts calculés côté serveur). */
export type Row = {
  id: number;
  number: string;
  client: string;
  email: string;
  amount: string;
  due: string;
  kind: "late" | "today" | "upcoming" | "paid" | "paused";
  status: string;
  next: string | null;
};

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "late", label: "En retard" },
  { id: "upcoming", label: "À venir" },
  { id: "paid", label: "Payées" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

/** Pastille aux initiales du client, avec une teinte stable dérivée de son nom. */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/).filter(Boolean);
  const initials = ((words[0]?.[0] ?? "?") + (words.length > 1 ? words[words.length - 1][0] : words[0]?.[1] ?? "")).toUpperCase();
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return (
    <span className="avatar" style={{ width: size, height: size, ["--h" as string]: h }} aria-hidden>
      {initials}
    </span>
  );
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function InvoiceList({ rows, demo = false }: { rows: Row[]; demo?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(
    () => ({
      all: rows.length,
      late: rows.filter((r) => r.kind === "late" || r.kind === "paused").length,
      upcoming: rows.filter((r) => r.kind === "upcoming" || r.kind === "today").length,
      paid: rows.filter((r) => r.kind === "paid").length,
    }),
    [rows],
  );

  const shown = rows.filter((r) => {
    if (filter === "late" && r.kind !== "late" && r.kind !== "paused") return false;
    if (filter === "upcoming" && r.kind !== "upcoming" && r.kind !== "today") return false;
    if (filter === "paid" && r.kind !== "paid") return false;
    if (q && !norm(`${r.number} ${r.client} ${r.email}`).includes(norm(q))) return false;
    return true;
  });

  return (
    <div className="inv">
      <div className="inv-tools">
        <div className="inv-filters" role="tablist" aria-label="Filtrer les factures">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={filter === f.id ? "on" : ""}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span>{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <input
          className="inv-search"
          type="search"
          placeholder="Rechercher un client, un n°…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Rechercher"
        />
      </div>

      {shown.length === 0 ? (
        <p className="muted inv-empty">Aucune facture ne correspond.</p>
      ) : (
        <ul className="inv-list">
          {shown.map((r) => (
            <li key={r.id} className={`inv-row k-${r.kind}`}>
              <Link href={demo ? `/demo?f=${r.id}#apercu` : `/factures/${r.id}`} className="inv-main" aria-label={`Facture ${r.number}, ${r.client}`}>
                <Avatar name={r.client} />
                <span className="inv-client">
                  <b>{r.client}</b>
                  <small>N° {r.number} · échéance {r.due}</small>
                </span>
                <span className="inv-amount">{r.amount}</span>
                <span className="inv-status">
                  <span className={`badge b-${r.kind}`}><i className="badge-dot" />{r.status}</span>
                  {r.next && <small>{r.next}</small>}
                </span>
              </Link>
              {r.kind !== "paid" && demo && (
                <div className="inv-quick">
                  <Link href="/login?mode=signup" className="demo-quick" title="Créez votre compte pour essayer">Payée ✓</Link>
                </div>
              )}
              {r.kind !== "paid" && !demo && (
                <form action={markPaid} className="inv-quick">
                  <input type="hidden" name="id" value={r.id} />
                  <SubmitButton className="small secondary" pending="…" title="Marquer comme payée">Payée ✓</SubmitButton>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
