"use client";

import { useRef, useState } from "react";
import { fillTemplate, type Template } from "@/lib/template-fill";
import { SubmitButton } from "../submit-button";
import { resetTemplate, saveTemplate } from "./actions";

type Props = {
  step: number;
  initial: Template;
  isCustom: boolean;
  vars: Record<string, string>;
  placeholders: readonly { key: string; help: string }[];
};

/** Modification du texte d'une relance, avec aperçu en direct. */
export function TemplateEditor({ step, initial, isCustom, vars, placeholders }: Props) {
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const area = useRef<HTMLTextAreaElement>(null);
  const preview = fillTemplate({ subject, body }, vars);

  // Insère le champ à l'endroit du curseur.
  function insert(key: string) {
    const el = area.current;
    const tag = `{${key}}`;
    if (!el) return setBody((b) => b + tag);
    const { selectionStart: a, selectionEnd: b } = el;
    const next = body.slice(0, a) + tag + body.slice(b);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + tag.length, a + tag.length);
    });
  }

  return (
    <div className="tpl">
      <form action={saveTemplate} className="tpl-form">
        <input type="hidden" name="step" value={step} />
        <label>Objet<input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} required /></label>
        <label>
          Texte
          <textarea ref={area} name="body" rows={12} value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} required />
        </label>
        <div className="tpl-chips" aria-label="Insérer un champ">
          {placeholders.map((p) => (
            <button key={p.key} type="button" onClick={() => insert(p.key)} title={`Insérer : ${p.help}`}>
              {`{${p.key}}`} <small>{p.help}</small>
            </button>
          ))}
        </div>
        <div className="row">
          <SubmitButton className="small" pending="Enregistrement…">Enregistrer</SubmitButton>
          {isCustom && (
            <button formAction={resetTemplate} formNoValidate className="ghost small">Rétablir le texte d&apos;origine</button>
          )}
        </div>
      </form>
      <div className="tpl-preview">
        <p className="muted small">Aperçu avec une facture d&apos;exemple</p>
        <div className="mail-card">
          <p className="mail-subject">{preview.subject}</p>
          <pre className="mail-preview">{preview.text}</pre>
        </div>
      </div>
    </div>
  );
}
