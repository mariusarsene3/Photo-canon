import type { Metadata } from "next";
import { ToolPage } from "../tool-page";
import { LetterTool } from "../letter-tool";

export const metadata: Metadata = {
  title: "Lettre de relance facture impayée : modèle gratuit à remplir",
  description:
    "Générez gratuitement une lettre de relance pour facture impayée : premier rappel cordial ou relance ferme, prête à copier ou à imprimer en PDF. Sans inscription.",
  alternates: { canonical: "/outils/lettre-relance" },
};

export default function Page() {
  return (
    <ToolPage
      kicker="Lettre de relance"
      title="Lettre de relance pour facture impayée"
      intro="Remplissez les champs : votre lettre se met à jour en direct. Copiez-la dans un e-mail ou imprimez-la. Gratuit, sans inscription, rien n'est enregistré."
      tips={[
        {
          q: "Quand envoyer une lettre de relance ?",
          a: "Dès le lendemain de l'échéance pour un premier rappel cordial : la plupart des retards sont des oublis. Si rien ne bouge, une relance plus ferme une semaine plus tard, puis une mise en demeure.",
        },
        {
          q: "E-mail ou courrier ?",
          a: "Un e-mail suffit pour les premières relances. Pour la mise en demeure, préférez la lettre recommandée avec accusé de réception : c'est elle qui sert de preuve en cas de procédure.",
        },
        {
          q: "Faut-il mentionner les pénalités de retard ?",
          a: "Entre professionnels, les pénalités de retard et l'indemnité forfaitaire de 40 € sont dues de plein droit (article L441-10 du Code de commerce). Les rappeler dans la relance ferme incite souvent à payer.",
        },
      ]}
    >
      <LetterTool kind="relance" />
    </ToolPage>
  );
}
