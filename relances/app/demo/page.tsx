import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { STEPS, dayLabel, daysLate, nextReminder, renderEmail, type Invoice, type Profile } from "@/lib/reminders";
import { AppShell } from "../app-shell";
import { InvoiceList } from "../invoice-list";
import { HeroCard, PerfSection, toRow } from "../dashboard-parts";

export const dynamic = "force-dynamic"; // les dates d'exemple suivent le jour présent

export const metadata: Metadata = {
  title: `Démo — ${BRAND.name}`,
  description: `Essayez ${BRAND.name} sans inscription : un compte d'exemple avec de vraies relances, des factures payées et en retard.`,
  alternates: { canonical: "/demo" },
};

/** Compte de démonstration : données d'exemple, jamais enregistrées ni envoyées. */
const PROFILE: Profile = { company_name: "Plomberie Martin", iban: "FR7630006000011234567890189", remind_before: true };

const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const ts = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

function demoInvoices(): Invoice[] {
  // [n°, client, e-mail, montant, échéance (jours), payée (jours) ou null, relances envoyées]
  const raw: [string, string, string, number, number, number | null, number[]][] = [
    ["F-031", "SARL Leroy", "compta@leroy.fr", 320000, -18, null, [1, 2, 3]],
    ["F-042", "Boulangerie Dupont", "contact@boulangerie-dupont.fr", 125000, -9, null, [1, 2]],
    ["F-045", "Mairie de Saint-Genis", "factures@mairie.fr", 99000, -2, null, [1]],
    ["F-047", "Garage Bernard", "garage.bernard@orange.fr", 45000, 4, null, []],
    ["F-048", "Café du Port", "cafeduport@gmail.com", 23000, 12, null, []],
    ["F-028", "Hôtel des Alpes", "direction@hoteldesalpes.fr", 210000, -40, -25, [1, 2]],
    ["F-033", "Pharmacie Centrale", "pharma.centrale@free.fr", 78000, -30, -28, [1]],
    ["F-036", "Restaurant Le Lys", "lelys@restaurant.fr", 64000, -20, -12, [1, 2]],
    ["F-021", "Cabinet Morel", "contact@cabinet-morel.fr", 150000, -70, -55, [1]],
    ["F-015", "Boutique Lina", "lina@boutique.fr", 98000, -100, -88, [1, 2, 3]],
  ];
  return raw.map(([number, client_name, client_email, amount_cents, due, paidAt, steps], i) => ({
    id: i + 1,
    user_id: "demo",
    number,
    client_name,
    client_email,
    amount_cents,
    due_date: day(due),
    status: paidAt === null ? "pending" : "paid",
    paid_at: paidAt === null ? null : ts(paidAt),
    created_at: ts(due - 30),
    pay_token: "demo",
    pdf_path: "demo",
    reminders: steps.map((step) => ({ step, sent_at: ts(due + (STEPS.find((s) => s.step === step)?.daysAfterDue ?? 0)) })),
  }));
}

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f } = await searchParams;
  const invoices = demoInvoices();
  const pending = invoices.filter((i) => i.status === "pending");
  // Facture dont on montre la relance : celle choisie dans la liste, sinon la première en retard.
  const selected = invoices.find((i) => String(i.id) === f && i.status === "pending") ?? pending.find((i) => daysLate(i.due_date) > 0)!;
  const next = nextReminder(selected, PROFILE);
  const step = next?.step ?? Math.max(...selected.reminders.map((r) => r.step));
  const mail = renderEmail(selected, step, PROFILE);
  const stepLabel = STEPS.find((s) => s.step === step);

  return (
    <AppShell active="factures" demo>
      <div className="demo-banner">
        <span><b>Mode démo</b> : compte d&apos;exemple, rien n&apos;est enregistré ni envoyé. Cliquez sur une facture pour voir la relance.</span>
        <Link href="/login?mode=signup" className="demo-cta">Créer mon compte gratuit</Link>
      </div>

      <div className="page-head">
        <h1>Factures</h1>
      </div>

      <HeroCard invoices={invoices} />
      <PerfSection invoices={invoices} />

      <section className="card" id="apercu">
        <div className="demo-mail-head">
          <h2>Relance de {selected.client_name}</h2>
          {stepLabel && <span className="badge b-upcoming"><i className="badge-dot" />{stepLabel.label} · {dayLabel(stepLabel.daysAfterDue)}</span>}
        </div>
        <p className="muted small">
          {next ? `Partira automatiquement le ${new Date(next.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : "Dernière relance envoyée"}{" "}
          à {selected.client_email} · De : {PROFILE.company_name} · Pièce jointe : Facture {selected.number}.pdf
        </p>
        <div className="demo-mail">
          <p className="demo-mail-subject">{mail.subject}</p>
          <pre className="mail-preview">{mail.text.replace(/https?:\/\/\S+\/payer\/demo/g, `${"encaissez.fr"}/payer/…`)}</pre>
        </div>
      </section>

      <section className="card" id="factures">
        <InvoiceList rows={invoices.map((i) => toRow(i, PROFILE))} demo />
      </section>

      <section className="card demo-end">
        <div>
          <h2>Prêt à essayer avec vos factures ?</h2>
          <p className="muted">Gratuit jusqu&apos;à {BRAND.freeInvoices} factures en cours, sans carte bancaire. Votre compte est prêt en 2 minutes.</p>
        </div>
        <Link href="/login?mode=signup" className="demo-cta">Créer mon compte gratuit</Link>
      </section>
    </AppShell>
  );
}
