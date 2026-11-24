"use client";
import { useActionState } from "react";
import { leadAction, type LeadState } from "./actions";
import { BRAND } from "@/lib/brand";

type Props = { business: string; trade: string; city: string; cited: boolean | null };

export function LeadForm({ business, trade, city, cited }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(leadAction, {});
  if (state.ok) {
    return (
      <div className="lead-done" role="status">
        <strong>C&apos;est noté ✅</strong>
        <p>On vous recontacte sous 48 h pour votre audit offert. Pas de démarchage, pas d&apos;engagement.</p>
      </div>
    );
  }
  return (
    <form action={action} className="lead-form">
      <input type="hidden" name="business" value={business} />
      <input type="hidden" name="trade" value={trade} />
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="cited" value={cited === null ? "" : cited ? "oui" : "non"} />
      {/* Champ piège : invisible pour les personnes, rempli par les robots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
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
          Un mot sur votre commerce <span className="opt">(facultatif)</span>
        </span>
        <textarea name="message" rows={2} maxLength={1000} placeholder="ex. : on fait aussi les mariages, on livre autour de…" />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Recevoir mon audit offert"}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      <p className="fine">
        Vos coordonnées servent uniquement à vous recontacter pour l&apos;audit. <a href="/confidentialite">Confidentialité</a> ·
        Mise en place ensuite : {BRAND.offer.setup} € une fois, si vous le souhaitez.
      </p>
    </form>
  );
}
