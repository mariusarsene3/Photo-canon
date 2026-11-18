import { createClient } from "@/lib/supabase/server";
import { STEPS, daysLate, euros, type Invoice, type Profile } from "@/lib/reminders";
import { addInvoice, deleteInvoice, markPaid, saveSettings, sendNow } from "./actions";
import { logout } from "./login/actions";

export const dynamic = "force-dynamic";

function Status({ inv }: { inv: Invoice }) {
  if (inv.status === "paid") return <span className="badge ok">Payée</span>;
  const late = daysLate(inv.due_date);
  if (late < 0) return <span className="badge">À venir · J{late}</span>;
  if (late === 0) return <span className="badge">Échéance aujourd&apos;hui</span>;
  const last = Math.max(0, ...inv.reminders.map((r) => r.step));
  const label = STEPS.find((s) => s.step === last)?.label;
  return (
    <span className="badge late">
      {late} j de retard{label ? ` · ${label} envoyé` : ""}
    </span>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: inv }, { data: prof }] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, reminders(step, sent_at)")
      .order("status", { ascending: false })
      .order("due_date", { ascending: true }),
    supabase.from("profiles").select("company_name, iban").maybeSingle(),
  ]);
  const invoices = (inv ?? []) as Invoice[];
  const profile = (prof ?? { company_name: "", iban: "" }) as Profile;
  const pending = invoices.filter((i) => i.status === "pending");
  const overdue = pending.filter((i) => daysLate(i.due_date) > 0);
  const paid = invoices.filter((i) => i.status === "paid");
  const sum = (a: typeof invoices) => euros(a.reduce((s, i) => s + i.amount_cents, 0));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main>
      <header className="row">
        <div>
          <h1>Relances</h1>
          <p className="muted">Vos factures impayées relancées automatiquement à J+1, J+7 et J+15.</p>
        </div>
        <form action={logout} className="account">
          <span className="muted small">{user?.email}</span>
          <button className="small ghost">Se déconnecter</button>
        </form>
      </header>

      <section className="stats">
        <div className="stat"><span>À encaisser</span><strong>{sum(pending)}</strong></div>
        <div className="stat warn"><span>En retard</span><strong>{sum(overdue)}</strong><em>{overdue.length} facture(s)</em></div>
        <div className="stat good"><span>Récupéré</span><strong>{sum(paid)}</strong></div>
      </section>

      <section className="card">
        <h2>Nouvelle facture</h2>
        <form action={addInvoice} className="grid">
          <input name="number" placeholder="N° facture (ex. F-2026-042)" required />
          <input name="client_name" placeholder="Nom du client" required />
          <input name="client_email" type="email" placeholder="E-mail du client" required />
          <input name="amount" inputMode="decimal" placeholder="Montant TTC (€)" required />
          <input name="due_date" type="date" defaultValue={today} required />
          <button type="submit">Ajouter</button>
        </form>
      </section>

      <section className="card">
        <div className="row">
          <h2>Factures</h2>
          <form action={sendNow}><button className="secondary">Envoyer les relances dues maintenant</button></form>
        </div>
        {invoices.length === 0 ? (
          <p className="muted">Aucune facture pour l&apos;instant. Ajoutez-en une ci-dessus.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>N°</th><th>Client</th><th className="num">Montant</th><th>Échéance</th><th>Statut</th><th></th></tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className={i.status === "paid" ? "dim" : ""}>
                    <td>{i.number}</td>
                    <td>{i.client_name}<div className="muted small">{i.client_email}</div></td>
                    <td className="num">{euros(i.amount_cents)}</td>
                    <td>{new Date(i.due_date + "T00:00:00").toLocaleDateString("fr-FR")}</td>
                    <td><Status inv={i} /></td>
                    <td><div className="actions">
                      {i.status === "pending" && (
                        <form action={markPaid}><input type="hidden" name="id" value={i.id} /><button className="small">Payée ✓</button></form>
                      )}
                      <form action={deleteInvoice}><input type="hidden" name="id" value={i.id} /><button className="small ghost" title="Supprimer">✕</button></form>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Paramètres</h2>
        <form action={saveSettings} className="grid">
          <input name="company_name" placeholder="Nom de votre entreprise (signature)" defaultValue={profile.company_name} />
          <input name="iban" placeholder="IBAN (affiché dans les relances)" defaultValue={profile.iban} />
          <button type="submit" className="secondary">Enregistrer</button>
        </form>
        <p className="muted small">
          Scénario : {STEPS.map((s) => `${s.label} (J+${s.daysAfterDue})`).join(" → ")}
        </p>
      </section>
    </main>
  );
}
