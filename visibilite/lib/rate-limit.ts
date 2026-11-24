import "server-only";
import { headers } from "next/headers";

// Chaque analyse coûte une recherche web payante : 5 analyses par heure et par adresse IP.
// Compteur en mémoire pour le prototype (à passer dans une base comme pour Encaissez en production).
const MAX = 5;
const WINDOW = 3600 * 1000;
const hits = new Map<string, number[]>();

export async function allowCheck(): Promise<boolean> {
  const h = await headers();
  const ip = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => t > now - WINDOW);
  if (list.length >= MAX) return false;
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 10_000) hits.clear();
  return true;
}
