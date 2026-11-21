import "server-only"; // ce fichier manipule des clés secrètes : interdit dans le navigateur
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { ImportRow } from "./import";

// Champs à extraire d'une facture PDF. null quand l'information n'est pas sur le document.
const InvoiceFields = z.object({
  is_invoice: z.boolean().describe("true si le document est bien une facture"),
  number: z.string().nullable().describe("Numéro de la facture"),
  client_name: z.string().nullable().describe("Nom ou raison sociale du client facturé (le destinataire, pas l'émetteur)"),
  client_email: z.string().nullable().describe("Adresse e-mail du client facturé, si elle figure sur la facture"),
  amount_ttc: z.number().nullable().describe("Montant total TTC à payer, en euros, ex. 1250.5"),
  due_date: z.string().nullable().describe("Date d'échéance de paiement au format AAAA-MM-JJ"),
  invoice_date: z.string().nullable().describe("Date d'émission de la facture au format AAAA-MM-JJ"),
  payment_terms_days: z.number().nullable().describe("Délai de paiement en jours si indiqué sans date (ex. « 30 jours »)"),
});

const SYSTEM = `Tu extrais les informations d'une facture française pour un outil de relance des impayés.
Le client est le destinataire de la facture (la personne qui doit payer), jamais l'entreprise qui l'émet.
Le montant est le total TTC restant à payer. Les dates sont au format AAAA-MM-JJ.
Si une information n'apparaît pas sur le document, renvoie null : n'invente rien.`;

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic()); // lit ANTHROPIC_API_KEY

export const pdfImportAvailable = () => Boolean(process.env.ANTHROPIC_API_KEY);

const addDays = (isoDate: string, days: number) => {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Lit une facture PDF avec Claude et renvoie une ligne à vérifier avant import. */
export async function extractInvoiceFromPdf(fileName: string, pdf: ArrayBuffer): Promise<ImportRow> {
  const base: ImportRow = { number: "", client_name: "", client_email: "", amount: "", due_date: "", source: fileName };
  try {
    const response = await getClient().beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      // Si le modèle principal décline la demande, l'API la relance sur un modèle de repli.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      output_config: { effort: "low", format: betaZodOutputFormat(InvoiceFields) },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: Buffer.from(pdf).toString("base64") },
            },
            { type: "text", text: "Extrais les informations de cette facture." },
          ],
        },
      ],
    });

    if (response.stop_reason === "refusal") return { ...base, errors: ["lecture refusée par l'IA"] };
    const f = response.parsed_output;
    if (!f) return { ...base, errors: ["lecture impossible"] };
    if (!f.is_invoice) return { ...base, errors: ["ce PDF ne ressemble pas à une facture"] };

    let due = f.due_date ?? "";
    if (!due && f.invoice_date && f.payment_terms_days) due = addDays(f.invoice_date, f.payment_terms_days);

    return {
      ...base,
      number: f.number ?? "",
      client_name: f.client_name ?? "",
      client_email: f.client_email ?? "",
      amount: f.amount_ttc != null ? f.amount_ttc.toFixed(2).replace(".", ",") : "",
      due_date: due,
    };
  } catch (e) {
    let msg = "erreur de lecture";
    if (e instanceof Anthropic.AuthenticationError) msg = "clé API Anthropic invalide";
    else if (e instanceof Anthropic.RateLimitError) msg = "trop de demandes, réessayez dans une minute";
    else if (e instanceof Anthropic.BadRequestError) msg = "PDF illisible ou trop volumineux";
    else if (e instanceof Anthropic.APIError) msg = `service IA indisponible (${e.status})`;
    console.error("Extraction PDF", fileName, e);
    return { ...base, errors: [msg] };
  }
}
