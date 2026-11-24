import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { logout } from "./login/actions";

export type Section = "factures" | "relances" | "retenues" | "importer" | "compte";

const SIGNUP = "/login?mode=signup";

const NAV: { id: Section; href: string; label: string; icon: string }[] = [
  { id: "factures", href: "/", label: "Factures", icon: "M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5" },
  { id: "relances", href: "/relances", label: "Relances", icon: "M4 6h16v12H4z M4 7l8 6 8-6" },
  { id: "retenues", href: "/retenues", label: "Retenues", icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" },
  { id: "importer", href: "/importer", label: "Importer", icon: "M12 4v11 M7 10l5 5 5-5 M5 20h14" },
  { id: "compte", href: "/compte", label: "Compte", icon: "M12 12a4 4 0 100-8 4 4 0 000 8z M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Structure commune des pages de l'application (utilisateur connecté). */
export function AppShell({ active, email, demo = false, children }: { active: Section; email?: string; demo?: boolean; children: React.ReactNode }) {
  // Démo : seule la page Factures existe, les autres liens invitent à créer un compte.
  const href = (n: (typeof NAV)[number]) => (!demo ? n.href : n.id === "factures" ? "/demo" : SIGNUP);
  const main = NAV.filter((n) => n.id !== "compte");
  const account = NAV.find((n) => n.id === "compte")!;
  return (
    <div className="app">
      {/* Barre latérale, sur ordinateur */}
      <aside className="app-side" aria-label="Navigation principale">
        <Link href="/" className="side-brand">
          <span className="side-logo" aria-hidden />
          <span>
            {BRAND.name}
            <small>Relance de factures</small>
          </span>
        </Link>

        <Link href={demo ? SIGNUP : "/?nouvelle#nouvelle"} className="side-new">
          <span aria-hidden>+</span> Nouvelle facture
        </Link>

        <nav className="side-nav">
          <p className="side-label">Gérer</p>
          {main.map((n) => (
            <Link key={n.id} href={href(n)} className={active === n.id ? "on" : ""} aria-current={active === n.id ? "page" : undefined}>
              <Icon d={n.icon} />
              {n.label}
            </Link>
          ))}
          <p className="side-label">Réglages</p>
          <Link href={href(account)} className={active === account.id ? "on" : ""} aria-current={active === account.id ? "page" : undefined}>
            <Icon d={account.icon} />
            Mon compte
          </Link>
        </nav>

        {demo ? (
          <div className="side-user">
            <span className="side-avatar" aria-hidden>P</span>
            <span className="side-email">Compte de démonstration</span>
          </div>
        ) : (
          <form action={logout} className="side-user">
            <span className="side-avatar" aria-hidden>{(email ?? "?").charAt(0).toUpperCase()}</span>
            <span className="side-email" title={email}>{email}</span>
            <button className="side-logout" title="Se déconnecter" aria-label="Se déconnecter">
              <Icon d="M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10" />
            </button>
          </form>
        )}
      </aside>

      <header className="app-top">
        <div className="app-top-in">
          <Link href="/" className="app-brand">{BRAND.name}</Link>
          <nav className="app-nav" aria-label="Navigation principale">
            {NAV.map((n) => (
              <Link key={n.id} href={href(n)} className={active === n.id ? "on" : ""} aria-current={active === n.id ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          {demo ? (
            <Link href={SIGNUP} className="link-btn">Créer mon compte</Link>
          ) : (
            <form action={logout} className="app-user">
              {email && <span className="app-email">{email}</span>}
              <button className="link-btn">Déconnexion</button>
            </form>
          )}
        </div>
      </header>

      <main className="app-main"><div className="app-main-in">{children}</div></main>

      {/* Barre du bas, sur téléphone */}
      <nav className="app-tabbar" aria-label="Navigation">
        {NAV.map((n) => (
          <Link key={n.id} href={href(n)} className={active === n.id ? "on" : ""} aria-current={active === n.id ? "page" : undefined}>
            <Icon d={n.icon} />
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
