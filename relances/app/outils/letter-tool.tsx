"use client";

import { useMemo, useState } from "react";
import { miseEnDemeure, relanceLetter, type LetterInput } from "@/lib/letters";
import { defaultPenaltyRate } from "@/lib/rates";

const blank: LetterInput = {
  senderName: "", senderAddress: "", clientName: "", clientAddress: "",
  invoiceNumber: "", invoiceDate: "", dueDate: "", amount: 0, city: "", clientType: "pro",
};

/** Générateur de lettre : relance (cordiale ou ferme) ou mise en demeure. Tout est calculé dans le navigateur. */
export function LetterTool({ kind }: { kind: "relance" | "mise-en-demeure" }) {
  const [i, setI] = useState<LetterInput>(blank);
  const [tone, setTone] = useState<"amical" | "ferme">("amical");
  const [delay, setDelay] = useState(8);
  const [rate, setRate] = useState(defaultPenaltyRate());
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof LetterInput>(k: K, val: LetterInput[K]) => setI((p) => ({ ...p, [k]: val }));
  const letter = useMemo(
    () => (kind === "relance" ? relanceLetter(i, tone) : miseEnDemeure(i, { delayDays: delay, penaltyRate: rate })),
    [i, tone, delay, rate, kind],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* presse-papiers indisponible */ }
  };

  const field = (k: keyof LetterInput, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="tool-field">
      <span>{label}</span>
      <input
        value={k === "amount" ? (i.amount || "") : String(i[k])}
        onChange={(e) => set(k, (k === "amount" ? Number(e.target.value.replace(",", ".")) || 0 : e.target.value) as never)}
        {...props}
      />
    </label>
  );

  return (
    <div className="tool">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Le client est…</legend>
          <div className="tool-seg">
            <button type="button" className={i.clientType === "pro" ? "on" : ""} onClick={() => set("clientType", "pro")}>Un professionnel</button>
            <button type="button" className={i.clientType === "particulier" ? "on" : ""} onClick={() => set("clientType", "particulier")}>Un particulier</button>
          </div>
        </fieldset>

        {kind === "relance" && (
          <fieldset>
            <legend>Ton de la lettre</legend>
            <div className="tool-seg">
              <button type="button" className={tone === "amical" ? "on" : ""} onClick={() => setTone("amical")}>1er rappel (cordial)</button>
              <button type="button" className={tone === "ferme" ? "on" : ""} onClick={() => setTone("ferme")}>2e relance (ferme)</button>
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend>Vous</legend>
          {field("senderName", "Votre entreprise", { placeholder: "Plomberie Martin", autoComplete: "organization" })}
          {field("senderAddress", "Votre adresse", { placeholder: "12 rue des Lilas, 69003 Lyon" })}
          {field("city", "Ville (pour la date)", { placeholder: "Lyon" })}
        </fieldset>

        <fieldset>
          <legend>Le client</legend>
          {field("clientName", "Nom du client", { placeholder: "Boulangerie Dupont" })}
          {field("clientAddress", "Adresse du client", { placeholder: "5 place du Marché, 69002 Lyon" })}
        </fieldset>

        <fieldset>
          <legend>La facture</legend>
          {field("invoiceNumber", "Numéro", { placeholder: "F-2026-042" })}
          {field("amount", "Montant TTC (€)", { inputMode: "decimal", placeholder: "1250" })}
          <div className="tool-2col">
            {field("invoiceDate", "Date de la facture", { type: "date" })}
            {field("dueDate", "Date d'échéance", { type: "date" })}
          </div>
        </fieldset>

        {kind === "mise-en-demeure" && (
          <fieldset>
            <legend>Conditions</legend>
            <div className="tool-2col">
              <label className="tool-field">
                <span>Délai pour payer (jours)</span>
                <input type="number" min={1} max={60} value={delay} onChange={(e) => setDelay(Number(e.target.value) || 8)} />
              </label>
              {i.clientType === "pro" && (
                <label className="tool-field">
                  <span>Taux des pénalités (%)</span>
                  <input inputMode="decimal" value={rate} onChange={(e) => setRate(Number(e.target.value.replace(",", ".")) || 0)} />
                </label>
              )}
            </div>
            {i.clientType === "pro" && (
              <p className="tool-hint">
                Par défaut : taux de vos CGV, ou à défaut le taux légal ({defaultPenaltyRate().toLocaleString("fr-FR")} %).
              </p>
            )}
          </fieldset>
        )}
      </form>

      <div className="tool-result">
        <div className="tool-result-bar">
          <span>Votre lettre</span>
          <div>
            <button type="button" className="lp-btn lp-btn-sm" onClick={copy}>{copied ? "Copiée ✓" : "Copier"}</button>
            <button type="button" className="tool-ghost" onClick={() => window.print()}>Imprimer / PDF</button>
          </div>
        </div>
        <pre className="tool-letter">{letter.body}</pre>
        {kind === "mise-en-demeure" && (
          <p className="tool-hint">À envoyer en <b>lettre recommandée avec accusé de réception</b> : c&apos;est la preuve qui compte en cas de procédure.</p>
        )}
      </div>
    </div>
  );
}
