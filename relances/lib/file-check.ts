/**
 * Vérification du VRAI type d'un fichier envoyé, d'après son contenu (et non son nom ni le type
 * annoncé par le navigateur, que n'importe qui peut falsifier).
 */

/** Un PDF commence toujours par « %PDF- ». */
export const isPdf = (b: Uint8Array) =>
  b.length > 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d;

/** Un fichier .xlsx est une archive ZIP : il commence par « PK\x03\x04 ». */
export const isZip = (b: Uint8Array) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;

/** Un CSV est du texte : pas d'octet nul, et pas un fichier binaire connu (PDF, ZIP, image…). */
export function isText(b: Uint8Array) {
  const head = b.subarray(0, 8192);
  if (isPdf(b) || isZip(b)) return false;
  if (head.includes(0)) return false;
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(head.subarray(0, lastCompleteUtf8(head)));
    return true;
  } catch {
    // Fichiers Excel « CSV » enregistrés en Windows-1252 : accentués valides mais pas en UTF-8.
    return true;
  }
}
const lastCompleteUtf8 = (b: Uint8Array) => {
  let i = b.length;
  while (i > 0 && i > b.length - 4 && (b[i - 1] & 0xc0) === 0x80) i--;
  return i > 0 && b[i - 1] >= 0xc0 ? i - 1 : b.length;
};

/**
 * Taille totale du contenu une fois décompressé, lue dans l'annuaire de l'archive ZIP, SANS rien décompresser.
 * Protège contre les « bombes ZIP » (petit fichier qui gonfle à plusieurs Go en mémoire).
 * Renvoie null si l'archive est illisible ou au format ZIP64 (inutile pour un tableau de factures).
 */
export function zipUncompressedSize(b: Uint8Array): { total: number; entries: number } | null {
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  // Fin de l'annuaire central : signature 0x06054b50, dans les 64 derniers Ko.
  let eocd = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 65_557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) return null;
  const entries = view.getUint16(eocd + 10, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  if (entries === 0xffff || cdOffset === 0xffffffff || cdOffset >= b.length) return null;
  let p = cdOffset, total = 0;
  for (let n = 0; n < entries; n++) {
    if (p + 46 > b.length || view.getUint32(p, true) !== 0x02014b50) return null;
    const size = view.getUint32(p + 24, true);
    if (size === 0xffffffff) return null; // ZIP64
    total += size;
    p += 46 + view.getUint16(p + 28, true) + view.getUint16(p + 30, true) + view.getUint16(p + 32, true);
  }
  return { total, entries };
}
