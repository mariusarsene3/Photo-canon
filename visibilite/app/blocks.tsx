import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { SERVICES } from "@/lib/services";
import { METIERS } from "@/lib/metiers";
import { GUIDES } from "@/lib/guides";

/** Exemple de réponse de ChatGPT présenté comme une note papier (noms inventés). */
export function Note({ question, names = ["Atelier Pivoine", "La Petite Serre"] }: { question: string; names?: string[] }) {
  return (
    <figure className="note" aria-label="Exemple de réponse de ChatGPT, avec des noms inventés">
      <p className="note-label">Exemple · noms inventés</p>
      <p className="note-q">« {question} »</p>
      <p className="note-a">Voici ce que je te conseille :</p>
      <ol>
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ol>
      <p className="note-miss">
        <span>Et votre commerce ?</span> Pas un mot. Le client ne saura jamais que vous existez.
      </p>
    </figure>
  );
}

export function Services() {
  return (
    <section className="block" id="services">
      <div className="wrap">
        <h2 className="center">Ce que je peux faire pour vous</h2>
        <p className="sub center">Vous ne payez rien avant d&apos;avoir parlé avec moi, et seulement si vous êtes d&apos;accord.</p>
        <div className="prices four">
          {SERVICES.map((s) => (
            <div className={`price ${"main" in s && s.main ? "main" : ""}`} key={s.id}>
              <h3>{s.name}</h3>
              <p className="p-amount">
                {s.price}
                <small> {s.unit}</small>
              </p>
              <p>{s.desc}</p>
              <ul className="list">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              {s.id !== "suivi" && (
                <Link href={s.id === "visibilite" ? "/#test" : `/contact?service=${s.id}`} className={`btn ${"main" in s && s.main ? "" : "ghost"}`}>
                  {s.id === "visibilite" ? "Commencer par le test" : "En parler"}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MetierLinks() {
  return (
    <section className="block paper">
      <div className="wrap narrow">
        <h2>Le test, métier par métier</h2>
        <ul className="link-list">
          {METIERS.map((m) => (
            <li key={m.slug}>
              <Link href={`/test/${m.slug}`}>Est-ce que ChatGPT recommande votre {m.name} ?</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GuideLinks({ exclude, asPage }: { exclude?: string; asPage?: boolean }) {
  return (
    <section className="block">
      <div className="wrap narrow">
        {asPage ? <h1 className="page-title">Guides pratiques</h1> : <h2>Guides pratiques</h2>}
        <ul className="guide-list">
          {GUIDES.filter((g) => g.slug !== exclude).map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`}>{g.title}</Link>
              <p>{g.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const AREA = BRAND.area;
