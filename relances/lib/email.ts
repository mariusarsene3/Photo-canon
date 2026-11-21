import "server-only"; // ce fichier manipule des clés secrètes : interdit dans le navigateur
import { BRAND } from "./brand";
/** Envoi d'un e-mail texte via Resend. Sans clé (développement), l'e-mail est affiché dans la console. */
export type Attachment = { filename: string; content: string }; // contenu en base64

/** Nom d'expéditeur sûr : pas de guillemets, chevrons ni retours à la ligne (ils casseraient l'en-tête). */
const cleanName = (s: string) => s.replace(/["<>\\\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);

/**
 * Adresse d'expédition. Avec fromName, le client voit « Plomberie Martin via Encaissez »,
 * mais l'adresse technique reste celle d'EMAIL_FROM (seule autorisée à envoyer pour le domaine).
 */
export function fromHeader(emailFrom: string, fromName?: string) {
  const name = fromName ? cleanName(fromName) : "";
  if (!name) return emailFrom;
  const address = emailFrom.match(/<([^>]+)>/)?.[1] ?? emailFrom.trim();
  return `"${name} via ${BRAND.name}" <${address}>`;
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  opts: { replyTo?: string; fromName?: string; attachments?: Attachment[] } = {},
) {
  const key = process.env.RESEND_API_KEY;
  const from = fromHeader(process.env.EMAIL_FROM || `${BRAND.name} <relances@example.com>`, opts.fromName);
  if (!key || !process.env.EMAIL_FROM) {
    const files = opts.attachments?.length ? `\nPièces jointes : ${opts.attachments.map((a) => a.filename).join(", ")}` : "";
    const reply = opts.replyTo ? `\nRépondre à : ${opts.replyTo}` : "";
    console.log(`\n📧 [simulation] De : ${from}\nÀ : ${to}${reply}\nObjet : ${subject}${files}\n\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text, ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
