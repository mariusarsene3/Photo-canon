import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/* ---------- Palette (même esprit que le site : sobre, un accent) ---------- */
const C = {
  bg: "#0a0a0a",
  card: "#161616",
  line: "#2a2a2a",
  fg: "#f5f5f5",
  muted: "#9a9a9a",
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
const END = 600;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Apparition (0 → 1) avec un léger rebond. */
function useEnter(start: number, damping = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass: 0.8 } });
}

/** Visible entre deux instants, avec fondu d'entrée et de sortie. */
function window(frame: number, from: number, to: number, fade = 12) {
  return interpolate(frame, [from, from + fade, to - fade, to], [0, 1, 1, 0], clamp);
}

/* ---------- Titres de scène ---------- */
function Headline({ from, to, children, accent }: { from: number; to: number; children: React.ReactNode; accent?: string }) {
  const frame = useCurrentFrame();
  const enter = useEnter(from + 2);
  const o = window(frame, from, to);
  return (
    <div
      style={{
        position: "absolute", left: 90, right: 90, top: 250,
        fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 1.04, letterSpacing: -3.5,
        color: accent ?? C.fg, opacity: o,
        transform: `translateY(${(1 - enter) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- La facture (scènes 1 à 3) ---------- */
function Invoice() {
  const frame = useCurrentFrame();
  const enter = useEnter(S1 + 18);
  // Monte quand les e-mails arrivent, redescend au paiement.
  const y = interpolate(frame, [S2, S2 + 25, S3 + 10, S3 + 40], [0, -120, -120, 40], { ...clamp, easing: ease });
  const scale = interpolate(frame, [S2, S2 + 25], [1, 0.86], { ...clamp, easing: ease });
  const out = interpolate(frame, [S4 - 12, S4], [1, 0], clamp);

  const days = Math.round(interpolate(frame, [S1 + 45, S1 + 135], [1, 21], clamp));
  const paidAt = S3 + 55;
  const paid = frame >= paidAt;
  const pop = useEnter(paidAt, 10);

  return (
    <div
      style={{
        position: "absolute", left: 90, right: 90, top: 720,
        opacity: enter * out,
        transform: `translateY(${(1 - enter) * 80 + y}px) scale(${scale})`,
        background: C.card, border: `2px solid ${paid ? C.green : C.line}`, borderRadius: 36,
        padding: "48px 52px", fontFamily: FONT, color: C.fg,
        boxShadow: paid ? `0 0 ${80 * pop}px ${C.green}55` : "0 40px 80px -30px #000",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>Facture F-042</span>
        {paid ? (
          <span style={{ ...pill(C.green), transform: `scale(${0.6 + 0.4 * pop})` }}>Payée ✓</span>
        ) : (
          <span style={pill(C.red)}>
            <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, background: C.red, marginRight: 12, opacity: 0.5 + 0.5 * Math.sin(frame / 4) }} />
            {days} jour{days > 1 ? "s" : ""} de retard
          </span>
        )}
      </div>
      <div style={{ fontSize: 44, fontWeight: 600, marginTop: 30 }}>Boulangerie Dupont</div>
      <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -4, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
        1 250,00 €
      </div>
      <div style={{ fontSize: 32, color: C.muted, marginTop: 8 }}>Échéance : 31 mars</div>
    </div>
  );
}

const pill = (color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", fontSize: 30, fontWeight: 700, color,
  border: `2px solid ${color}66`, background: `${color}1f`, padding: "12px 24px", borderRadius: 999,
});

/* ---------- Les relances (scène 2) ---------- */
const MAILS = [
  { day: "J+1", label: "Rappel courtois", subject: "Petit rappel : facture F-042", color: C.muted },
  { day: "J+7", label: "Relance ferme", subject: "Relance : facture F-042", color: C.amber },
  { day: "J+15", label: "Dernier avis", subject: "Dernier avis avant mise en demeure", color: C.red },
];

function Mails() {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [S3, S3 + 18], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1300, display: "grid", gap: 26, opacity: out }}>
      {MAILS.map((m, i) => (
        <Mail key={m.day} start={S2 + 30 + i * 38} {...m} />
      ))}
    </div>
  );
}

function Mail({ start, day, label, subject, color }: { start: number; day: string; label: string; subject: string; color: string }) {
  const frame = useCurrentFrame();
  const enter = useEnter(start);
  const sent = interpolate(frame, [start + 18, start + 26], [0, 1], clamp);
  return (
    <div
      style={{
        opacity: enter, transform: `translateX(${(1 - enter) * 140}px)`,
        display: "flex", alignItems: "center", gap: 28,
        background: C.card, border: `2px solid ${C.line}`, borderRadius: 28, padding: "26px 30px",
        fontFamily: FONT, color: C.fg,
      }}
    >
      <div style={{ width: 120, flex: "none" }}>
        <div style={{ fontSize: 46, fontWeight: 800, color, letterSpacing: -1 }}>{day}</div>
        <div style={{ fontSize: 20, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      </div>
      <div style={{ flex: 1, fontSize: 30, fontWeight: 600, lineHeight: 1.25 }}>{subject}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.green, opacity: sent, transform: `scale(${0.7 + 0.3 * sent})`, whiteSpace: "nowrap" }}>
        Envoyé ✓
      </div>
    </div>
  );
}

/* ---------- La notification bancaire (scène 3) ---------- */
function BankNotification() {
  const frame = useCurrentFrame();
  const enter = useEnter(S3 + 22, 14);
  const out = interpolate(frame, [S4 - 12, S4], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute", left: 70, right: 70, top: 1320,
        opacity: Math.min(1, enter * 1.4) * out,
        transform: `translateY(${(1 - enter) * -120}px) scale(${0.9 + 0.1 * enter})`,
        background: "rgba(38,38,38,0.96)", borderRadius: 40, padding: "34px 38px",
        display: "flex", gap: 30, alignItems: "center", fontFamily: FONT, color: C.fg,
        boxShadow: "0 30px 60px -20px #000",
      }}
    >
      <div style={{ width: 96, height: 96, borderRadius: 24, background: C.green, display: "grid", placeItems: "center", fontSize: 54, flex: "none", color: "#052e16", fontWeight: 800 }}>
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
  );
}

/* ---------- Écran de fin (scène 4) ---------- */
function EndCard() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [S4, S4 + 14], [0, 1], clamp);
  const logo = useEnter(S4 + 6, 16);
  const line = useEnter(S4 + 20);
  const cta = useEnter(S4 + 34, 12);
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", fontFamily: FONT, color: C.fg, textAlign: "center" }}>
      <div style={{ fontSize: 160, fontWeight: 800, letterSpacing: -7, transform: `scale(${0.85 + 0.15 * logo})`, opacity: logo }}>
        Encaissez
      </div>
      <div style={{ fontSize: 46, color: C.muted, marginTop: 24, lineHeight: 1.3, opacity: line, transform: `translateY(${(1 - line) * 20}px)`, padding: "0 110px" }}>
        Vos factures impayées,<br />relancées automatiquement.
      </div>
      <div style={{ marginTop: 90, opacity: cta, transform: `scale(${0.8 + 0.2 * cta})` }}>
        <div style={{ background: C.fg, color: C.bg, fontSize: 48, fontWeight: 700, padding: "34px 60px", borderRadius: 24 }}>
          Essai gratuit 14 jours
        </div>
        <div style={{ fontSize: 42, fontWeight: 600, marginTop: 36, letterSpacing: 0.5 }}>encaissez.fr</div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- Composition ---------- */
export function Promo() {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Headline from={S1} to={S2}>Ton client ne t&apos;a toujours pas payé&nbsp;?</Headline>
      <Headline from={S2} to={S3}>Encaissez le relance à ta place.</Headline>
      <Headline from={S3} to={S4} accent={C.fg}>
        …jusqu&apos;à ce qu&apos;il <span style={{ color: C.green }}>paie.</span>
      </Headline>
      <Invoice />
      <Mails />
      <BankNotification />
      <EndCard />
    </AbsoluteFill>
  );
}

export const DURATION = END;
