import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const alt = `${BRAND.name} : vos factures impayées relancées automatiquement`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image d'aperçu affichée quand on partage un lien du site (WhatsApp, LinkedIn, Facebook…). */
const font = (w: number) =>
  readFile(join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${w}-normal.woff`));

export default async function Image() {
  const [regular, bold] = await Promise.all([font(400), font(800)]);
  const rows = [
    { name: "SARL Leroy", amount: "3 200 €", label: "Dernier avis envoyé", color: "#b42318" },
    { name: "Boulangerie Dupont", amount: "1 250 €", label: "Rappel envoyé", color: "#b42318" },
    { name: "Café du Port", amount: "480 €", label: "Payée", color: "#067647" },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0b0f", color: "#fff", padding: 64, fontFamily: "Inter" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{BRAND.name}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Vos clients ne paient pas ?</div>
            <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#4ade80" }}>On les relance pour vous.</div>
            <div style={{ fontSize: 26, color: "#a1a1aa", marginTop: 24 }}>Rappel à J+1, relance à J+7, dernier avis à J+15.</div>
          </div>
          <div style={{ fontSize: 24, color: "#d4d4d8" }}>{`${BRAND.price} € HT/mois · ${BRAND.trialDays} jours gratuits`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 48, width: 424 }}>
          <div style={{ display: "flex", flexDirection: "column", background: "#fff", color: "#111", borderRadius: 24, padding: 28 }}>
            <div style={{ fontSize: 18, color: "#71717a" }}>À encaisser</div>
            <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>4 930 €</div>
            {rows.map((r) => (
              <div key={r.name} style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e4e4e7", padding: "12px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800 }}>
                  <span>{r.name}</span>
                  <span>{r.amount}</span>
                </div>
                <div style={{ fontSize: 16, color: r.color, marginTop: 4 }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 800, style: "normal" },
      ],
    },
  );
}
