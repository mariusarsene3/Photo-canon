import ExcelJS from "exceljs";

/** Une ligne de facture prête à être vérifiée puis importée. */
export type ImportRow = {
  number: string;
  client_name: string;
  client_email: string;
  amount: string; // texte tel qu'affiché, ex. "1250,00"
  due_date: string; // AAAA-MM-JJ
  source?: string; // fichier d'origine (PDF) ou n° de ligne
  errors?: string[];
};

export type CleanRow = {
  number: string;
  client_name: string;
  client_email: string;
  amount_cents: number;
  due_date: string;
};

export const MAX_ROWS = 500;

/* ---------- Normalisation ---------- */

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

type Field = "number" | "client_name" | "client_email" | "amount" | "due_date";

// Noms de colonnes reconnus (après normalisation : minuscules, sans accents ni espaces).
const ALIASES: Record<Field, string[]> = {
  number: ["numero", "numerofacture", "nfacture", "nofacture", "numfacture", "facture", "reference", "ref", "invoice", "invoicenumber", "n", "no", "num"],
  client_name: ["client", "nomclient", "nom", "raisonsociale", "societe", "entreprise", "customer", "destinataire"],
  client_email: ["email", "emailclient", "mail", "courriel", "adressemail", "adresseemail", "emailduclient"],
  amount: ["montantttc", "totalttc", "ttc", "montant", "total", "amount", "netapayer", "resteapayer", "prix"],
  due_date: ["echeance", "dateecheance", "datedecheance", "datelimite", "datelimitedepaiement", "duedate", "datepaiement", "echeancepaiement"],
};

/** Associe chaque champ à l'index de colonne correspondant, d'après la ligne d'en-tête. */
export function mapHeaders(headers: string[]): Partial<Record<Field, number>> {
  const n = headers.map((h) => norm(String(h ?? "")));
  const out: Partial<Record<Field, number>> = {};
  const used = new Set<number>();
  // 1) correspondances exactes, dans l'ordre de priorité des alias
  for (const field of Object.keys(ALIASES) as Field[]) {
    for (const alias of ALIASES[field]) {
      const i = n.findIndex((h, idx) => h === alias && !used.has(idx));
      if (i >= 0) { out[field] = i; used.add(i); break; }
    }
  }
  // 2) correspondances partielles pour les colonnes restantes (ex. « Montant TTC (€) »)
  for (const field of Object.keys(ALIASES) as Field[]) {
    if (out[field] !== undefined) continue;
    for (const alias of ALIASES[field].filter((a) => a.length >= 4)) {
      const i = n.findIndex((h, idx) => h.includes(alias) && !used.has(idx));
      if (i >= 0) { out[field] = i; used.add(i); break; }
    }
  }
  return out;
}

/** « 1 250,00 € », « 1.250,00 », « 1,250.00 », 1250 → centimes. */
export function parseAmount(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) && v > 0 ? Math.round(v * 100) : null;
  let s = String(v ?? "").replace(/[\s  €$]|EUR/gi, "");
  if (!s) return null;
  const lastComma = s.lastIndexOf(","), lastDot = s.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    // le dernier séparateur est le séparateur décimal
    s = lastComma > lastDot ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (lastComma >= 0) {
    s = s.replace(",", ".");
  }
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return n > 0 ? Math.round(n * 100) : null;
}

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => {
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
};

/** 31/03/2026, 31-03-26, 2026-03-31, date Excel, numéro de série Excel → AAAA-MM-JJ. */
export function parseDate(v: unknown): string | null {
  if (v instanceof Date && !isNaN(v.getTime())) return iso(v.getUTCFullYear(), v.getUTCMonth() + 1, v.getUTCDate());
  if (typeof v === "number" && v > 20000 && v < 80000) {
    const d = new Date(Date.UTC(1899, 11, 30) + v * 86_400_000); // numéro de série Excel
    return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  const s = String(v ?? "").trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2}|\d{4})$/); // format français JJ/MM/AAAA
  if (m) {
    const y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    return iso(y, +m[2], +m[1]);
  }
  return null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Vérifie une ligne et renvoie soit la version propre, soit la liste des problèmes. */
export function validateRow(r: ImportRow): { clean?: CleanRow; errors: string[] } {
  const errors: string[] = [];
  const number = r.number.trim();
  const client_name = r.client_name.trim();
  const client_email = r.client_email.trim();
  const amount_cents = parseAmount(r.amount);
  const due_date = parseDate(r.due_date);
  if (!number) errors.push("numéro manquant");
  if (!client_name) errors.push("client manquant");
  if (!EMAIL.test(client_email)) errors.push(client_email ? "e-mail invalide" : "e-mail manquant");
  if (amount_cents === null) errors.push("montant invalide");
  if (!due_date) errors.push("échéance invalide");
  if (errors.length) return { errors };
  return { clean: { number, client_name, client_email, amount_cents: amount_cents!, due_date: due_date! }, errors };
}

/* ---------- Lecture des fichiers ---------- */

/** Découpe un CSV (séparateur ; , ou tabulation détecté automatiquement, guillemets gérés). */
export function parseCsv(text: string): string[][] {
  text = text.replace(/^﻿/, "");
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const sep = [";", "\t", ","].sort((a, b) => firstLine.split(b).length - firstLine.split(a).length)[0];
  const rows: string[][] = [];
  let row: string[] = [], cell = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === sep) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function cellValue(v: ExcelJS.CellValue): unknown {
  if (v === null || v === undefined) return "";
  if (v instanceof Date || typeof v === "number" || typeof v === "string") return v;
  if (typeof v === "object") {
    if ("result" in v) return (v as ExcelJS.CellFormulaValue).result ?? ""; // formule
    if ("text" in v) return (v as { text: string }).text; // lien hypertexte
    if ("richText" in v) return (v as ExcelJS.CellRichTextValue).richText.map((t) => t.text).join("");
  }
  return String(v);
}

/** Lit la première feuille d'un fichier .xlsx. */
export async function parseXlsx(buffer: ArrayBuffer): Promise<unknown[][]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const ws = wb.worksheets[0];
  if (!ws) return [];
  const rows: unknown[][] = [];
  ws.eachRow({ includeEmpty: false }, (row) => {
    const values = (row.values as ExcelJS.CellValue[]).slice(1).map(cellValue);
    if (values.some((v) => String(v).trim() !== "")) rows.push(values);
  });
  return rows;
}

const asText = (v: unknown) =>
  v instanceof Date ? (parseDate(v) ?? "") : typeof v === "number" ? String(v).replace(".", ",") : String(v ?? "").trim();

/** Transforme un tableau (en-tête + lignes) en lignes de factures. */
export function tableToRows(table: unknown[][]): { rows: ImportRow[]; missing: string[] } {
  if (table.length < 2) return { rows: [], missing: ["Le fichier ne contient aucune ligne de facture."] };
  const map = mapHeaders(table[0].map((h) => String(h ?? "")));
  const labels: Record<Field, string> = {
    number: "numéro de facture", client_name: "client", client_email: "e-mail",
    amount: "montant", due_date: "échéance",
  };
  const missing = (Object.keys(labels) as Field[]).filter((f) => map[f] === undefined).map((f) => labels[f]);
  if (missing.length) return { rows: [], missing };
  const rows = table.slice(1, MAX_ROWS + 1).map((r, i) => {
    const due = r[map.due_date!];
    return {
      number: asText(r[map.number!]),
      client_name: asText(r[map.client_name!]),
      client_email: asText(r[map.client_email!]),
      amount: asText(r[map.amount!]),
      due_date: (due instanceof Date || typeof due === "number" ? parseDate(due) : parseDate(due)) ?? asText(due),
      source: `ligne ${i + 2}`,
    };
  });
  return { rows, missing: [] };
}
