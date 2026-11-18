"use client";

import { useEffect, useRef, useState } from "react";
import type { MonthPoint } from "@/lib/stats";

const fmt = (cents: number) => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const tick = (euros: number) => (euros >= 10_000 ? `${Math.round(euros / 1000)} k€` : `${euros.toLocaleString("fr-FR")} €`);

/** Arrondit le maximum de l'axe à un nombre « propre » (1, 2, 2,5, 5 × 10ⁿ). */
function niceMax(v: number) {
  if (v <= 0) return 1000;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

/**
 * Montants récupérés par mois : une seule série → colonnes, sans légende (le titre la nomme).
 * Couleur : vert de la palette catégorielle (validé contre les surfaces claire et sombre).
 */
export function RecoveredChart({ points }: { points: MonthPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  // Le graphique est dessiné à la largeur réelle de son conteneur : le texte garde sa taille sur mobile.
  const ref = useRef<HTMLElement>(null);
  const [W, setW] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 480 ? 190 : 230, padL = 52, padR = 8, padT = 28, padB = 28;
  const maxEuros = niceMax(Math.max(...points.map((p) => p.cents / 100)));
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const band = plotW / points.length;
  const barW = Math.min(24, band * 0.55);
  const y = (euros: number) => padT + plotH - (euros / maxEuros) * plotH;
  const ticks = [0, maxEuros / 2, maxEuros];
  const best = points.reduce((b, p, i) => (p.cents > points[b].cents ? i : b), 0);
  const last = points.length - 1;
  const hasData = points.some((p) => p.cents > 0);

  return (
    <figure className="chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Montants récupérés par mois : ${points.map((p) => `${p.long} ${fmt(p.cents)}`).join(", ")}`}>
        {/* Grille : traits fins, discrets */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} className="chart-grid" />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" className="chart-tick">{tick(t)}</text>
          </g>
        ))}
        {points.map((p, i) => {
          const cx = padL + band * i + band / 2;
          const top = y(p.cents / 100);
          const h = Math.max(0, padT + plotH - top);
          const r = Math.min(4, h); // coin arrondi côté valeur, carré côté base
          const showLabel = p.cents > 0 && (i === best || i === last);
          return (
            <g key={p.key}>
              {h > 0 && (
                <path
                  className={`chart-bar${hover === i ? " on" : ""}`}
                  d={`M${cx - barW / 2},${padT + plotH} V${top + r} Q${cx - barW / 2},${top} ${cx - barW / 2 + r},${top} H${cx + barW / 2 - r} Q${cx + barW / 2},${top} ${cx + barW / 2},${top + r} V${padT + plotH} Z`}
                />
              )}
              {showLabel && <text x={cx} y={top - 8} textAnchor="middle" className="chart-value">{fmt(p.cents)}</text>}
              <text x={cx} y={H - 8} textAnchor="middle" className={`chart-x${i === last ? " now" : ""}`}>{p.label}</text>
              {/* Zone de survol plus large que la barre */}
              <rect
                x={padL + band * i} y={padT} width={band} height={plotH} fill="transparent"
                tabIndex={0} role="button" aria-label={`${p.long} : ${fmt(p.cents)}, ${p.count} facture(s)`}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)} onBlur={() => setHover(null)}
              />
            </g>
          );
        })}
        {!hasData && (
          <text x={padL + plotW / 2} y={padT + plotH / 2} textAnchor="middle" className="chart-empty">
            Les montants récupérés apparaîtront ici
          </text>
        )}
      </svg>

      {hover !== null && (
        <div
          className="chart-tip"
          style={{ left: `${((padL + band * hover + band / 2) / W) * 100}%`, top: `${(Math.min(y(points[hover].cents / 100), padT + plotH - 10) / H) * 100}%` }}
          role="status"
        >
          <b>{fmt(points[hover].cents)}</b>
          <span>{points[hover].long} · {points[hover].count} facture{points[hover].count > 1 ? "s" : ""}</span>
        </div>
      )}

      <details className="chart-table">
        <summary>Voir les données</summary>
        <table>
          <thead><tr><th>Mois</th><th className="num">Récupéré</th><th className="num">Factures</th></tr></thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.key}><td>{p.long}</td><td className="num">{fmt(p.cents)}</td><td className="num">{p.count}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
