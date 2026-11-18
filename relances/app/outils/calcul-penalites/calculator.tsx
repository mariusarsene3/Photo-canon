"use client";

import { useState } from "react";
import { RATES, daysBetween, defaultPenaltyRate, eur, minimumPenaltyRate, pct, penalties } from "@/lib/rates";

type RateMode = "defaut" | "cgv" | "minimum";

export function PenaltyCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [paid, setPaid] = useState(today);
  const [mode, setMode] = useState<RateMode>("defaut");
  const [cgvRate, setCgvRate] = useState("");

  const amountNum = Number(amount.replace(/\s/g, "").replace(",", ".")) || 0;
  const rate =
    mode === "defaut" ? defaultPenaltyRate()
    : mode === "minimum" ? minimumPenaltyRate()
    : Number(cgvRate.replace(",", ".")) || 0;
  const days = due ? daysBetween(due, paid) : 0;
  const cgvTooLow = mode === "cgv" && rate > 0 && rate < minimumPenaltyRate();
  const effRate = cgvTooLow ? minimumPenaltyRate() : rate; // le minimum légal s'applique toujours
  const pen = penalties(amountNum, effRate, days);
  const fee = days > 0 && amountNum > 0 ? RATES.recoveryFee : 0;
  const ready = amountNum > 0 && !!due;

  return (
    <div className="tool">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>La facture</legend>
          <label className="tool-field">
            <span>Montant TTC (€)</span>
            <input inputMode="decimal" placeholder="1250" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <div className="tool-2col">
            <label className="tool-field">
              <span>Date d&apos;échéance</span>
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </label>
            <label className="tool-field">
              <span>Date de paiement (ou aujourd&apos;hui)</span>
              <input type="date" value={paid} onChange={(e) => setPaid(e.target.value || today)} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Taux des pénalités</legend>
          <div className="tool-radios">
            <label>
              <input type="radio" name="mode" checked={mode === "defaut"} onChange={() => setMode("defaut")} />
              <span><b>Taux légal par défaut : {pct(defaultPenaltyRate())}</b><small>Taux BCE ({pct(RATES.bceRate)}) + 10 points, si vos CGV ne prévoient rien</small></span>
            </label>
            <label>
              <input type="radio" name="mode" checked={mode === "cgv"} onChange={() => setMode("cgv")} />
              <span><b>Taux prévu dans mes CGV</b><small>Celui indiqué sur vos factures</small></span>
            </label>
            {mode === "cgv" && (
              <label className="tool-field tool-inline">
                <span>Taux annuel (%)</span>
                <input inputMode="decimal" placeholder="10" value={cgvRate} onChange={(e) => setCgvRate(e.target.value)} />
              </label>
            )}
            <label>
              <input type="radio" name="mode" checked={mode === "minimum"} onChange={() => setMode("minimum")} />
              <span><b>Taux minimum légal : {pct(minimumPenaltyRate())}</b><small>3 fois le taux d&apos;intérêt légal ({pct(RATES.legalRatePro)})</small></span>
            </label>
          </div>
          {cgvTooLow && <p className="tool-warn">Ce taux est inférieur au minimum légal ({pct(minimumPenaltyRate())}) : c&apos;est le minimum qui s&apos;applique.</p>}
        </fieldset>
      </form>

      <div className="tool-result">
        <div className="tool-result-bar"><span>Ce que votre client vous doit</span></div>
        {ready ? (
          <div className="tool-calc">
            <div className="tool-calc-row"><span>Jours de retard</span><b>{days}</b></div>
            <div className="tool-calc-row"><span>Montant de la facture</span><b>{eur(amountNum)}</b></div>
            <div className="tool-calc-row"><span>Pénalités de retard ({pct(effRate)})</span><b>{eur(pen)}</b></div>
            <div className="tool-calc-row"><span>Indemnité forfaitaire de recouvrement</span><b>{eur(fee)}</b></div>
            <div className="tool-calc-row tool-calc-total">
              <span>Total réclamable</span>
              <b>{eur(amountNum + pen + fee)}</b>
            </div>
            <p className="tool-hint">
              Calcul : {eur(amountNum)} × {pct(effRate)} × {days} / 365 jours. Valable entre
              professionnels (art. L441-10 du Code de commerce). Taux du {RATES.period}.
            </p>
            {days === 0 && <p className="tool-hint">La facture n&apos;est pas encore en retard à cette date : aucune pénalité.</p>}
          </div>
        ) : (
          <p className="tool-empty">Indiquez le montant et la date d&apos;échéance pour voir le calcul.</p>
        )}
      </div>
    </div>
  );
}
