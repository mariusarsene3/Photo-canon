"use client";
import { useActionState } from "react";
import { leadAction, type LeadState } from "./actions";
import { SERVICES } from "@/lib/services";

type Props = {
  /** Après un test : le commerce est déjà connu (champs cachés). Sans test (page contact) : champs visibles. */
  business?: string;
  trade?: string;
  city?: string;
  cited?: boolean | null;
  defaultInterests?: string[];
  submitLabel?: string;
};

export function LeadForm({ business, trade, city, cited = null, defaultInterests = ["visibilite"], submitLabel = "Je veux mon audit gratuit" }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(leadAction, {});
  const known = Boolean(business && trade && city);
  if (state.ok) {
    return (
      <div className="lead-done" role="status">
        <strong>C&apos;est noté.</strong>
        <p>Je vous recontacte sous 48 h. Sans engagement.</p>
      </div>
    );
  }
  return (
    <form action={action} className="lead-form">
      {known ? (
        <>
          <input type="hidden" name="business" value={business} />
          <input type="hidden" name="trade" value={trade} />
          <input type="hidden" name="city" value={city} />
        </>
      ) : (
        <>
          <label>
            Nom de votre commerce ou entreprise
            <input name="business" required maxLength={80} />
          </label>
          <div className="row">
            <label>
              Votre activité
              <input name="trade" required maxLength={60} placeholder="ex. : fleuriste" />
            </label>
            <label>
              Ville
              <input name="city" required maxLength={60} />
            </label>
          </div>
        </>
      )}
      <input type="hidden" name="cited" value={cited === null ? "" : cited ? "oui" : "non"} />
      {/* Champ piège : invisible pour les personnes, rempli par les robots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />

      <fieldset className="interests">
        <legend>Ce qui vous intéresse</legend>
        {SERVICES.map((s) => (
          <label key={s.id} className="check">
            <input type="checkbox" name="interests" value={s.id} defaultChecked={defaultInterests.includes(s.id)} />
            {s.name}
          </label>
        ))}
      </fieldset>

      <div className="row">
        <label>
          Votre prénom et nom
          <input name="contact_name" required maxLength={80} autoComplete="name" />
        </label>
        <label>
          Téléphone
          <input name="phone" type="tel" maxLength={25} autoComplete="tel" placeholder="06 12 34 56 78" />
        </label>
      </div>
      <label>
        <span>
          E-mail <span className="opt">(ou téléphone, au choix)</span>
        </span>
        <input name="email" type="email" maxLength={120} autoComplete="email" />
      </label>
      <label>
        <span>
          Un mot sur votre projet <span className="opt">(facultatif)</span>
        </span>
        <textarea name="message" rows={2} maxLength={900} placeholder="ex. : je n'ai pas de site, je voudrais plus de clients le week-end…" />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Envoi…" : submitLabel}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      <p className="fine">
        Vos coordonnées servent uniquement à ce que je vous recontacte. <a href="/confidentialite">Confidentialité</a>
      </p>
    </form>
  );
}
