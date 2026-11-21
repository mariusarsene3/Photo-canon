import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { adminOrNull } from "./supabase/server";

/**
 * Limite de tentatives par adresse IP : au-delà de MAX essais en WINDOW secondes,
 * l'adresse est bloquée BLOCK secondes. Le compteur est stocké dans Supabase (migration 009),
 * partagé par tous les serveurs Vercel. Sans base disponible, un compteur en mémoire prend le relais.
 */
export const MAX = 5;
export const WINDOW = 60; // 1 minute
export const BLOCK = 15 * 60; // 15 minutes

export type Action = "login" | "signup" | "reset";
export type RateResult = { ok: true } | { ok: false; retryAfter: number }; // secondes

/** Adresse IP du visiteur (fournie par Vercel, qui écrase toute valeur envoyée par le navigateur). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
}

/** On ne stocke pas l'adresse IP en clair : seulement une empreinte (données personnelles). */
function keyFor(action: Action, ip: string) {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CRON_SECRET || "encaissez";
  return `${action}:${createHmac("sha256", salt).update(ip).digest("hex").slice(0, 32)}`;
}

// Compteur de secours, propre à chaque serveur.
const memory = new Map<string, { times: number[]; until: number }>();
function memoryHit(key: string, now = Date.now()): RateResult {
  const e = memory.get(key) ?? { times: [], until: 0 };
  if (e.until > now) return { ok: false, retryAfter: Math.ceil((e.until - now) / 1000) };
  e.times = e.times.filter((t) => t > now - WINDOW * 1000);
  e.times.push(now);
  if (e.times.length > MAX) e.until = now + BLOCK * 1000;
  memory.set(key, e);
  if (memory.size > 10_000) memory.clear(); // garde-fou mémoire
  return e.until > now ? { ok: false, retryAfter: BLOCK } : { ok: true };
}

/** Enregistre une tentative et dit si elle est autorisée. */
export async function hitRateLimit(action: Action, ip?: string): Promise<RateResult> {
  const key = keyFor(action, ip ?? (await clientIp()));
  const admin = adminOrNull();
  if (admin) {
    const { data, error } = await admin.rpc("hit_rate_limit", { p_key: key, p_max: MAX, p_window: WINDOW, p_block: BLOCK });
    if (!error) {
      if (!data) return { ok: true };
      return { ok: false, retryAfter: Math.max(1, Math.ceil((new Date(data as string).getTime() - Date.now()) / 1000)) };
    }
    console.error("Limite de tentatives : base indisponible, compteur en mémoire.", error.message);
  }
  return memoryHit(key);
}

/** Remet le compteur à zéro après une connexion réussie. */
export async function clearRateLimit(action: Action, ip?: string) {
  const key = keyFor(action, ip ?? (await clientIp()));
  memory.delete(key);
  const admin = adminOrNull();
  if (admin) await admin.rpc("clear_rate_limit", { p_key: key });
}

/** « Trop de tentatives. Réessayez dans 15 minutes. » */
export function tooManyMessage(retryAfter: number) {
  const min = Math.ceil(retryAfter / 60);
  return `Trop de tentatives. Par sécurité, réessayez dans ${min} minute${min > 1 ? "s" : ""}.`;
}
