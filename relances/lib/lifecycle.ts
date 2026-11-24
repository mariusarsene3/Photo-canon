import type { SupabaseClient } from "@supabase/supabase-js";
import { BRAND } from "./brand";
import { sendEmail } from "./email";
import { siteUrl } from "./payment";
import { euros } from "./reminders";
import { LEGAL } from "./legal";

/** Adresse qui reçoit les réponses des utilisateurs (e-mail de contact des mentions légales). */
const replyTo = () => LEGAL.contactEmail || process.env.SUPPORT_EMAIL || "";

/**
 * E-mails automatiques qui accompagnent l'essai gratuit :
 * - welcome       : à l'inscription (envoyé tout de suite, pas par le passage quotidien)
 * - nudge         : 2 jours après l'inscription, si aucune facture n'a été ajoutée
 * - trial_ending  : 3 jours (ou moins) avant la fin de l'essai
 * - trial_ended   : dans les 7 jours qui suivent la fin de l'essai
 * Chaque e-mail n'est envoyé qu'une fois par personne. Rien n'est envoyé aux abonnés.
 */
export type Kind = "welcome" | "nudge" | "trial_ending" | "trial_ended";

const DAY = 86_400_000;
const PAID = new Set(["active", "trialing", "past_due"]);

export type UserState = {
  createdAt: string;
  trialEndsAt: string;
  status: string | null;
  invoiceCount: number;
  productEmails: boolean;
  sent: Set<Kind>;
};

/** Quel e-mail envoyer aujourd'hui à cette personne (au plus un par jour), ou null. */
export function nextEmail(u: UserState, now = new Date()): Exclude<Kind, "welcome"> | null {
  if (!u.productEmails) return null;
  if (u.status && PAID.has(u.status)) return null;
  const t = now.getTime();
  const trialEnd = new Date(u.trialEndsAt).getTime();
  const age = t - new Date(u.createdAt).getTime();
  const left = trialEnd - t;

  void left; // plus d'essai qui expire depuis la version gratuite : seuls le bienvenue et le coup de pouce partent
  if (age >= 2 * DAY && u.invoiceCount === 0 && !u.sent.has("nudge")) return "nudge";
  return null;
}

export type Stats = { remindersSent: number; recoveredCents: number; overdueCents: number };

const sign = `\n\nÀ bientôt,\nL'équipe ${BRAND.name}`;
const footer = (url: string) =>
  `\n\n—\nVous recevez cet e-mail car vous avez créé un compte ${BRAND.name}. Pour ne plus recevoir ces conseils : ${url}/compte`;

export function renderLifecycle(kind: Kind, opts: { trialEndsAt?: string; stats?: Stats } = {}) {
  const url = siteUrl();
  const end = opts.trialEndsAt
    ? new Date(opts.trialEndsAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }).replace(/^1 /, "1er ")
    : "";
  const s = opts.stats;

  switch (kind) {
    case "welcome":
      return {
        subject: `Bienvenue sur ${BRAND.name} 👋`,
        text:
          `Bonjour,\n\nBienvenue sur ${BRAND.name} ! La version gratuite vous permet de suivre jusqu'à ${BRAND.freeInvoices} factures en cours, sans carte bancaire et sans limite de durée.\n\n` +
          `Pour démarrer en 2 minutes :\n` +
          `1. Indiquez le nom de votre entreprise et votre IBAN dans « Paramètres » : ils apparaîtront dans les relances.\n` +
          `2. Ajoutez une facture en retard (ou importez-les depuis Excel).\n` +
          `3. C'est tout : votre client recevra un rappel courtois, puis plus ferme s'il ne paie pas, avec un lien pour payer.\n\n` +
          `C'est par ici : ${url}` +
          (replyTo() ? `\n\nUne question ? Répondez simplement à cet e-mail.` : "") + sign,
      };
    case "nudge":
      return {
        subject: "Une facture en retard ? On s'en occupe",
        text:
          `Bonjour,\n\nVous avez créé votre compte ${BRAND.name} il y a quelques jours, mais aucune facture n'y est encore.\n\n` +
          `Le plus simple pour voir ce que ça donne : ajoutez une seule facture en retard. Ça prend 20 secondes, et ${BRAND.name} envoie ` +
          `le premier rappel dès le lendemain.\n\n` +
          `Ajouter une facture : ${url}\n\n` +
          `Vous préférez tout importer d'un coup ? Excel et CSV sont acceptés : ${url}/importer` + sign + footer(url),
      };
    case "trial_ending": {
      const recap =
        s && (s.remindersSent > 0 || s.recoveredCents > 0)
          ? `Depuis votre inscription : ${s.remindersSent} relance${s.remindersSent > 1 ? "s" : ""} envoyée${s.remindersSent > 1 ? "s" : ""}` +
            (s.recoveredCents > 0 ? ` et ${euros(s.recoveredCents)} récupérés` : "") + ".\n\n"
          : "";
      const waiting = s && s.overdueCents > 0 ? `Il vous reste ${euros(s.overdueCents)} de factures en retard à récupérer.\n\n` : "";
      return {
        subject: `Votre essai ${BRAND.name} se termine le ${end}`,
        text:
          `Bonjour,\n\nVotre essai gratuit se termine le ${end}.\n\n` + recap + waiting +
          `Pour que vos relances continuent de partir automatiquement, abonnez-vous : ${BRAND.price} € HT par mois, ` +
          `sans engagement, résiliable à tout moment.\n\n` +
          `S'abonner : ${url}/compte` + sign + footer(url),
      };
    }
    case "trial_ended":
      return {
        subject: "Vos relances sont en pause",
        text:
          `Bonjour,\n\nVotre essai gratuit est terminé : vos relances automatiques sont en pause.\n\n` +
          `Vos factures et vos paramètres sont conservés. Pour reprendre là où vous en étiez, il suffit de vous abonner ` +
          `(${BRAND.price} € HT par mois, sans engagement) : ${url}/compte` +
          (replyTo() ? `\n\nSi ${BRAND.name} ne vous convient pas, dites-nous pourquoi en répondant à cet e-mail : ça nous aide beaucoup.` : "") +
          sign + footer(url),
      };
  }
}

/**
 * Passage quotidien : envoie les e-mails dus (coup de pouce, fin d'essai). À appeler avec le client admin.
 * Ne fait rien si la migration 004 n'est pas appliquée.
 */
export async function runLifecycle(admin: SupabaseClient, now = new Date()) {
  const log = await admin.from("lifecycle_emails").select("user_id, kind");
  if (log.error) return { sent: [], errors: [], skipped: "migration 004 non appliquée" };

  // Comptes (paginé par 1000)
  const users: { id: string; email?: string; created_at: string }[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }

  const [{ data: billing }, { data: profiles }, { data: invoices }, { data: reminders }] = await Promise.all([
    admin.from("billing").select("user_id, trial_ends_at, status"),
    admin.from("profiles").select("user_id, product_emails"),
    admin.from("invoices").select("user_id, status, amount_cents, due_date"),
    admin.from("reminders").select("user_id"),
  ]);

  const bill = new Map((billing ?? []).map((b) => [b.user_id as string, b]));
  const prefs = new Map((profiles ?? []).map((p) => [p.user_id as string, p.product_emails !== false]));
  const sent = new Map<string, Set<Kind>>();
  for (const r of log.data ?? []) {
    if (!sent.has(r.user_id)) sent.set(r.user_id, new Set());
    sent.get(r.user_id)!.add(r.kind as Kind);
  }
  const today = now.toISOString().slice(0, 10);
  const stats = new Map<string, Stats & { count: number }>();
  const st = (id: string) => {
    if (!stats.has(id)) stats.set(id, { remindersSent: 0, recoveredCents: 0, overdueCents: 0, count: 0 });
    return stats.get(id)!;
  };
  for (const i of invoices ?? []) {
    const s = st(i.user_id);
    s.count++;
    if (i.status === "paid") s.recoveredCents += i.amount_cents;
    else if (i.due_date < today) s.overdueCents += i.amount_cents;
  }
  for (const r of reminders ?? []) st(r.user_id).remindersSent++;

  const result = { sent: [] as { kind: Kind; email: string }[], errors: [] as { email: string; error: string }[] };
  for (const u of users) {
    const b = bill.get(u.id);
    if (!b || !u.email) continue;
    const kind = nextEmail(
      {
        createdAt: u.created_at,
        trialEndsAt: b.trial_ends_at,
        status: b.status,
        invoiceCount: stats.get(u.id)?.count ?? 0,
        productEmails: prefs.get(u.id) ?? true,
        sent: sent.get(u.id) ?? new Set(),
      },
      now,
    );
    if (!kind) continue;

    // On réserve l'envoi avant de l'effectuer : la clé primaire empêche tout doublon.
    const { error: insErr } = await admin.from("lifecycle_emails").insert({ user_id: u.id, kind });
    if (insErr) continue;
    const { subject, text } = renderLifecycle(kind, { trialEndsAt: b.trial_ends_at, stats: stats.get(u.id) });
    try {
      await sendEmail(u.email, subject, text, { replyTo: replyTo() || undefined });
      result.sent.push({ kind, email: u.email });
    } catch (e) {
      await admin.from("lifecycle_emails").delete().eq("user_id", u.id).eq("kind", kind);
      result.errors.push({ email: u.email, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return result;
}

/** E-mail de bienvenue, envoyé dès que le compte est utilisable. Ne bloque jamais l'inscription. */
export async function sendWelcome(userId: string, email: string, admin: SupabaseClient | null) {
  try {
    if (admin) {
      const { error } = await admin.from("lifecycle_emails").insert({ user_id: userId, kind: "welcome" });
      // 23505 : déjà envoyé. Si la table n'existe pas encore (migration 004), on envoie quand même.
      if (error && error.code !== "42P01" && error.code !== "PGRST205") return;
    }
    const { subject, text } = renderLifecycle("welcome");
    await sendEmail(email, subject, text, { replyTo: replyTo() || undefined });
  } catch (e) {
    console.error("E-mail de bienvenue", e);
  }
}
