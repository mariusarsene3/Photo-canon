"use client";

/** Bouton « + » flottant (mobile) : ouvre le formulaire de nouvelle facture et place le curseur dedans. */
export function NewInvoiceFab() {
  const open = () => {
    const d = document.getElementById("nouvelle") as HTMLDetailsElement | null;
    if (!d) return;
    d.open = true;
    d.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => (d.querySelector("input[name=number]") as HTMLInputElement | null)?.focus(), 350);
  };
  return (
    <button type="button" className="fab" onClick={open} aria-label="Nouvelle facture">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
