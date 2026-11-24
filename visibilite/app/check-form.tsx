"use client";
import { useActionState, useEffect, useState } from "react";
import { checkAction, type CheckState } from "./actions";
import { Report } from "./report";

const STEPS = [
  "On pose la question à l'IA, comme un client…",
  "L'IA cherche sur Internet…",
  "On lit sa réponse…",
  "On repère qui elle recommande…",
];

function Progress() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 9000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="progress" role="status">
      <span className="spinner" aria-hidden />
      <div>
        <strong>{STEPS[i]}</strong>
        <p>Comptez 30 secondes à 1 minute.</p>
      </div>
    </div>
  );
}

export function CheckForm() {
  const [state, action, pending] = useActionState<CheckState, FormData>(checkAction, {});
  const v = state.values ?? {};
  return (
    <>
      <form action={action} className="card form">
        <label>
          Nom de votre commerce
          <input name="business" defaultValue={v.business} placeholder="ex. : Les Fleurs de Marie" required maxLength={80} />
        </label>
        <div className="form-row">
          <label>
            Votre activité
            <input name="trade" defaultValue={v.trade} placeholder="ex. : un fleuriste" required maxLength={60} />
          </label>
          <label>
            Ville
            <input name="city" defaultValue={v.city} placeholder="ex. : Nancy" required maxLength={60} />
          </label>
        </div>
        <button type="submit" disabled={pending}>
          {pending ? "Analyse en cours…" : "Est-ce que ChatGPT me recommande ?"}
        </button>
        <p className="form-meta">Gratuit · sans inscription · résultat en 1 minute</p>
        {state.error && !pending && <p className="error">{state.error}</p>}
      </form>
      {pending && <Progress />}
      {state.result && !pending && <Report result={state.result} />}
    </>
  );
}
