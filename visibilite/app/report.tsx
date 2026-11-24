import type { CheckResult, ProviderResult } from "@/lib/check";
import { BRAND } from "@/lib/brand";

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
        <p className="question">« {result.question} »</p>
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

      <div className="card todo">
        <h3>Ce qui fait qu&apos;une IA vous cite</h3>
        <ol>
          <li>
            <strong>Une fiche Google complète</strong> : horaires, photos récentes, description qui dit clairement ce que vous
            faites et où.
          </li>
          <li>
            <strong>Des avis récents et réguliers</strong> : l&apos;IA lit les avis pour choisir qui recommander.
          </li>
          <li>
            <strong>Être présent là où l&apos;IA cherche</strong>
            {sources.length ? ` : ici, ${sources.join(", ")}.` : "."}
          </li>
        </ol>
        <p className="small">
          Les réponses des IA varient un peu d&apos;une fois à l&apos;autre : ce test est une photo à un instant donné.
        </p>
        <a
          className="btn"
          href={`mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(`Être recommandé par l'IA : ${result.business} (${result.city})`)}`}
        >
          Je veux qu&apos;on s&apos;en occupe pour moi
        </a>
      </div>
    </section>
  );
}
