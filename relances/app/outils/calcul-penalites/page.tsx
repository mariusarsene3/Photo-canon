import type { Metadata } from "next";
import { ToolPage } from "../tool-page";
import { PenaltyCalculator } from "./calculator";
import { RATES, defaultPenaltyRate, pct } from "@/lib/rates";

export const metadata: Metadata = {
  title: `Calcul des pénalités de retard de paiement (${RATES.period})`,
  description: `Calculez gratuitement les pénalités de retard d'une facture impayée entre professionnels : taux légal de ${pct(defaultPenaltyRate())} (BCE + 10 points), indemnité forfaitaire de 40 €. Taux à jour du ${RATES.period}.`,
  alternates: { canonical: "/outils/calcul-penalites" },
};

export default function Page() {
  return (
    <ToolPage
      kicker="Pénalités de retard"
      title="Calculer les pénalités de retard d'une facture"
      intro={`Combien votre client vous doit-il vraiment ? Entrez le montant et l'échéance : les pénalités et l'indemnité de 40 € sont calculées avec les taux officiels du ${RATES.period}.`}
      tips={[
        {
          q: "Quel taux appliquer ?",
          a: `Celui prévu dans vos conditions générales de vente. À défaut, le taux légal est le taux de refinancement de la BCE majoré de 10 points, soit ${pct(defaultPenaltyRate())} pour le ${RATES.period}. Il ne peut jamais être inférieur à trois fois le taux d'intérêt légal.`,
        },
        {
          q: "L'indemnité de 40 € est-elle automatique ?",
          a: "Oui, entre professionnels : elle est due pour chaque facture payée en retard, sans avoir besoin de la réclamer au préalable (articles L441-10 et D441-5 du Code de commerce).",
        },
        {
          q: "Et pour un client particulier ?",
          a: "Les pénalités de l'article L441-10 et l'indemnité de 40 € ne s'appliquent pas. Vous pouvez réclamer des intérêts au taux légal à compter d'une mise en demeure.",
        },
      ]}
    >
      <PenaltyCalculator />
    </ToolPage>
  );
}
