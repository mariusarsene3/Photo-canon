import { pdfFilename, type Invoice } from "@/lib/reminders";
import { SubmitButton } from "../../submit-button";
import { removePdf, uploadPdf } from "./actions";

/** Facture PDF jointe aux relances : ajout, consultation, retrait. */
export function PdfCard({ inv, pdfUrl }: { inv: Invoice; pdfUrl?: string | null }) {
  return (
    <section className="card">
      <h2>Facture PDF</h2>
      {inv.pdf_path ? (
        <>
          <p className="pdf-file">
            <span className="pdf-icon" aria-hidden>PDF</span>
            <span>
              {pdfUrl ? <a href={pdfUrl} target="_blank" rel="noreferrer">{pdfFilename(inv)}</a> : <b>{pdfFilename(inv)}</b>}
              <small className="muted">Jointe automatiquement à chaque relance</small>
            </span>
          </p>
          <form action={removePdf}>
            <input type="hidden" name="id" value={inv.id} />
            <SubmitButton className="ghost small" pending="…">Retirer le PDF</SubmitButton>
          </form>
        </>
      ) : (
        <form action={uploadPdf} className="notes">
          <input type="hidden" name="id" value={inv.id} />
          <input name="pdf" type="file" accept="application/pdf" required />
          <SubmitButton className="secondary small" pending="Envoi…">Joindre aux relances</SubmitButton>
          <p className="muted small">Votre client recevra la facture avec chaque relance : plus besoin de vous la redemander.</p>
        </form>
      )}
    </section>
  );
}
