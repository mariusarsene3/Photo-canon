import type { Metadata } from "next";
import { ToolPage } from "../tool-page";
import { LetterTool } from "../letter-tool";

export const metadata: Metadata = {
  title: "Mise en demeure de payer une facture : modèle gratuit",
  description:
    "Rédigez gratuitement une mise en demeure de payer une facture impayée, avec les mentions légales (pénalités, indemnité de 40 €, article 1344 du Code civil). Prête à imprimer.",
  alternates: { canonical: "/outils/mise-en-demeure" },
};

export default function Page() {
  return (
    <ToolPage
      kicker="Mise en demeure"
      title="Mise en demeure de payer une facture"
      intro="Le dernier courrier avant une procédure judiciaire. Remplissez les champs, puis imprimez la lettre et envoyez-la en recommandé avec accusé de réception."
      tips={[
        {
          q: "À quoi sert une mise en demeure ?",
          a: "Elle prouve que vous avez réclamé votre argent et fixe un dernier délai. Elle fait aussi courir les intérêts de retard et elle est indispensable avant de saisir le tribunal (injonction de payer).",
        },
        {
          q: "Quel délai laisser au client ?",
          a: "Huit à quinze jours est l'usage. Le délai court à partir de la réception de la lettre, d'où l'intérêt de l'accusé de réception.",
        },
        {
          q: "Et si le client ne paie toujours pas ?",
          a: "Vous pouvez demander une injonction de payer au tribunal judiciaire ou de commerce, une procédure simple et peu coûteuse, ou passer par un commissaire de justice. Les frais peuvent être mis à la charge du débiteur.",
        },
      ]}
    >
      <LetterTool kind="mise-en-demeure" />
    </ToolPage>
  );
}
