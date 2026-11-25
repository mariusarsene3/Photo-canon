import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

// Image affichée quand on partage le site (Facebook, WhatsApp, LinkedIn, Google Discover…).
export const alt = `${BRAND.name} : est-ce que ChatGPT recommande votre commerce ? Test gratuit`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (w: number) => readFile(join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${w}-normal.woff`));

export default async function OgImage() {
  const [semi, extra] = await Promise.all([font(600), font(800)]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffd84d", padding: 64, color: "#111", fontFamily: "Inter" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 800 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: 14, background: "#111", color: "#ffd84d" }}>R</div>
          {BRAND.name}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>
          Est-ce que ChatGPT recommande votre commerce ?
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", background: "#111", color: "#fff", fontSize: 32, fontWeight: 800, padding: "16px 30px", borderRadius: 999 }}>Faire le test gratuit</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>1 minute · sans inscription</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semi, weight: 600, style: "normal" },
        { name: "Inter", data: extra, weight: 800, style: "normal" },
      ],
    },
  );
}
