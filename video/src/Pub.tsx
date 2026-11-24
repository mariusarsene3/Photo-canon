import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import { AbsoluteFill, Easing, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Publicité verticale (1080x1920, ~19 s) pour les réseaux sociaux.
 * 1. L'accroche : une facture tamponnée « IMPAYÉE »
 * 2. Le problème : relancer, c'est gênant… et on oublie
 * 3. La solution : Encaissez relance à J-3, J+1, J+7, J+15
 * 4. Le résultat : « Boulangerie Dupont a payé », compteur qui monte
 * 5. L'offre et l'appel à l'action : encaissez.fr
 */

const C = {
  bg: "#0f2a1d", // vert profond (DA Encaissez)
  card: "#163826",
  line: "#1f4231",
  fg: "#f3efe6",
  muted: "#9fb5a7",
  green: "#22c55e",
  greenDeep: "#15803d",
  red: "#ef4444",
  paper: "#fbfbf9",
  ink: "#111113",
};
const FONT = "Inter, system-ui, sans-serif";

// Découpage (30 images par seconde)
export const PUB_SCENES = { hook: [0, 80], pain: [80, 170], solution: [170, 345], result: [345, 450], end: [450, 570] } as const;
export const PUB_DURATION = 570;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lerp = (f: number, i: number[], o: number[], e = ease) => interpolate(f, i, o, { ...clamp, easing: e });

function useSpring(start: number, damping = 14, mass = 0.8, stiffness = 120) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - start, fps, config: { damping, mass, stiffness } });
}

/** Sortie d'une scène : léger zoom + flou + fondu sur les dernières images. */
function useExit(duration: number, len = 10) {
  const f = useCurrentFrame();
  const t = lerp(f, [duration - len, duration], [0, 1]);
  return { opacity: 1 - t, transform: `scale(${1 + t * 0.06})`, filter: `blur(${t * 12}px)` };
}

/* =====================================================================
   Décor commun : halos qui dérivent, grain, vignette
   ===================================================================== */
function Background() {
  const f = useCurrentFrame();
  const [rs, re] = PUB_SCENES.result;
  const greenMix = lerp(f, [rs, rs + 20], [0, 1]) * (1 - lerp(f, [re + 60, re + 100], [0, 0.6]));
  const redMix = lerp(f, [0, 20], [0, 1]) * (1 - lerp(f, [PUB_SCENES.solution[0] - 10, PUB_SCENES.solution[0] + 10], [0, 1]));
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={orb(300 + Math.sin(f / 45) * 90, 500 + Math.cos(f / 55) * 80, 1100, C.red, 0.22 * redMix)} />
      <div style={orb(760 + Math.cos(f / 40) * 90, 1400 + Math.sin(f / 50) * 90, 1200, "#4ade80", 0.12 * (1 - redMix) * (1 - greenMix))} />
      <div style={orb(540 + Math.sin(f / 30) * 60, 900, 1300, C.green, 0.26 * greenMix)} />
      {/* Grille discrète */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${(f * 1.2) % 90}px`,
          opacity: 0.25,
          maskImage: "radial-gradient(ellipse at 50% 50%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 20%, transparent 75%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, #04120b 100%)", opacity: 0.8 }} />
    </AbsoluteFill>
  );
}

const orb = (x: number, y: number, size: number, color: string, opacity: number): React.CSSProperties => ({
  position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%",
  background: `radial-gradient(circle, ${color} 0%, transparent 65%)`, opacity, filter: "blur(50px)",
});

/* =====================================================================
   Texte cinétique : chaque mot arrive du flou, avec un rebond
   ===================================================================== */
type Word = { t: string; c?: string };

function Kinetic({ words, start, size = 104, top, align = "center", gap = 4 }: { words: Word[]; start: number; size?: number; top: number; align?: "center" | "left"; gap?: number }) {
  return (
    <div
      style={{
        position: "absolute", left: 80, right: 80, top, textAlign: align, perspective: 1000,
        fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.035, color: C.fg,
      }}
    >
      {words.map((w, i) => (
        <KWord key={i} start={start + i * gap} {...w} />
      ))}
    </div>
  );
}

function KWord({ start, t, c }: { start: number } & Word) {
  const p = useSpring(start, 13, 0.6);
  const clear = Math.min(1, p);
  return (
    <span
      style={{
        display: "inline-block", margin: "0 0.12em", color: c ?? C.fg,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 80}px) rotateX(${(1 - p) * -80}deg) scale(${0.9 + p * 0.1})`,
        transformOrigin: "50% 100%",
        filter: `blur(${(1 - clear) * 16}px)`,
        textShadow: c ? `0 0 50px ${c}77` : "none",
      }}
    >
      {t}
    </span>
  );
}

/* =====================================================================
   1. L'accroche : la facture impayée
   ===================================================================== */
function Hook() {
  const f = useCurrentFrame();
  const dur = PUB_SCENES.hook[1] - PUB_SCENES.hook[0];
  const card = useSpring(6, 12, 0.9);
  const stamp = useSpring(36, 9, 0.6, 220);
  const shake = f >= 38 && f < 50 ? Math.sin(f * 2.4) * (50 - f) * 0.9 : 0;
  const exit = useExit(dur);
  return (
    <AbsoluteFill style={exit}>
      <Kinetic start={0} top={240} size={110} words={[{ t: "Votre" }, { t: "client" }, { t: "ne" }, { t: "paie" }, { t: "pas ?", c: C.red }]} />
      <div
        style={{
          position: "absolute", left: 140, width: 800, top: 760,
          transform: `translate(${shake}px, ${(1 - card) * 500}px) rotate(${(1 - card) * 12 - 3}deg)`,
          opacity: Math.min(1, card * 1.5),
        }}
      >
        <InvoiceCard />
        {/* Tampon */}
        <div
          style={{
            position: "absolute", left: 160, top: 250, padding: "14px 36px",
            border: `10px solid ${C.red}`, borderRadius: 18, color: C.red,
            fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: 6,
            transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [3.2, 1])})`,
            opacity: f < 36 ? 0 : Math.min(1, stamp * 2),
            mixBlendMode: "multiply",
          }}
        >
          IMPAYÉE
        </div>
      </div>
    </AbsoluteFill>
  );
}

function InvoiceCard() {
  const row = (a: string, b: string, strong = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderTop: "2px solid #e8e8e4", fontSize: strong ? 44 : 32, fontWeight: strong ? 800 : 500 }}>
      <span style={{ color: strong ? C.ink : "#6b6b70" }}>{a}</span>
      <span>{b}</span>
    </div>
  );
  return (
    <div style={{ background: C.paper, color: C.ink, borderRadius: 28, padding: "48px 56px", fontFamily: FONT, boxShadow: "0 50px 120px -30px rgba(0,0,0,.8)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 26 }}>
        <span style={{ fontSize: 54, fontWeight: 800, letterSpacing: -1.5 }}>FACTURE</span>
        <span style={{ fontSize: 34, color: "#6b6b70", fontWeight: 600 }}>F-042</span>
      </div>
      {row("Client", "Boulangerie Dupont")}
      {row("Échéance", "31/10/2026")}
      {row("Montant TTC", "1\u00a0250,00\u00a0€", true)}
    </div>
  );
}

/* =====================================================================
   2. Le problème : un compteur de jours qui défile + phrases chocs
   ===================================================================== */
function Pain() {
  const f = useCurrentFrame();
  const dur = PUB_SCENES.pain[1] - PUB_SCENES.pain[0];
  const days = Math.round(lerp(f, [0, dur - 6], [1, 45], Easing.in(Easing.quad)));
  const exit = useExit(dur);
  const lines: { from: number; to: number; words: Word[] }[] = [
    { from: 0, to: 32, words: [{ t: "Le" }, { t: "relancer ?" }] },
    { from: 30, to: 60, words: [{ t: "C'est" }, { t: "gênant.", c: C.red }] },
    { from: 58, to: dur, words: [{ t: "Et" }, { t: "on" }, { t: "oublie." }] },
  ];
  return (
    <AbsoluteFill style={exit}>
      {/* Compteur géant en fond */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 560, textAlign: "center",
          fontFamily: FONT, fontWeight: 800, fontSize: 420, letterSpacing: -18,
          color: "transparent", WebkitTextStroke: `4px ${C.red}`, opacity: 0.55,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        J+{days}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: FONT, fontSize: 40, fontWeight: 600, color: C.muted, letterSpacing: 1 }}>
        jours de retard
      </div>
      {lines.map((l, i) => (
        <Line key={i} {...l} />
      ))}
    </AbsoluteFill>
  );
}

function Line({ from, to, words }: { from: number; to: number; words: Word[] }) {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const out = lerp(f, [to - 6, to], [1, 0]);
  return (
    <div style={{ opacity: out, filter: `blur(${(1 - out) * 10}px)` }}>
      <Kinetic start={from} top={1290} size={120} words={words} />
    </div>
  );
}

/* =====================================================================
   3. La solution : le logo, puis la frise des relances
   ===================================================================== */
const STEPS = [
  { day: "J-3", label: "Rappel avant échéance" },
  { day: "J+1", label: "Rappel amical" },
  { day: "J+7", label: "Relance ferme" },
  { day: "J+15", label: "Dernier avis" },
];

function Solution() {
  const f = useCurrentFrame();
  const dur = PUB_SCENES.solution[1] - PUB_SCENES.solution[0];
  const logo = useSpring(0, 11, 0.8);
  const exit = useExit(dur);
  const flash = lerp(f, [0, 3, 14], [0, 1, 0]);
  return (
    <AbsoluteFill style={exit}>
      <AbsoluteFill style={{ background: C.green, opacity: flash * 0.35 }} />
      {/* Logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", alignItems: "center", gap: 28, transform: `scale(${0.6 + logo * 0.4})`, opacity: Math.min(1, logo * 1.4) }}>
        <Logo size={120} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 118, letterSpacing: -4, color: C.fg }}>Encaissez</span>
      </div>
      <Kinetic start={14} top={380} size={76} gap={3} words={[{ t: "relance" }, { t: "à" }, { t: "votre" }, { t: "place.", c: C.green }]} />

      {/* Frise */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 640 }}>
        <TimelineRail />
        {STEPS.map((s, i) => (
          <StepRow key={s.day} index={i} {...s} />
        ))}
      </div>

      {/* Atouts */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1600, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
        {["Facture PDF jointe", "Lien de paiement", "À votre nom"].map((t, i) => (
          <Chip key={t} start={118 + i * 7} text={t} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

const STEP_START = 40;
const STEP_GAP = 18;
const ROW_H = 230;

function TimelineRail() {
  const f = useCurrentFrame();
  const h = lerp(f, [STEP_START, STEP_START + STEP_GAP * 3 + 12], [0, ROW_H * 3]);
  return (
    <>
      <div style={{ position: "absolute", left: 58, top: 60, width: 6, height: ROW_H * 3, background: C.line, borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 58, top: 60, width: 6, height: h, background: C.green, borderRadius: 3, boxShadow: `0 0 30px ${C.green}` }} />
    </>
  );
}

function StepRow({ index, day, label }: { index: number; day: string; label: string }) {
  const f = useCurrentFrame();
  const start = STEP_START + index * STEP_GAP;
  const p = useSpring(start, 13, 0.7);
  const lit = f >= start + 6;
  // Enveloppe qui part vers la droite
  const fly = lerp(f, [start + 6, start + 30], [0, 1], Easing.in(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: index * ROW_H, height: 140, display: "flex", alignItems: "center", gap: 34, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * -120}px)` }}>
      <div
        style={{
          width: 124, height: 124, flex: "none", borderRadius: 999, display: "grid", placeItems: "center",
          background: lit ? C.green : C.card, border: `4px solid ${lit ? C.green : C.line}`,
          boxShadow: lit ? `0 0 50px ${C.green}99` : "none",
          fontFamily: FONT, fontWeight: 800, fontSize: day.length > 3 ? 36 : 40, color: lit ? "#052e14" : C.fg,
        }}
      >
        {day}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 56, color: C.fg, letterSpacing: -1.5 }}>{label}</div>
      {f >= start + 6 && fly < 1 && (
        <div
          style={{
            position: "absolute", left: 640 + fly * 420, top: 20 - fly * 140, width: 96, height: 70,
            opacity: 1 - fly, transform: `rotate(${-fly * 25}deg) scale(${1 - fly * 0.3})`,
          }}
        >
          <Envelope />
        </div>
      )}
    </div>
  );
}

function Envelope() {
  return (
    <svg viewBox="0 0 96 70" width="96" height="70">
      <rect x="2" y="2" width="92" height="66" rx="10" fill={C.fg} />
      <path d="M6 8 L48 40 L90 8" stroke={C.ink} strokeWidth="6" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function Chip({ start, text }: { start: number; text: string }) {
  const p = useSpring(start, 12, 0.6);
  return (
    <div
      style={{
        padding: "16px 28px", borderRadius: 999, border: `3px solid ${C.green}`, color: C.fg, background: "rgba(34,197,94,.12)",
        fontFamily: FONT, fontWeight: 700, fontSize: 36, whiteSpace: "nowrap",
        transform: `scale(${p})`, opacity: Math.min(1, p * 1.5),
      }}
    >
      ✓ {text}
    </div>
  );
}

/** Logo Encaissez : l'enveloppe validée (même dessin que le site). */
function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flex: "none", filter: `drop-shadow(0 0 ${size * 0.35}px ${C.green}55)` }}>
      <rect width="64" height="64" rx="16" fill={C.green} />
      <rect x="12" y="18" width="40" height="29" rx="6" fill="#fff" />
      <path d="M14 21l18 13 18-13" stroke={C.greenDeep} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="47" cy="45" r="11" fill="#0a0a0b" />
      <path d="M42 45l3.5 3.5 6.5-7" stroke={C.green} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* =====================================================================
   4. Le résultat : notification de paiement + compteur + pièces
   ===================================================================== */
function Result() {
  const f = useCurrentFrame();
  const dur = PUB_SCENES.result[1] - PUB_SCENES.result[0];
  const phone = useSpring(0, 14, 0.9);
  const notif = useSpring(14, 11, 0.7);
  const amount = Math.round(lerp(f, [30, 80], [0, 4930], Easing.out(Easing.cubic)));
  const exit = useExit(dur);
  return (
    <AbsoluteFill style={exit}>
      <Kinetic start={2} top={190} size={100} words={[{ t: "Et" }, { t: "vous" }, { t: "êtes" }, { t: "payé.", c: C.green }]} />

      {/* Téléphone */}
      <div
        style={{
          position: "absolute", left: 190, width: 700, top: 420, height: 980, borderRadius: 90,
          background: "linear-gradient(160deg, #1d3a2a, #0b1f15)", border: `6px solid #2c5240`,
          transform: `translateY(${(1 - phone) * 700}px)`, boxShadow: "0 60px 140px -40px #000",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: "50%", top: 26, width: 180, height: 44, marginLeft: -90, borderRadius: 30, background: "#000" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, color: C.fg }}>
          <div style={{ fontSize: 150, fontWeight: 300, letterSpacing: -4 }}>9:41</div>
          <div style={{ fontSize: 34, color: C.muted, marginTop: -6 }}>mardi 24 novembre</div>
        </div>
        {/* Notification */}
        <div
          style={{
            position: "absolute", left: 36, right: 36, top: 470, borderRadius: 40, padding: "28px 30px",
            background: "rgba(255,255,255,.12)", backdropFilter: "blur(20px)", border: "2px solid rgba(255,255,255,.12)",
            display: "flex", gap: 24, alignItems: "center",
            transform: `translateY(${(1 - notif) * -260}px) scale(${0.9 + notif * 0.1})`, opacity: Math.min(1, notif * 1.5),
          }}
        >
          <Logo size={84} />
          <div style={{ fontFamily: FONT, color: C.fg, minWidth: 0 }}>
            <div style={{ fontSize: 26, color: C.muted, fontWeight: 600 }}>ENCAISSEZ · maintenant</div>
            <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>Facture payée ✓</div>
            <div style={{ fontSize: 31, color: "#d6d6dc", marginTop: 2 }}>Boulangerie Dupont a payé 1&nbsp;250,00&nbsp;€</div>
          </div>
        </div>
      </div>

      {/* Compteur */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 40, color: C.muted, fontWeight: 600 }}>Récupéré ce mois-ci</div>
        <div style={{ fontSize: 170, fontWeight: 800, color: C.green, letterSpacing: -6, fontVariantNumeric: "tabular-nums", textShadow: `0 0 70px ${C.green}88` }}>
          {amount.toLocaleString("fr-FR").replace(/ /g, " ")} €
        </div>
      </div>
      <Coins start={20} />
    </AbsoluteFill>
  );
}

function Coins({ start }: { start: number }) {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 70) return null;
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 14 + random(`v${i}`) * 18;
        const x = 540 + Math.cos(a) * v * t;
        const y = 900 + Math.sin(a) * v * t + 0.55 * t * t;
        const s = 34 + random(`s${i}`) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, #bbf7d0, ${C.green} 55%, ${C.greenDeep})`,
              opacity: lerp(t, [50, 70], [1, 0]), transform: `rotate(${t * 12}deg)`,
              display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: s * 0.55, color: "#052e14",
            }}
          >
            €
          </div>
        );
      })}
    </>
  );
}

/* =====================================================================
   5. L'offre et l'appel à l'action
   ===================================================================== */
function EndCard() {
  const f = useCurrentFrame();
  const logo = useSpring(0, 12, 0.8);
  const badge = useSpring(22, 10, 0.6, 180);
  const price = useSpring(34, 13, 0.7);
  const cta = useSpring(48, 11, 0.7);
  const pulse = 1 + Math.max(0, Math.sin((f - 60) / 6)) * 0.035 * (f > 60 ? 1 : 0);
  const shine = ((f - 60) % 45) / 45;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `scale(${0.7 + logo * 0.3})`, opacity: Math.min(1, logo * 1.4) }}>
        <Logo size={170} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 140, letterSpacing: -5, color: C.fg, lineHeight: 1 }}>Encaissez</div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 46, color: C.muted }}>Relance de factures impayées</div>
      </div>

      {/* Offre fondateur */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "20px 40px", borderRadius: 999, background: C.green, color: "#052e14",
            fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: -0.5,
            transform: `rotate(-2deg) scale(${badge})`, boxShadow: `0 0 60px ${C.green}88`,
          }}
        >
          -50 % à vie · 20 premiers clients
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: FONT, opacity: Math.min(1, price * 1.4), transform: `translateY(${(1 - price) * 60}px)` }}>
        <span style={{ fontSize: 60, color: C.muted, textDecoration: "line-through", marginRight: 26 }}>29 €</span>
        <span style={{ fontSize: 150, fontWeight: 800, color: C.fg, letterSpacing: -5 }}>14,50 €</span>
        <div style={{ fontSize: 44, color: C.muted, marginTop: 4 }}>HT / mois · 14 jours gratuits · sans carte</div>
      </div>

      {/* Bouton */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", opacity: Math.min(1, cta * 1.4), transform: `translateY(${(1 - cta) * 80}px)` }}>
        <div
          style={{
            position: "relative", overflow: "hidden", padding: "42px 90px", borderRadius: 999, background: C.fg, color: C.ink,
            fontFamily: FONT, fontWeight: 800, fontSize: 84, letterSpacing: -2.5, transform: `scale(${pulse})`,
            boxShadow: "0 30px 90px -20px rgba(255,255,255,.35)",
          }}
        >
          encaissez.fr →
          {f > 60 && (
            <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: `${-20 + shine * 140}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)", transform: "skewX(-20deg)", mixBlendMode: "overlay" }} />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* =====================================================================
   Assemblage
   ===================================================================== */
export function Pub() {
  const S = PUB_SCENES;
  const seq = (k: keyof typeof S) => ({ from: S[k][0], durationInFrames: S[k][1] - S[k][0] });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Sequence {...seq("hook")}><Hook /></Sequence>
      <Sequence {...seq("pain")}><Pain /></Sequence>
      <Sequence {...seq("solution")}><Solution /></Sequence>
      <Sequence {...seq("result")}><Result /></Sequence>
      <Sequence {...seq("end")}><EndCard /></Sequence>
    </AbsoluteFill>
  );
}
