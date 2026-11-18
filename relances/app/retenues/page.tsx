import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { euros } from "@/lib/reminders";
import { claimLetter, daysUntilRelease, frLong, releaseDate, type Guarantee } from "@/lib/guarantees";
import { SubmitButton } from "../submit-button";
import { CopyButton } from "../payer/[token]/copy-button";
import { addGuarantee, deleteGuarantee, markReleased, sendClaim, toInvoice } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Retenues de garantie — ${BRAND.name}` };

function Status({ g }: { g: Guarantee }) {
  if (g.status === "released") return <span className="badge ok">Récupérée ✓</span>;
  if (g.invoice_id) return <span className="badge late">Relancée comme facture</span>;
  if (g.status === "claimed") return <span className="badge">Demande envoyée</span>;
  const days = daysUntilRelease(g.reception_date);
  if (days <= 0) return <span className="badge late">À réclamer maintenant</span>;
  if (days <= 30) return <span className="badge warn-badge">Dans {days} j</span>;
  return <span className="badge">Dans {days} j</span>;
}

export default async function Retenues({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const supabase = await createClient();
  const [{ data, error }, { data: prof }] = await Promise.all([
    supabase.from("guarantees").select("*").order("reception_date", { ascending: true }),
    supabase.from("profiles").select("company_name, iban").maybeSingle(),
  ]);
  const list = (data ?? []) as Guarantee[];
  const waiting = list.filter((g) => g.status !== "released");
  const claimable = waiting.filter((g) => daysUntilRelease(g.reception_date) <= 0);
  const sum = (a: Guarantee[]) => euros(a.reduce((s, g) => s + g.amount_cents, 0));
  const released = list.filter((g) => g.status === "released");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="rg-page">
      <p><Link href="/">← Tableau de bord</Link></p>
      <h1>Retenues de garantie</h1>
      <p className="muted">
        Les 5 % retenus sur vos chantiers doivent vous être rendus un an après la réception des travaux. {BRAND.name} vous
        prévient 30 jours avant et le jour J, et envoie la demande à votre client.
      </p>
      {ok && <p className="alert ok">{ok}</p>}
      {err && <p className="alert err">{err}</p>}

      {error ? (
        <p className="alert err">Fonctionnalité pas encore activée : appliquez la migration 005 dans Supabase.</p>
      ) : (
        <>
          <section className="stats">
            <div className="stat"><span>En attente</span><strong>{sum(waiting)}</strong><em>{waiting.length} chantier(s)</em></div>
            <div className="stat warn"><span>À réclamer maintenant</span><strong>{sum(claimable)}</strong><em>{claimable.length} chantier(s)</em></div>
            <div className="stat good"><span>Récupéré</span><strong>{sum(released)}</strong></div>
          </section>

          <section className="card">
            <h2>Ajouter une retenue</h2>
            <form action={addGuarantee} className="grid">
              <input name="site" placeholder="Chantier (ex. Rénovation cuisine, 12 rue…)" required />
              <input name="client_name" placeholder="Client (maître d'ouvrage)" required />
              <input name="client_email" type="email" placeholder="E-mail du client" />
              <input name="contract_amount" inputMode="decimal" placeholder="Montant des travaux (€) — facultatif" />
              <input name="amount" inputMode="decimal" placeholder="Montant retenu (€) — sinon 5 %" />
              <label className="field-inline">
                <span className="muted small">Date de réception des travaux</span>
                <input name="reception_date" type="date" max={today} required />
              </label>
              <select name="kind" defaultValue="retenue" aria-label="Type de garantie">
                <option value="retenue">Somme retenue par le client</option>
                <option value="caution">Caution bancaire</option>
              </select>
              <SubmitButton pending="Ajout…">Ajouter</SubmitButton>
            </form>
            <p className="muted small">
              Indiquez le montant des travaux ou le montant retenu : sans montant retenu, {BRAND.name} calcule 5 %.
            </p>
          </section>

          {list.length === 0 ? (
            <p className="muted">Aucune retenue enregistrée pour l&apos;instant.</p>
          ) : (
            <section className="rg-list">
              {list.map((g) => {
                const days = daysUntilRelease(g.reception_date);
                const letter = claimLetter(g, prof?.company_name ?? "", prof?.iban ?? "");
                const open = g.status !== "released";
                return (
                  <article key={g.id} className={`card rg-item${g.status === "released" ? " dim" : ""}`}>
                    <div className="row">
                      <div>
                        <h3>{g.site}</h3>
                        <p className="muted small">
                          {g.client_name}{g.client_email ? ` · ${g.client_email}` : ""} · {g.kind === "caution" ? "Caution bancaire" : "Somme retenue"}
                        </p>
                      </div>
                      <div className="rg-amount">
                        <strong>{euros(g.amount_cents)}</strong>
                        <Status g={g} />
                      </div>
                    </div>
                    <p className="small">
                      Réception le {frLong(g.reception_date)} → libérable le <b>{frLong(releaseDate(g.reception_date))}</b>
                    </p>

                    {open && (
                      <div className="rg-actions">
                        {days <= 0 && g.client_email && g.status === "waiting" && (
                          <form action={sendClaim}><input type="hidden" name="id" value={g.id} />
                            <SubmitButton className="small" pending="Envoi…">Envoyer la demande au client</SubmitButton>
                          </form>
                        )}
                        {days <= 0 && !g.invoice_id && g.client_email && (
                          <form action={toInvoice}><input type="hidden" name="id" value={g.id} />
                            <SubmitButton className="small secondary" pending="…">Pas payé ? Relancer automatiquement</SubmitButton>
                          </form>
                        )}
                        <form action={markReleased}><input type="hidden" name="id" value={g.id} />
                          <SubmitButton className="small secondary" pending="…">Récupérée ✓</SubmitButton>
                        </form>
                        <form action={deleteGuarantee}><input type="hidden" name="id" value={g.id} />
                          <SubmitButton className="small ghost" title="Supprimer">✕</SubmitButton>
                        </form>
                      </div>
                    )}
                    {open && days > 0 && (
                      <p className="muted small">La demande pourra être envoyée à partir du {frLong(releaseDate(g.reception_date))}. Vous serez prévenu par e-mail.</p>
                    )}

                    {open && (
                      <details className="rg-letter">
                        <summary>Voir la lettre de demande</summary>
                        <p className="muted small">Objet : {letter.subject}</p>
                        <pre>{letter.body}</pre>
                        <CopyButton value={`Objet : ${letter.subject}\n\n${letter.body}`} label="Copier la lettre" />
                      </details>
                    )}
                  </article>
                );
              })}
            </section>
          )}

          <p className="muted small">
            Rappel : la retenue est libérée un an après la réception, même sans mainlevée, sauf si le client a notifié
            avant cette date une opposition motivée par lettre recommandée (loi n° 71-584 du 16 juillet 1971).
          </p>
        </>
      )}
    </main>
  );
}
