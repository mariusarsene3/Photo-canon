import QRCode from "qrcode";

/** Adresse publique du site (pour les liens dans les e-mails). */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // Fournie automatiquement par Vercel : le domaine de production.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const paymentUrl = (token: string) => `${siteUrl()}/payer/${token}`;

export const cleanIban = (iban: string) => iban.replace(/\s+/g, "").toUpperCase();

/** Format lisible : FR76 3000 6000 0112 3456 7890 189 */
export const formatIban = (iban: string) => cleanIban(iban).replace(/(.{4})/g, "$1 ").trim();

/** Contrôle de validité d'un IBAN (clé ISO 13616, modulo 97). */
export function isValidIban(iban: string): boolean {
  const v = cleanIban(iban);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(v)) return false;
  const moved = v.slice(4) + v.slice(0, 4);
  const digits = moved.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const d of digits) rem = (rem * 10 + Number(d)) % 97;
  return rem === 1;
}

/**
 * QR code de virement SEPA (norme EPC069-12, « QR code Girocode »).
 * Certaines applications bancaires le lisent et pré-remplissent le virement.
 */
export async function sepaQrSvg(opts: { name: string; iban: string; amountCents: number; reference: string }) {
  const payload = [
    "BCD",
    "002",
    "1", // UTF-8
    "SCT",
    "", // BIC facultatif dans la version 002
    opts.name.slice(0, 70),
    cleanIban(opts.iban),
    `EUR${(opts.amountCents / 100).toFixed(2)}`,
    "",
    "",
    opts.reference.slice(0, 140),
  ].join("\n");
  return QRCode.toString(payload, { type: "svg", errorCorrectionLevel: "M", margin: 1 });
}
