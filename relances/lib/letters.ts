import { RATES, eur } from "./rates";

export type LetterInput = {
  senderName: string;
  senderAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string; // AAAA-MM-JJ
  dueDate: string; // AAAA-MM-JJ
  amount: number; // € TTC
  city: string;
  clientType: "pro" | "particulier";
};

/** « 1er octobre 2026 », « 15 octobre 2026 » */
const longDate = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }).replace(/^1 /, "1er ");
const fr = (iso: string) => (iso ? longDate(new Date(iso + "T00:00:00")) : "[date]");
const or = (v: string, placeholder: string) => v.trim() || placeholder;
const today = () => longDate(new Date());

function header(i: LetterInput, extra?: string) {
  return [
    or(i.senderName, "[Votre entreprise]"),
    or(i.senderAddress, "[Votre adresse]"),
    "",
    or(i.clientName, "[Nom du client]"),
    or(i.clientAddress, "[Adresse du client]"),
    "",
    `${or(i.city, "[Ville]")}, le ${today()}`,
    ...(extra ? ["", extra] : []),
  ].join("\n");
}

const amountText = (i: LetterInput) => (i.amount > 0 ? eur(i.amount) : "[montant] €");
const invoiceRef = (i: LetterInput) =>
  `la facture n° ${or(i.invoiceNumber, "[numéro]")}${i.invoiceDate ? ` du ${fr(i.invoiceDate)}` : ""}`;

const legalReminder = (i: LetterInput) =>
  i.clientType === "pro"
    ? `Nous vous rappelons qu'en application de l'article L441-10 du Code de commerce, tout retard de paiement entraîne de plein droit l'application de pénalités de retard ainsi que d'une indemnité forfaitaire de ${RATES.recoveryFee} € pour frais de recouvrement.`
    : "Nous vous rappelons qu'à défaut de paiement, des intérêts au taux légal pourront vous être réclamés.";

/** Lettre (ou e-mail) de relance, ton cordial ou ferme. */
export function relanceLetter(i: LetterInput, tone: "amical" | "ferme"): { subject: string; body: string } {
  const subject = `${tone === "amical" ? "Rappel" : "Relance"} – facture n° ${or(i.invoiceNumber, "[numéro]")}`;
  const lines =
    tone === "amical"
      ? [
          "Madame, Monsieur,",
          "",
          `Sauf erreur ou omission de notre part, nous n'avons pas encore reçu le règlement de ${invoiceRef(i)}, d'un montant de ${amountText(i)} TTC, arrivée à échéance le ${fr(i.dueDate)}.`,
          "",
          "Nous vous remercions de bien vouloir procéder à son règlement dans les meilleurs délais.",
          "",
          "Si votre paiement a été effectué entre-temps, nous vous prions de ne pas tenir compte de ce message.",
        ]
      : [
          "Madame, Monsieur,",
          "",
          `Malgré notre précédent rappel, ${invoiceRef(i)}, d'un montant de ${amountText(i)} TTC, arrivée à échéance le ${fr(i.dueDate)}, demeure impayée à ce jour.`,
          "",
          "Nous vous demandons de bien vouloir régulariser cette situation sous 8 jours à compter de la réception du présent courrier.",
          "",
          legalReminder(i),
          "",
          "Si vous rencontrez une difficulté, nous vous invitons à nous contacter rapidement afin de trouver une solution.",
        ];
  const body = [
    header(i, `Objet : ${subject}`),
    "",
    ...lines,
    "",
    "Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.",
    "",
    or(i.senderName, "[Votre entreprise]"),
  ].join("\n");
  return { subject, body };
}

/** Mise en demeure de payer (à envoyer en recommandé avec accusé de réception). */
export function miseEnDemeure(i: LetterInput, opts: { delayDays: number; penaltyRate: number }): { subject: string; body: string } {
  const subject = `Mise en demeure de payer – facture n° ${or(i.invoiceNumber, "[numéro]")}`;
  const consequences =
    i.clientType === "pro"
      ? `Conformément à l'article L441-10 du Code de commerce, cette somme sera majorée de pénalités de retard au taux de ${opts.penaltyRate.toLocaleString("fr-FR")} % l'an, calculées à compter du lendemain de la date d'échéance, ainsi que de l'indemnité forfaitaire de ${RATES.recoveryFee} € pour frais de recouvrement.`
      : "Conformément à l'article 1231-6 du Code civil, cette somme sera majorée des intérêts au taux légal à compter de la réception de la présente mise en demeure.";
  const body = [
    header(i, "Lettre recommandée avec accusé de réception"),
    "",
    `Objet : ${subject}`,
    "",
    "Madame, Monsieur,",
    "",
    `Malgré nos précédentes relances, ${invoiceRef(i)}, d'un montant de ${amountText(i)} TTC, arrivée à échéance le ${fr(i.dueDate)}, demeure impayée à ce jour.`,
    "",
    `Par la présente, nous vous mettons en demeure de nous régler la somme de ${amountText(i)} dans un délai de ${opts.delayDays} jours à compter de la réception de ce courrier.`,
    "",
    consequences,
    "",
    "À défaut de règlement dans ce délai, nous nous verrons contraints d'engager, sans autre préavis, une procédure judiciaire de recouvrement, dont les frais seront à votre charge.",
    "",
    "La présente lettre vaut mise en demeure au sens de l'article 1344 du Code civil.",
    "",
    "Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.",
    "",
    or(i.senderName, "[Votre entreprise]"),
  ].join("\n");
  return { subject, body };
}
