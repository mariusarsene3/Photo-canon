"use client";

import { useEffect, useState } from "react";

/**
 * Notification de succès éphémère : apparaît en bas de l'écran puis disparaît.
 * Retire aussi le message de l'adresse, pour qu'il ne réapparaisse pas en rechargeant la page.
 */
export function Toast({ message }: { message?: string }) {
  const [shown, setShown] = useState(Boolean(message));
  useEffect(() => {
    if (!message) return;
    setShown(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("ok");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    const t = setTimeout(() => setShown(false), 4200);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return (
    <div className={`toast-msg${shown ? " show" : ""}`} role="status" aria-live="polite">
      <span className="toast-ic" aria-hidden>✓</span>
      <span>{message}</span>
      <button type="button" onClick={() => setShown(false)} aria-label="Fermer">×</button>
    </div>
  );
}
