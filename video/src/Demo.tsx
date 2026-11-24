import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Vidéo de démonstration de la page d'accueil (1920×1080, 16 s), dans la DA du site :
 * fond blanc, vert en accent, de vrais écrans du produit, des animations douces.
 * 1. Une facture en retard  2. Encaissez relance à votre place  3. Le client paie en un clic  4. Fin
 */
const C = {
  bg: "#ffffff",
  soft: "#f6f8f6",
  line: "#e6e9e6",
  ink: "#14211a",
  muted: "#5f6b64",
  green: "#15803d",
  greenBright: "#22c55e",
  greenSoft: "#ecf7ef",
  deep: "#0f2a1d",
  amber: "#b45309",
  amberSoft: "#fef3c7",
};
const FONT = "Inter, system-ui, sans-serif";

export const DEMO_SCENES = { late: [0, 105], relance: [105, 255], paid: [255, 375], end: [375, 480] } as const;
export const DEMO_DURATION = 480;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.25, 1, 0.5, 1);
const lerp = (f: number, i: number[], o: number[]) => interpolate(f, i, o, { ...clamp, easing: ease });

function useIn(start: number, damping = 22) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - start, fps, config: { damping, mass: 0.9, stiffness: 110 } });
}

/** Apparition douce : fondu + légère montée. */
function rise(p: number, dist = 30): React.CSSProperties {
  return { opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * dist}px)` };
}

/** Sortie de scène : fondu sur les dernières images. */
function useOut(duration: number, len = 12) {
  const f = useCurrentFrame();
  return { opacity: lerp(f, [duration - len, duration], [1, 0]) };
}

function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flex: "none" }}>
      <rect width="64" height="64" rx="16" fill={C.greenBright} />
      <rect x="12" y="18" width="40" height="29" rx="6" fill="#fff" />
      <path d="M14 21l18 13 18-13" stroke={C.green} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="47" cy="45" r="11" fill={C.deep} />
      <path d="M42 45l3.5 3.5 6.5-7" stroke={C.greenBright} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Titre de scène à gauche, avec un mot en vert. */
function Title({ start, kicker, lines }: { start: number; kicker: string; lines: React.ReactNode[] }) {
  const k = useIn(start);
  return (
    <div style={{ position: "absolute", left: 140, top: 330, width: 720, fontFamily: FONT }}>
      <div style={{ ...rise(k, 16), fontSize: 30, fontWeight: 600, color: C.green, marginBottom: 22 }}>{kicker}</div>
      {lines.map((l, i) => {
        const p = useIn(start + 6 + i * 6);
        return (
          <div key={i} style={{ ...rise(p), fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.06, color: C.ink }}>
            {l}
          </div>
        );
      })}
    </div>
  );
}

const card: React.CSSProperties = {
  position: "absolute", background: "#fff", border: `2px solid ${C.line}`, borderRadius: 28,
  boxShadow: "0 40px 80px -40px rgba(15,42,29,.30)", fontFamily: FONT, color: C.ink,
};

function Badge({ tone, children }: { tone: "late" | "ok" | "info"; children: React.ReactNode }) {
  const s = tone === "late" ? { background: C.amberSoft, color: C.amber } : tone === "ok" ? { background: C.greenSoft, color: C.green } : { background: C.soft, color: C.muted };
  return <span style={{ ...s, borderRadius: 999, padding: "8px 20px", fontSize: 26, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>;
}

/* 1. La facture en retard */
function Late() {
  const dur = DEMO_SCENES.late[1] - DEMO_SCENES.late[0];
  const p = useIn(10);
  return (
    <AbsoluteFill style={useOut(dur)}>
      <Title start={0} kicker="Une facture en retard ?" lines={["Ça arrive", <>à tout le <span style={{ color: C.green }}>monde.</span></>]} />
      <div style={{ ...card, left: 1000, top: 290, width: 780, padding: "48px 56px", ...rise(p, 60) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>Facture F-042</span>
          <Badge tone="late">12 jours de retard</Badge>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>Boulangerie Dupont</div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, margin: "10px 0 14px" }}>1 250,00 €</div>
        <div style={{ fontSize: 28, color: C.muted }}>Échéance : 31 octobre</div>
      </div>
    </AbsoluteFill>
  );
}

/* 2. Les relances partent toutes seules */
const STEPS = [
  { day: "J+1", label: "Rappel amical", at: 40 },
  { day: "J+7", label: "Relance ferme", at: 70 },
  { day: "J+15", label: "Dernier avis", at: 100 },
];

function Relance() {
  const dur = DEMO_SCENES.relance[1] - DEMO_SCENES.relance[0];
  const f = useCurrentFrame();
  const mail = useIn(14);
  return (
    <AbsoluteFill style={useOut(dur)}>
      <Title start={0} kicker="Encaissez s'en occupe" lines={["On relance", <>à votre <span style={{ color: C.green }}>place.</span></>]} />
      {/* E-mail reçu par le client */}
      <div style={{ ...card, left: 1000, top: 150, width: 780, ...rise(mail, 60), overflow: "hidden" }}>
        <div style={{ padding: "26px 40px", borderBottom: `2px solid ${C.line}`, background: C.soft, fontSize: 26 }}>
          <div><span style={{ color: C.muted, display: "inline-block", width: 110 }}>De</span><b>Plomberie Martin</b></div>
          <div style={{ marginTop: 8 }}><span style={{ color: C.muted, display: "inline-block", width: 110 }}>Objet</span><b>Petit rappel : facture F-042</b></div>
        </div>
        <div style={{ padding: "28px 40px", fontSize: 26, lineHeight: 1.55, color: "#2c3a32" }}>
          Bonjour,<br />
          Sauf erreur de notre part, la facture F-042 de 1 250,00 € n'a pas encore été réglée. Si le paiement est déjà parti, ne tenez pas compte de ce message.
          <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
            <span style={{ background: C.deep, color: "#fff", borderRadius: 14, padding: "14px 26px", fontWeight: 700 }}>Payer la facture</span>
            <span style={{ border: `2px solid ${C.line}`, borderRadius: 14, padding: "12px 22px", fontWeight: 600, color: C.muted }}>📎 Facture F-042.pdf</span>
          </div>
        </div>
      </div>
      {/* Calendrier des relances */}
      <div style={{ position: "absolute", left: 1000, top: 720, width: 780, display: "flex", gap: 18, fontFamily: FONT }}>
        {STEPS.map((s) => {
          const p = useIn(s.at);
          const done = f >= s.at + 8;
          return (
            <div key={s.day} style={{ flex: 1, ...rise(p, 24), background: done ? C.greenSoft : "#fff", border: `2px solid ${done ? "#bfe5ca" : C.line}`, borderRadius: 20, padding: "20px 22px" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: done ? C.green : C.muted }}>{done ? "✓ " : ""}{s.day}</div>
              <div style={{ fontSize: 24, color: C.ink, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* 3. Le client paie, la facture passe à « Payée » */
function Paid() {
  const dur = DEMO_SCENES.paid[1] - DEMO_SCENES.paid[0];
  const f = useCurrentFrame();
  const p = useIn(8);
  const isPaid = f >= 50;
  const pop = useIn(50, 14);
  return (
    <AbsoluteFill style={useOut(dur)}>
      <Title start={0} kicker="Le client paie en un clic" lines={["Et vous êtes", <span key="p" style={{ color: C.green }}>payé.</span>]} />
      <div style={{ ...card, left: 1000, top: 290, width: 780, padding: "48px 56px", ...rise(p, 60), borderColor: isPaid ? "#bfe5ca" : C.line }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>Facture F-042</span>
          <span style={{ transform: isPaid ? `scale(${0.85 + pop * 0.15})` : "none", display: "inline-block" }}>
            {isPaid ? <Badge tone="ok">Payée ✓</Badge> : <Badge tone="info">Relance envoyée</Badge>}
          </span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>Boulangerie Dupont</div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, margin: "10px 0 14px", color: isPaid ? C.green : C.ink }}>1 250,00 €</div>
        <div style={{ fontSize: 28, color: C.muted }}>{isPaid ? "Payée le 14 novembre · les relances s'arrêtent" : "Lien de paiement envoyé avec la relance"}</div>
      </div>
      {isPaid && (
        <div style={{ ...card, left: 1080, top: 790, width: 620, padding: "22px 28px", display: "flex", gap: 20, alignItems: "center", borderRadius: 22, ...rise(pop, 30) }}>
          <Logo size={64} />
          <div style={{ fontSize: 26 }}>
            <div style={{ fontWeight: 700 }}>Facture payée</div>
            <div style={{ color: C.muted }}>Boulangerie Dupont a réglé 1 250,00 €</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

/* 4. Fin */
function End() {
  const logo = useIn(0);
  const t = useIn(10);
  const cta = useIn(22);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, textAlign: "center" }}>
      <div style={rise(logo, 30)}><Logo size={140} /></div>
      <div style={{ ...rise(t), fontSize: 110, fontWeight: 800, letterSpacing: -4, color: C.ink, marginTop: 30 }}>Encaissez</div>
      <div style={{ ...rise(t), fontSize: 38, color: C.muted, marginTop: 6 }}>Relance de factures impayées pour artisans et indépendants</div>
      <div style={{ ...rise(cta), display: "flex", gap: 22, alignItems: "center", marginTop: 56 }}>
        <span style={{ background: C.deep, color: "#fff", borderRadius: 18, padding: "26px 46px", fontSize: 38, fontWeight: 700 }}>Essai gratuit 14 jours</span>
        <span style={{ fontSize: 38, fontWeight: 700, color: C.green }}>encaissez.fr</span>
      </div>
    </AbsoluteFill>
  );
}

export function Demo() {
  const S = DEMO_SCENES;
  const seq = (k: keyof typeof S) => ({ from: S[k][0], durationInFrames: S[k][1] - S[k][0] });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1400px 700px at 85% 0%, ${C.greenSoft}, transparent 60%), ${C.bg}` }}>
      <Sequence {...seq("late")}><Late /></Sequence>
      <Sequence {...seq("relance")}><Relance /></Sequence>
      <Sequence {...seq("paid")}><Paid /></Sequence>
      <Sequence {...seq("end")}><End /></Sequence>
    </AbsoluteFill>
  );
}
