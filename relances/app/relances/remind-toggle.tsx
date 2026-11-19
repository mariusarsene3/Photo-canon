"use client";

import { setRemindBefore } from "./actions";

/** Interrupteur qui s'enregistre dès qu'on clique. */
export function RemindToggle({ on }: { on: boolean }) {
  return (
    <form action={setRemindBefore}>
      <label className="switch">
        <input type="checkbox" name="remind_before" defaultChecked={on} onChange={(e) => e.currentTarget.form?.requestSubmit()} />
        <span className="switch-ui" aria-hidden />
        <span className="sr-only">Rappel 3 jours avant l&apos;échéance</span>
      </label>
    </form>
  );
}
