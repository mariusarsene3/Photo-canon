import "server-only"; // ce fichier manipule des clés secrètes : interdit dans le navigateur
/** Envoi d'un e-mail texte via Resend. Sans clé (développement), l'e-mail est affiché dans la console. */
export type Attachment = { filename: string; content: string }; // contenu en base64

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  opts: { replyTo?: string; attachments?: Attachment[] } = {},
) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    const files = opts.attachments?.length ? `\nPièces jointes : ${opts.attachments.map((a) => a.filename).join(", ")}` : "";
    console.log(`\n📧 [simulation] À: ${to}\nObjet: ${subject}${files}\n\n${text}\n`);
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
