/** Envoi d'un e-mail texte via Resend. Sans clé (développement), l'e-mail est affiché dans la console. */
export async function sendEmail(to: string, subject: string, text: string, opts: { replyTo?: string } = {}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.log(`\n📧 [simulation] À: ${to}\nObjet: ${subject}\n\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text, ...(opts.replyTo ? { reply_to: opts.replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
