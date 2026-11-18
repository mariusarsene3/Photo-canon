import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { euros, frDate } from "@/lib/reminders";
import { cleanIban, formatIban, isValidIban, sepaQrSvg } from "@/lib/payment";
import { CopyButton } from "./copy-button";
import { Avatar } from "../../invoice-list";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Régler une facture", robots: { index: false } };

type PayInfo = {
  number: string;
  client_name: string;
  amount_cents: number;
  due_date: string;
  status: "pending" | "paid";
  company_name: string;
  iban: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!UUID.test(token)) notFound();

  const supabase = await createClient();
  const { data } = await supabase.rpc("invoice_for_payment", { p_token: token });
  const inv = (data as PayInfo[] | null)?.[0];
  if (!inv) notFound();

  const company = inv.company_name || "Votre fournisseur";
  const amount = (inv.amount_cents / 100).toFixed(2).replace(".", ",");
  const reference = `Facture ${inv.number}`;
  const hasIban = isValidIban(inv.iban);
  const qr = hasIban
    ? await sepaQrSvg({ name: company, iban: inv.iban, amountCents: inv.amount_cents, reference })
    : null;

  return (
    <div className="pay-wrap">
    <main className="pay">
      <header className="pay-head">
        <Avatar name={company} size={48} />
        <div>
          <p className="pay-from">{company}</p>
          <h1>Facture n° {inv.number}</h1>
        </div>
      </header>

      {inv.status === "paid" ? (
        <div className="pay-paid">
          <span aria-hidden>✓</span>
          <h2>Facture réglée</h2>
          <p className="muted">Merci ! Aucune action n&apos;est nécessaire.</p>
        </div>
      ) : (
        <>
          <div className="pay-amount">
            <span>Montant à régler</span>
            <strong>{euros(inv.amount_cents)}</strong>
            <span>Échéance : {frDate(inv.due_date)} · {inv.client_name}</span>
          </div>

          {hasIban ? (
            <section className="card pay-card">
              <h2>Payer par virement</h2>
              <dl className="pay-fields">
                <div>
                  <dt>Bénéficiaire</dt>
                  <dd>{company}</dd>
                  <CopyButton value={company} />
                </div>
                <div>
                  <dt>IBAN</dt>
                  <dd className="mono">{formatIban(inv.iban)}</dd>
                  <CopyButton value={cleanIban(inv.iban)} />
                </div>
                <div>
                  <dt>Montant</dt>
                  <dd>{amount} €</dd>
                  <CopyButton value={amount} />
                </div>
                <div>
                  <dt>Référence</dt>
                  <dd>{reference}</dd>
                  <CopyButton value={reference} />
                </div>
              </dl>

              {qr && (
                <div className="pay-qr">
                  <div className="pay-qr-img" dangerouslySetInnerHTML={{ __html: qr }} />
                  <p className="muted small">
                    Sur ordinateur : scannez ce QR code avec l&apos;application de votre banque pour pré-remplir le
                    virement (toutes les banques ne le prennent pas en charge).
                  </p>
                </div>
              )}
            </section>
          ) : (
            <p className="alert err">
              Les coordonnées bancaires ne sont pas renseignées. Merci de contacter {company} pour régler cette
              facture.
            </p>
          )}

          <p className="muted small pay-note">Si vous avez déjà effectué le paiement, merci de ne pas tenir compte des relances.</p>
        </>
      )}
      <footer className="pay-foot">
        <span>🔒 Page sécurisée</span>
        <span>Lien de paiement envoyé par {company} via {BRAND.name}</span>
      </footer>
    </main>
    </div>
  );
}
