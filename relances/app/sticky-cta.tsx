"use client";

import { useEffect, useState } from "react";

/** Bouton fixé en bas (mobile), visible seulement quand le bouton de l'en-tête n'est plus à l'écran. */
export function StickyCta({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const target = document.getElementById("hero-cta");
    if (!target) return;
    const obs = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    obs.observe(target);
    return () => obs.disconnect();
  }, []);
  return <div className={`lp-sticky${show ? " show" : ""}`} aria-hidden={!show}>{children}</div>;
}
