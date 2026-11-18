import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";

/* ---------- Mise en page selon le format ---------- */
type Box = { left: number; width: number; top: number };
type Layout = {
  headline: Box & { fontSize: number };
  invoice: Box & { moveUp: number; shrink: number; settle: number };
  mails: Box & { scale: number };
  notif: Box;
  burst: { x: number; y: number }; // centre de l'onde de choc et des pièces
  endScale: number;
};
const LAYOUTS: Record<"vertical" | "wide", Layout> = {
  // 1080x1920 : réseaux sociaux
  vertical: {
    headline: { left: 90, width: 900, top: 230, fontSize: 98 },
    invoice: { left: 90, width: 900, top: 700, moveUp: -150, shrink: 0.82, settle: 20 },
    mails: { left: 90, width: 900, top: 1250, scale: 1 },
    notif: { left: 70, width: 940, top: 1330 },
    burst: { x: 540, y: 980 },
    endScale: 1,
  },
  // 1920x1080 : site web, YouTube — texte à gauche, animation à droite
  wide: {
    headline: { left: 130, width: 760, top: 330, fontSize: 92 },
    invoice: { left: 1010, width: 800, top: 170, moveUp: -110, shrink: 0.78, settle: -40 },
    mails: { left: 1010, width: 800, top: 520, scale: 0.86 },
    notif: { left: 990, width: 840, top: 640 },
    burst: { x: 1410, y: 380 },
    endScale: 0.82,
  },
};
const LayoutCtx = createContext<Layout>(LAYOUTS.vertical);
const useLayout = () => useContext(LayoutCtx);

/* ---------- Palette (même esprit que le site : sobre, un accent) ---------- */
const C = {
  bg: "#07070a",
  card: "#16161a",
  line: "#2c2c33",
  fg: "#f5f5f5",
  muted: "#9a9aa3",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
};
const FONT = "Inter, system-ui, sans-serif";

/* ---------- Découpage (en images, 30 i/s) ---------- */
const S1 = 0; // le problème
const S2 = 150; // les relances partent
const S3 = 330; // le paiement arrive
const S4 = 480; // écran de fin
const PAID = S3 + 55; // instant où la facture passe à « Payée »

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lerp = (f: number, input: number[], output: number[], e = ease) => interpolate(f, input, output, { ...clamp, easing: e });

/** Apparition (0 → 1) avec un léger rebond. */
function useEnter(start: number, damping = 16, mass = 0.8) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass } });
}

/* =====================================================================
   Décor : sol en grille 3D qui défile, halos colorés, vignette
   ===================================================================== */
function Background() {
  const f = useCurrentFrame();
  const paidGlow = lerp(f, [PAID - 5, PAID + 25], [0, 1]);
  const endFade = lerp(f, [S4 - 10, S4 + 20], [1, 0.35]);
  const hue = interpolate(paidGlow, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {/* Halos qui dérivent lentement ; ils virent au vert au paiement */}
      <div style={orb(260 + Math.sin(f / 40) * 80, 520 + Math.cos(f / 50) * 60, 900, hue > 0.5 ? C.green : "#4f46e5", 0.28 * endFade + 0.1 * paidGlow)} />
      <div style={orb(780 + Math.cos(f / 35) * 90, 1350 + Math.sin(f / 45) * 80, 1000, hue > 0.5 ? "#16a34a" : C.red, 0.18 * endFade + 0.12 * paidGlow)} />

      {/* Sol en perspective */}
      <div style={{ position: "absolute", inset: 0, perspective: 900, perspectiveOrigin: "50% 35%" }}>
        <div
          style={{
            position: "absolute", left: "-60%", right: "-60%", top: "52%", height: "120%",
            transform: "rotateX(72deg)", transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${C.line} 2px, transparent 2px), linear-gradient(90deg, ${C.line} 2px, transparent 2px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `0 ${(f * 3) % 120}px`,
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 60%, transparent 100%)",
            opacity: 0.55,
          }}
        />
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, #000 100%)", opacity: 0.85 }} />
    </AbsoluteFill>
  );
}

const orb = (x: number, y: number, size: number, color: string, opacity: number): React.CSSProperties => ({
  position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%",
  background: `radial-gradient(circle, ${color} 0%, transparent 65%)`, opacity, filter: "blur(40px)",
});

/* =====================================================================
   Typo cinétique : chaque mot arrive en 3D, du flou vers le net
   ===================================================================== */
type Word = { text: string; color?: string };

function Headline({ from, to, words }: { from: number; to: number; words: Word[] }) {
  const f = useCurrentFrame();
  const L = useLayout().headline;
  const out = lerp(f, [to - 14, to], [1, 0]);
  const outY = lerp(f, [to - 14, to], [0, -60]);
  return (
    <div
      style={{
        position: "absolute", left: L.left, width: L.width, top: L.top, perspective: 1000,
        fontFamily: FONT, fontWeight: 800, fontSize: L.fontSize, lineHeight: 1.05, letterSpacing: -3.5, color: C.fg,
        opacity: out, transform: `translateY(${outY}px)`, filter: `blur(${(1 - out) * 10}px)`,
      }}
    >
      {words.map((w, i) => (
        <AnimatedWord key={i} start={from + 4 + i * 4} {...w} />
      ))}
    </div>
  );
}

function AnimatedWord({ start, text, color }: { start: number } & Word) {
  const p = useEnter(start, 14, 0.7);
  return (
    <span
      style={{
        display: "inline-block", marginRight: 26, color: color ?? C.fg,
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - p) * 70}px) rotateX(${(1 - p) * -75}deg)`,
        transformOrigin: "50% 100%",
        filter: `blur(${(1 - Math.min(1, p)) * 14}px)`,
        textShadow: color ? `0 0 40px ${color}88` : "none",
      }}
    >
      {text}
    </span>
  );
}

/* =====================================================================
   Reflet lumineux qui balaie une carte
   ===================================================================== */
function Shine({ at }: { at: number }) {
  const f = useCurrentFrame();
  const x = lerp(f, [at, at + 22], [-60, 160], Easing.inOut(Easing.cubic));
  if (f < at || f > at + 24) return null;
  return (
    <div
      style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", overflow: "hidden",
        background: `linear-gradient(105deg, transparent ${x - 20}%, rgba(255,255,255,.22) ${x}%, transparent ${x + 20}%)`,
      }}
    />
  );
}

/* =====================================================================
   La facture : entrée en 3D, flottement, retournement au paiement
   ===================================================================== */
function Invoice() {
  const f = useCurrentFrame();
  const L = useLayout().invoice;
  const enter = useEnter(S1 + 16, 15, 1);

  // Position dans l'espace selon la scène
  const y = lerp(f, [S2, S2 + 28, S3 + 5, S3 + 35], [0, L.moveUp, L.moveUp, L.settle]);
  const scale = lerp(f, [S2, S2 + 28, S3 + 5, S3 + 35], [1, L.shrink, L.shrink, 0.95]);
  const out = lerp(f, [S4 - 14, S4], [1, 0]);
  const outZ = lerp(f, [S4 - 14, S4], [0, 600]);

  // Flottement continu + inclinaison qui suit la « caméra »
  const floatY = Math.sin(f / 18) * 10;
  const tiltX = 8 + Math.sin(f / 30) * 4;
  const tiltY = -10 + Math.cos(f / 26) * 6;

  // Retournement complet au paiement (l'état bascule à mi-course, face cachée)
  const flip = lerp(f, [PAID - 10, PAID + 14], [0, 360], Easing.inOut(Easing.cubic));
  const paid = f >= PAID + 1;
  const glow = lerp(f, [PAID, PAID + 20], [0, 1]);

  // Le compteur de retard grimpe, avec un petit sursaut à chaque changement
  const days = Math.round(lerp(f, [S1 + 45, S1 + 135], [1, 21], Easing.linear));
  const prevDays = Math.round(lerp(f - 1, [S1 + 45, S1 + 135], [1, 21], Easing.linear));
  const tick = days !== prevDays && f < S1 + 136 ? 1 : 0;

  return (
    <div style={{ position: "absolute", left: L.left, width: L.width, top: L.top, perspective: 1600 }}>
      <div
        style={{
          position: "relative",
          opacity: Math.min(1, enter * 1.2) * out,
          transform: [
            `translateY(${(1 - enter) * 300 + y + floatY}px)`,
            `translateZ(${(1 - enter) * -900 + outZ}px)`,
            `scale(${scale})`,
            `rotateX(${(1 - enter) * 55 + tiltX}deg)`,
            `rotateY(${(1 - enter) * -35 + tiltY + flip}deg)`,
          ].join(" "),
          transformStyle: "preserve-3d",
          background: `linear-gradient(160deg, #1d1d23, ${C.card})`,
          border: `2px solid ${paid ? C.green : C.line}`, borderRadius: 40,
          padding: "50px 54px", fontFamily: FONT, color: C.fg,
          boxShadow: paid
            ? `0 0 ${120 * glow}px ${C.green}66, 0 60px 120px -40px #000`
            : `0 60px 120px -40px #000, 0 0 60px ${C.red}${Math.round(20 + 15 * Math.sin(f / 6)).toString(16).padStart(2, "0")}`,
        }}
      >
        <Shine at={S1 + 34} />
        <Shine at={PAID + 14} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>Facture F-042</span>
          {paid ? (
            <span style={{ ...pill(C.green), transform: `scale(${0.7 + 0.3 * glow})`, boxShadow: `0 0 40px ${C.green}88` }}>Payée ✓</span>
          ) : (
            <span style={{ ...pill(C.red), transform: `scale(${1 + tick * 0.08}) rotate(${tick * (days % 2 ? 2 : -2)}deg)` }}>
              <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, background: C.red, marginRight: 12, boxShadow: `0 0 16px ${C.red}`, opacity: 0.5 + 0.5 * Math.sin(f / 4) }} />
              {days} jour{days > 1 ? "s" : ""} de retard
            </span>
          )}
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 30 }}>Boulangerie Dupont</div>
        <div
          style={{
            fontSize: 124, fontWeight: 800, letterSpacing: -4, marginTop: 6, fontVariantNumeric: "tabular-nums",
            color: paid ? C.green : C.fg, textShadow: paid ? `0 0 50px ${C.green}77` : "none",
          }}
        >
          1 250,00 €
        </div>
        <div style={{ fontSize: 32, color: C.muted, marginTop: 8 }}>Échéance : 31 mars</div>
      </div>
    </div>
  );
}

const pill = (color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", fontSize: 30, fontWeight: 700, color,
  border: `2px solid ${color}66`, background: `${color}1f`, padding: "12px 24px", borderRadius: 999,
});

/* =====================================================================
   Les relances : cartes qui arrivent en 3D, comme une pile
   ===================================================================== */
const MAILS = [
  { day: "J+1", label: "Rappel courtois", subject: "Petit rappel : facture F-042", color: "#a1a1aa" },
  { day: "J+7", label: "Relance ferme", subject: "Relance : facture F-042", color: C.amber },
  { day: "J+15", label: "Dernier avis", subject: "Dernier avis avant mise en demeure", color: C.red },
];

function Mails() {
  const f = useCurrentFrame();
  const L = useLayout().mails;
  const out = lerp(f, [S3, S3 + 16], [1, 0]);
  const outX = lerp(f, [S3, S3 + 16], [0, -500], Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: "absolute", left: L.left, width: L.width, top: L.top, display: "grid", gap: 26,
        perspective: 1400, opacity: out, transform: `translateX(${outX}px) scale(${L.scale})`, transformOrigin: "50% 0%",
      }}
    >
      {MAILS.map((m, i) => (
        <Mail key={m.day} start={S2 + 30 + i * 36} index={i} {...m} />
      ))}
    </div>
  );
}

function Mail({ start, index, day, label, subject, color }: { start: number; index: number; day: string; label: string; subject: string; color: string }) {
  const f = useCurrentFrame();
  const enter = useEnter(start, 14, 0.9);
  const sent = lerp(f, [start + 16, start + 24], [0, 1]);
  const ring = lerp(f, [start + 16, start + 34], [0, 1], Easing.out(Easing.cubic));
  const floatY = Math.sin((f + index * 20) / 20) * 5;
  return (
    <div
      style={{
        position: "relative", opacity: Math.min(1, enter * 1.3),
        transform: `translateX(${(1 - enter) * 700}px) translateZ(${(1 - enter) * -400}px) rotateY(${(1 - enter) * -70}deg) rotateX(${6}deg) translateY(${floatY}px)`,
        transformStyle: "preserve-3d",
        display: "flex", alignItems: "center", gap: 28,
        background: `linear-gradient(160deg, #1d1d23, ${C.card})`, border: `2px solid ${C.line}`, borderLeft: `6px solid ${color}`,
        borderRadius: 28, padding: "26px 30px", fontFamily: FONT, color: C.fg,
        boxShadow: "0 30px 60px -25px #000",
      }}
    >
      <Shine at={start + 6} />
      <div style={{ width: 120, flex: "none" }}>
        <div style={{ fontSize: 46, fontWeight: 800, color, letterSpacing: -1, textShadow: `0 0 24px ${color}66` }}>{day}</div>
        <div style={{ fontSize: 20, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      </div>
      <div style={{ flex: 1, fontSize: 30, fontWeight: 600, lineHeight: 1.25 }}>{subject}</div>
      <div style={{ position: "relative", fontSize: 28, fontWeight: 700, color: C.green, opacity: sent, transform: `scale(${0.6 + 0.4 * sent})`, whiteSpace: "nowrap" }}>
        {/* Onde autour de la validation */}
        <span
          style={{
            position: "absolute", left: "50%", top: "50%", width: 160, height: 160, marginLeft: -80, marginTop: -80,
            borderRadius: "50%", border: `3px solid ${C.green}`, opacity: (1 - ring) * 0.8, transform: `scale(${0.3 + ring * 1.2})`,
          }}
        />
        Envoyé ✓
      </div>
    </div>
  );
}

/* =====================================================================
   Paiement : notification en 3D, onde de choc, pluie de pièces €
   ===================================================================== */
function BankNotification() {
  const f = useCurrentFrame();
  const L = useLayout().notif;
  const enter = useEnter(S3 + 22, 13, 0.9);
  const out = lerp(f, [S4 - 14, S4], [1, 0]);
  return (
    <div style={{ position: "absolute", left: L.left, width: L.width, top: L.top, perspective: 1200 }}>
      <div
        style={{
          position: "relative", opacity: Math.min(1, enter * 1.5) * out,
          transform: `translateY(${(1 - enter) * -260}px) rotateX(${(1 - enter) * 80}deg) scale(${0.85 + 0.15 * enter})`,
          transformOrigin: "50% 0%",
          background: "linear-gradient(160deg, rgba(48,48,56,.97), rgba(30,30,36,.97))", borderRadius: 42, padding: "34px 38px",
          display: "flex", gap: 30, alignItems: "center", fontFamily: FONT, color: C.fg,
          border: `1px solid rgba(255,255,255,.08)`,
          boxShadow: `0 40px 80px -20px #000, 0 0 ${60 * enter}px ${C.green}33`,
        }}
      >
        <Shine at={S3 + 34} />
        <div style={{ width: 100, height: 100, borderRadius: 26, background: `linear-gradient(145deg, #4ade80, ${C.green})`, display: "grid", placeItems: "center", fontSize: 56, flex: "none", color: "#052e16", fontWeight: 800, boxShadow: `0 0 40px ${C.green}77` }}>
          €
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: C.muted, fontWeight: 600 }}>
            <span>BANQUE</span><span>maintenant</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 6 }}>Virement reçu</div>
          <div style={{ fontSize: 34, marginTop: 2 }}>
            <b style={{ color: C.green }}>+1 250,00 €</b> · Boulangerie Dupont
          </div>
        </div>
      </div>
    </div>
  );
}

function Shockwave() {
  const f = useCurrentFrame();
  const B = useLayout().burst;
  const p = lerp(f, [PAID, PAID + 30], [0, 1], Easing.out(Easing.cubic));
  if (f < PAID || f > PAID + 32) return null;
  return (
    <div
      style={{
        position: "absolute", left: B.x - 700, top: B.y - 700, width: 1400, height: 1400, borderRadius: "50%",
        border: `6px solid ${C.green}`, opacity: (1 - p) * 0.7, transform: `scale(${0.15 + p})`,
        boxShadow: `0 0 80px ${C.green}, inset 0 0 80px ${C.green}`,
      }}
    />
  );
}

/** Pièces « € » projetées en 3D au moment du paiement, puis retombant sous l'effet de la gravité. */
function CoinBurst() {
  const f = useCurrentFrame();
  const B = useLayout().burst;
  const t = f - PAID;
  if (t < 0 || t > 80) return null;
  const coins = Array.from({ length: 34 }, (_, i) => {
    const a = random(`a${i}`) * Math.PI * 2;
    const speed = 18 + random(`s${i}`) * 26;
    const vx = Math.cos(a) * speed;
    const vy = Math.sin(a) * speed - 22;
    const x = B.x + vx * t;
    const y = B.y + vy * t + 0.9 * t * t; // gravité
    const z = (random(`z${i}`) - 0.5) * 900;
    const spin = (random(`r${i}`) * 2 + 1) * t * 14;
    const size = 54 + random(`k${i}`) * 50;
    const fade = interpolate(t, [0, 6, 60, 80], [0, 1, 1, 0], clamp);
    return { i, x, y, z, spin, size, fade };
  });
  return (
    <AbsoluteFill style={{ perspective: 1200, pointerEvents: "none" }}>
      {coins.map((c) => (
        <div
          key={c.i}
          style={{
            position: "absolute", left: c.x - c.size / 2, top: c.y - c.size / 2, width: c.size, height: c.size,
            borderRadius: "50%", opacity: c.fade,
            transform: `translateZ(${c.z}px) rotateY(${c.spin}deg) rotateZ(${c.spin / 3}deg)`,
            background: "radial-gradient(circle at 35% 30%, #bbf7d0, #22c55e 55%, #15803d)",
            boxShadow: `0 0 24px ${C.green}88, inset -4px -6px 10px #14532d`,
            display: "grid", placeItems: "center", color: "#052e16", fontFamily: FONT, fontWeight: 800, fontSize: c.size * 0.55,
          }}
        >
          €
        </div>
      ))}
    </AbsoluteFill>
  );
}

/* =====================================================================
   Écran de fin : logo en relief, lettres en 3D, bouton lumineux
   ===================================================================== */
function EndCard() {
  const f = useCurrentFrame();
  const o = lerp(f, [S4, S4 + 12], [0, 1]);
  const line = useEnter(S4 + 30);
  const cta = useEnter(S4 + 44, 11);
  const pulse = 0.5 + 0.5 * Math.sin((f - S4) / 6);
  const letters = "Encaissez".split("");
  // Relief : ombres empilées qui donnent de l'épaisseur au logo
  const depth = Array.from({ length: 10 }, (_, i) => `0 ${i + 1}px 0 #1f3d2b`).join(", ");
  const camY = lerp(f, [S4, S4 + 120], [-14, 8], Easing.inOut(Easing.cubic));

  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", fontFamily: FONT, color: C.fg, textAlign: "center", perspective: 1400 }}>
      <div style={{ transform: `scale(${useLayout().endScale}) rotateY(${camY}deg) rotateX(8deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ fontSize: 168, fontWeight: 800, letterSpacing: -7, whiteSpace: "nowrap", position: "relative" }}>
          {letters.map((l, i) => (
            <Letter key={i} ch={l} start={S4 + 4 + i * 3} depth={depth} />
          ))}
          <Shine at={S4 + 40} />
        </div>
        <div style={{ fontSize: 46, color: C.muted, marginTop: 28, lineHeight: 1.3, opacity: line, transform: `translateY(${(1 - line) * 30}px)`, filter: `blur(${(1 - line) * 8}px)` }}>
          Vos factures impayées,<br />relancées automatiquement.
        </div>
        <div style={{ marginTop: 90, opacity: Math.min(1, cta * 1.2), transform: `translateZ(${(1 - cta) * -300}px) scale(${0.8 + 0.2 * cta})` }}>
          <div
            style={{
              display: "inline-block", background: C.fg, color: C.bg, fontSize: 50, fontWeight: 800, padding: "36px 64px", borderRadius: 26,
              boxShadow: `0 0 ${40 + 50 * pulse}px rgba(255,255,255,${0.15 + 0.2 * pulse}), 0 30px 60px -20px #000`,
            }}
          >
            Essai gratuit 14 jours
          </div>
          <div style={{ fontSize: 44, fontWeight: 600, marginTop: 38, letterSpacing: 0.5 }}>encaissez.fr</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Letter({ ch, start, depth }: { ch: string; start: number; depth: string }) {
  const p = useEnter(start, 12, 0.8);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * -160}px) translateZ(${(1 - p) * 500}px) rotateX(${(1 - p) * 90}deg)`,
        textShadow: `${depth}, 0 30px 60px #000`,
        filter: `blur(${(1 - Math.min(1, p)) * 10}px)`,
      }}
    >
      {ch}
    </span>
  );
}

/* =====================================================================
   Composition : une « caméra » qui bouge doucement sur toute la scène
   ===================================================================== */
export function Promo({ layout = "vertical" }: { layout?: "vertical" | "wide" }) {
  const f = useCurrentFrame();
  // Mouvement de caméra : léger zoom avant continu + secousse au paiement
  const zoom = lerp(f, [0, S4], [1, 1.06], Easing.linear);
  const shake = f >= PAID && f < PAID + 14 ? Math.sin(f * 2.3) * (PAID + 14 - f) * 0.9 : 0;
  return (
    <LayoutCtx.Provider value={LAYOUTS[layout]}>
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${shake}px, ${shake * 0.6}px)` }}>
        <Headline
          from={S1}
          to={S2}
          words={[{ text: "Ton" }, { text: "client" }, { text: "ne" }, { text: "t'a" }, { text: "toujours" }, { text: "pas" }, { text: "payé ?", color: C.red }]}
        />
        <Headline
          from={S2}
          to={S3}
          words={[{ text: "Encaissez", color: C.fg }, { text: "le" }, { text: "relance" }, { text: "à" }, { text: "ta" }, { text: "place." }]}
        />
        <Headline from={S3} to={S4} words={[{ text: "…jusqu'à" }, { text: "ce" }, { text: "qu'il" }, { text: "paie.", color: C.green }]} />
        <Invoice />
        <Mails />
        <BankNotification />
        <Shockwave />
      </AbsoluteFill>
      <CoinBurst />
      <EndCard />
    </AbsoluteFill>
    </LayoutCtx.Provider>
  );
}
