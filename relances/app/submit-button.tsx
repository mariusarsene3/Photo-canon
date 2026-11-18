"use client";

import { useFormStatus } from "react-dom";

/** Bouton qui se désactive et affiche un texte d'attente pendant l'envoi du formulaire. */
export function SubmitButton({
  children,
  pending: pendingLabel = "…",
  className,
  title,
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} title={title} disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
