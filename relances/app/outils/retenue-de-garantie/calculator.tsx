"use client";

import { useState } from "react";
import { daysUntilRelease, frLong, releaseDate } from "@/lib/guarantee-dates";
import { eur } from "@/lib/rates";

const num = (s: string) => Number(s.replace(/\s/g, "").replace(",", ".")) || 0;

export function GuaranteeCalculator() {
  const [reception, setReception] = useState("");
  const [works, setWorks] = useState("");
  const [rate, setRate] = useState("5");
  const [site, setSite] = useState("");
  const [company, setCompany] = useState("");
  const [copied, setCopied] = useState(false);

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(reception);
  const release = valid ? releaseDate(reception) : "";
  const days = valid ? daysUntilRelease(reception) : 0;
  const r = Math.min(num(rate), 5);
  const amount = Math.round(num(works) * r) / 100;

  const letter = valid
    ? [
        "Madame, Monsieur,",
        "",
        `Les travaux que nous avons réalisés${site ? ` (${site})` : ""} ont fait l'objet d'une réception le ${frLong(reception)}.`,
        "",
        `Le délai d'un an prévu par l'article 1er de la loi n° 71-584 du 16 juillet 1971 ${days > 0 ? "expirera" : "a expiré"} le ${frLong(release)}. ` +
          "Sauf opposition motivée de votre part notifiée par lettre recommandée avant cette date, la retenue de garantie doit nous être libérée.",
        "",
        `Nous vous remercions de bien vouloir nous restituer la somme de ${amount > 0 ? eur(amount) : "[montant]"} ` +
          (days > 0 ? "à cette date" : "dans les meilleurs délais") + ", par virement sur le compte suivant : [votre IBAN].",
        "",
        "Nous restons à votre disposition pour toute question.",
        "",
        "Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.",
        "",
        company || "[Votre entreprise]",
      ].join("\n")
    : "";

  async function copy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="tool">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Le chantier</legend>
          <label className="tool-field">
            <span>Date de réception des travaux</span>
            <input type="date" value={reception} onChange={(e) => setReception(e.target.value)} />
          </label>
          <div className="tool-2col">
            <label className="tool-field">
              <span>Montant des travaux TTC (€)</span>
              <input inputMode="decimal" placeholder="24000" value={works} onChange={(e) => setWorks(e.target.value)} />
            </label>
            <label className="tool-field">
              <span>Taux de la retenue (%)</span>
              <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
            </label>
          </div>
          {num(rate) > 5 && <p className="tool-warn">La retenue de garantie est plafonnée à 5 % : c&apos;est ce taux qui est retenu.</p>}
        </fieldset>
        <fieldset>
          <legend>Pour la lettre (facultatif)</legend>
          <label className="tool-field">
            <span>Chantier</span>
            <input placeholder="Rénovation salle de bain, 12 rue des Lilas" value={site} onChange={(e) => setSite(e.target.value)} />
          </label>
          <label className="tool-field">
            <span>Votre entreprise</span>
            <input placeholder="Plomberie Martin" value={company} onChange={(e) => setCompany(e.target.value)} />
          </label>
        </fieldset>
      </form>

      <div className="tool-result">
        <div className="tool-result-bar"><span>Votre retenue de garantie</span></div>
        {valid ? (
          <>
            <div className="tool-calc">
              <div className="tool-calc-row"><span>Réception des travaux</span><b>{frLong(reception)}</b></div>
              <div className="tool-calc-row tool-calc-total"><span>Date de libération</span><b>{frLong(release)}</b></div>
              <div className="tool-calc-row">
                <span>{days > 0 ? "Encore" : "Statut"}</span>
                <b>{days > 0 ? `${days} jour${days > 1 ? "s" : ""}` : "Récupérable dès maintenant"}</b>
              </div>
              {amount > 0 && <div className="tool-calc-row"><span>Montant à récupérer ({r.toLocaleString("fr-FR")} %)</span><b>{eur(amount)}</b></div>}
              <p className="tool-hint">
                Un an après la réception, avec ou sans réserves (loi n° 71-584 du 16 juillet 1971), sauf opposition motivée
                du client envoyée en recommandé avant cette date.
              </p>
            </div>
            <div className="tool-result-bar">
              <span>Demande de restitution</span>
              <div>
                <button type="button" className="lp-btn lp-btn-sm" onClick={copy}>{copied ? "Copiée ✓" : "Copier"}</button>
                <button type="button" className="tool-ghost" onClick={() => window.print()}>Imprimer / PDF</button>
              </div>
            </div>
            <pre className="tool-letter">{letter}</pre>
          </>
        ) : (
          <p className="tool-empty">Indiquez la date de réception des travaux pour voir la date de libération.</p>
        )}
      </div>
    </div>
  );
}
