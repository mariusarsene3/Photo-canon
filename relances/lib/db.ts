import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Base SQLite locale (intégrée à Node 22, aucune dépendance).
// Pour la mise en production on passera sur Postgres (Supabase).
const dir = path.join(process.cwd(), "data");
fs.mkdirSync(dir, { recursive: true });

const g = globalThis as unknown as { __db?: DatabaseSync };
export const db = g.__db ?? new DatabaseSync(path.join(dir, "relances.db"));
g.__db = db;

db.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    due_date TEXT NOT NULL,            -- AAAA-MM-JJ
    status TEXT NOT NULL DEFAULT 'pending', -- pending | paid
    paid_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    step INTEGER NOT NULL,
    sent_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(invoice_id, step)
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export type Invoice = {
  id: number;
  number: string;
  client_name: string;
  client_email: string;
  amount_cents: number;
  due_date: string;
  status: "pending" | "paid";
  paid_at: string | null;
  created_at: string;
  reminders_sent: number;
  last_reminder_at: string | null;
};

export function listInvoices(): Invoice[] {
  return db
    .prepare(
      `SELECT i.*,
              COUNT(r.id) AS reminders_sent,
              MAX(r.sent_at) AS last_reminder_at
         FROM invoices i
         LEFT JOIN reminders r ON r.invoice_id = i.id
        GROUP BY i.id
        ORDER BY (i.status = 'paid'), i.due_date ASC`
    )
    .all() as unknown as Invoice[];
}

export function getSetting(key: string, fallback = ""): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? fallback;
}

export function setSetting(key: string, value: string) {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
}
