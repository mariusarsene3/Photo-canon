import Link from "next/link";
import { DEFAULT_TEMPLATES, PLACEHOLDERS, STEPS, dayLabel, templateFor, type Profile } from "@/lib/reminders";
import { AppShell } from "../app-shell";
import { Toast } from "../toast";
import { TemplateEditor } from "./template-editor";
import { RemindToggle } from "./remind-toggle";

type Props = {
  email?: string;
  ok?: string;
  err?: string;
  profile: Profile;
  ready: boolean;
  remindBefore: boolean;
  vars: Record<string, string>;
};

/** Affichage de la page « Mes relances ». */
export function RelancesView({ email, ok, err, profile, ready, remindBefore, vars }: Props) {
  return (
    <AppShell active="relances" email={email}>
      <div className="relances-page">
        <h1>Mes relances</h1>
        <p className="muted">Ce que reçoivent vos clients, et quand. Vous pouvez changer chaque texte : tutoiement, signature, numéro de téléphone…</p>
        <Toast message={ok} />
        {err && <p className="alert err">{err}</p>}
        {!ready && <p className="alert err">Fonction pas encore activée : appliquez la migration 007 dans Supabase.</p>}

        <section className="card">
          <h2>Le scénario</h2>
          <ol className="flow">
            {STEPS.map((s) => {
              const off = s.step === 0 && !remindBefore;
              return (
                <li key={s.step} className={off ? "off" : ""}>
                  <span className="flow-day">{dayLabel(s.daysAfterDue)}</span>
                  <div className="flow-text">
                    <b>{s.label}</b>
                    <small className="muted">
                      {s.step === 0
                        ? "3 jours avant l'échéance, pour être payé à l'heure. Facultatif."
                        : `${s.daysAfterDue} jour${s.daysAfterDue > 1 ? "s" : ""} après l'échéance, si la facture n'est pas payée.`}
                    </small>
                  </div>
                  {s.step === 0 && ready && <RemindToggle on={remindBefore} />}
                  <a href={`#etape-${s.step}`} className="flow-edit">Modifier le texte</a>
                </li>
              );
            })}
          </ol>
          <p className="muted small">
            Les relances s&apos;arrêtent dès que vous marquez la facture comme payée ou que vous les mettez en pause. Si vous avez
            ajouté la facture en PDF, elle est jointe à chaque e-mail. Votre client voit « {profile.company_name || "votre entreprise"} » comme expéditeur, et s&apos;il
            répond, la réponse arrive dans votre boîte mail ({email ?? "l'adresse de votre compte"}).
          </p>
        </section>

        {STEPS.map((s) => {
          const custom = !!profile.templates?.[String(s.step)];
          return (
            <details key={s.step} className="card tpl-card" id={`etape-${s.step}`}>
              <summary className="summary-title">
                <span className="flow-day">{dayLabel(s.daysAfterDue)}</span> {s.label}
                {custom && <span className="badge b-paid"><i className="badge-dot" />Personnalisé</span>}
              </summary>
              {ready ? (
                <TemplateEditor
                  step={s.step}
                  initial={templateFor(s.step, profile)}
                  isCustom={custom}
                  vars={vars}
                  placeholders={PLACEHOLDERS}
                />
              ) : (
                <pre className="mail-preview">{DEFAULT_TEMPLATES[s.step].body}</pre>
              )}
            </details>
          );
        })}

        {!profile.company_name && (
          <p className="muted small">
            Astuce : indiquez le nom de votre entreprise dans <Link href="/compte#entreprise">Mon compte</Link> pour signer vos relances.
          </p>
        )}
      </div>
    </AppShell>
  );
}
