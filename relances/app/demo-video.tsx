"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vidéo de démonstration en boucle, sans le son.
 * Ne démarre pas toute seule si le visiteur a demandé moins d'animations, et peut être mise en pause.
 */
export function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="lp-video">
      <video
        ref={ref}
        src="/encaissez-demo.mp4"
        poster="/encaissez-demo-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Démonstration : une facture en retard est relancée automatiquement jusqu'au paiement"
      />
      <button type="button" className="lp-video-btn" onClick={toggle} aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}>
        {playing ? "❚❚" : "▶"}
      </button>
    </div>
  );
}
