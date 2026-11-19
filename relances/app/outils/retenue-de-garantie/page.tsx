import type { Metadata } from "next";
import { ToolPage } from "../tool-page";
import { GuaranteeCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "Retenue de garantie : calcul de la date de libération",
  description:
    "Calculez gratuitement la date de libération de votre retenue de garantie (un an après la réception des travaux) et le montant à récupérer. Lettre de demande de restitution offerte.",
  alternates: { canonical: "/outils/retenue-de-garantie" },
};

export default function Page() {
  return (
    <ToolPage
      kicker="Retenue de garantie"
      title="Quand récupérer votre retenue de garantie ?"
      intro="Entrez la date de réception des travaux : vous obtenez la date de libération, le montant à récupérer et une lettre de demande de restitution prête à envoyer."
      tips={[
        {
          q: "Combien le client peut-il retenir ?",
          a: "Au maximum 5 % du montant des travaux (loi n° 71-584 du 16 juillet 1971). Elle peut être remplacée par une caution bancaire.",
        },
        {
          q: "Le client peut-il refuser de la rendre ?",
          a: "Seulement s'il vous a notifié, avant la date anniversaire et par lettre recommandée, une opposition motivée, par exemple des réserves non levées. Sinon, la somme doit vous être versée, même sans mainlevée.",
        },
        {
          q: "Et s'il ne paie pas malgré tout ?",
          a: "Traitez-la comme une facture impayée : relance, puis mise en demeure, puis injonction de payer.",
        },
      ]}
    >
      <GuaranteeCalculator />
    </ToolPage>
  );
}
