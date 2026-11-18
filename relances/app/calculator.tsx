"use client";

import { useState } from "react";

const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });

/** Petit simulateur : combien de mois d'abonnement une facture récupérée rembourse. */
export function Calculator({ price }: { price: number }) {
  const [amount, setAmount] = useState(800);
  const months = Math.floor(amount / price);

  return (
    <div className="lp-calc">
      <label htmlFor="calc-amount">Montant d&apos;une facture impayée</label>
      <output className="lp-calc-amount">{fmt(amount)} €</output>
      <input
        id="calc-amount"
        type="range"
        min={100}
        max={5000}
        step={50}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <p className="lp-calc-result">
        La récupérer paie <strong>{months} mois</strong> d&apos;abonnement
        {months >= 12 ? <> — soit <strong>{Math.floor(months / 12)} an{months >= 24 ? "s" : ""}</strong></> : null}.
      </p>
    </div>
  );
}
