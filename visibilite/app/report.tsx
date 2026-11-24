import type { CheckResult, ProviderResult } from "@/lib/check";
import { BRAND } from "@/lib/brand";
import { LeadForm } from "./lead-form";

const plain = (md: string) => md.replace(/\*\*|__|^#+\s*/gm, "");

function Verdict({ r, business }: { r: ProviderResult; business: string }) {
  if (!r.ok) {
    return (
      <div className="verdict muted">
        <span className="tag">{r.label}</span>
        <h3>Pas de réponse pour le moment</h3>
      </div>
    );
  }
  // On garde le vrai rang de chaque concurrent dans la réponse de l'IA.
  const others = r.recommended.map((name, i) => ({ name, rank: i + 1 })).filter((o) => o.rank !== r.position);
  return (
    <div className={`verdict ${r.cited ? "good" : "bad"}`}>
      <span className="tag">{r.label}</span>
      <h3>
        {r.cited
          ? `${r.label} vous cite${r.position ? ` en ${r.position === 1 ? "1re" : `${r.position}e`} position` : ""} 👍`
          : `${r.label} ne cite pas « ${business} »`}
      </h3>
      {others.length > 0 && (
        <>
          <p className="small">{r.cited ? "Il cite aussi :" : "Il recommande à la place :"}</p>
          <ol className="names">
            {others.slice(0, 6).map((o) => (
              <li key={o.rank} value={o.rank}>
                {o.name}
              </li>
            ))}
          </ol>
        </>
      )}
      {r.sourceDomains.length > 0 && (
        <>
          <p className="small">Les sites sur lesquels il s&apos;est appuyé :</p>
          <ul className="chips">
            {r.sourceDomains.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}
      <details>
        <summary>Voir sa réponse complète</summary>
        <p className="answer">{plain(r.answer)}</p>
      </details>
    </div>
  );
}

export function Report({ result }: { result: CheckResult }) {
  const ok = result.results.filter((r) => r.ok);
  const cited = ok.filter((r) => r.cited).length;
  const sources = [...new Set(ok.flatMap((r) => r.sourceDomains))].slice(0, 4);
  return (
    <section className="report">
      <div className="card summary">
        <p className="eyebrow">Question posée à l&apos;IA</p>
        <p className="question">«&nbsp;{result.question}&nbsp;»</p>
        <p className="score">
          {cited === 0 ? (
            <strong>Aucune IA ne vous recommande pour l&apos;instant.</strong>
          ) : (
            <>
              <strong>
                {cited} IA sur {ok.length}
              </strong>{" "}
              vous recommande.
            </>
          )}
        </p>
      </div>

      {result.results.map((r) => (
        <Verdict key={r.label} r={r} business={result.business} />
      ))}

      <div className={`card offer ${cited === ok.length && ok.length > 0 ? "" : "urgent"}`} id="audit">
        <p className="eyebrow">L&apos;audit est offert</p>
        <h3>
          {cited === 0
            ? "Vos clients qui demandent à l'IA partent chez vos concurrents. Ça se corrige."
            : "Vous êtes cité. Gardez votre place, et passez devant."}
        </h3>
        <ul className="checks">
          <li>Je regarde ce qui vous manque : fiche Google, avis, annuaires où l&apos;IA cherche{sources.length ? ` (${sources.join(", ")})` : ""}.</li>
          <li>Je vous explique tout simplement, au téléphone ou en passant vous voir.</li>
          <li>
            Si vous voulez, je m&apos;occupe de tout pour <strong>{BRAND.offer.setup} €</strong>, une seule fois. On refait le test un mois après
            pour voir la différence.
          </li>
        </ul>
        <LeadForm business={result.business} trade={result.trade} city={result.city} cited={ok.length ? cited > 0 : null} />
        <p className="fine">Les réponses des IA varient un peu d&apos;une fois à l&apos;autre : ce test est une photo à un instant donné.</p>
      </div>
    </section>
  );
}
