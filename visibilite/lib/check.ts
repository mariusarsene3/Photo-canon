import "server-only";
import { askClaude, claudeAvailable } from "./ai/claude";
import { askChatGPT, chatgptAvailable } from "./ai/chatgpt";
import type { AiAnswer } from "./ai/types";
import { analyse } from "./extract";

export type ProviderResult = {
  label: string;
  ok: boolean;
  cited: boolean;
  position: number | null;
  recommended: string[];
  answer: string;
  sourceDomains: string[]; // sites sur lesquels l'IA s'est appuyée
};

export type CheckResult = {
  business: string;
  trade: string;
  city: string;
  question: string;
  results: ProviderResult[];
};

/** « fleuriste » → « un fleuriste » ; on garde l'article si la personne l'a tapé. */
const withArticle = (trade: string) =>
  /^(un|une|des|le|la|les|l')\s?/i.test(trade) ? trade : `un ${trade}`;

export const questionFor = (trade: string, city: string) =>
  `Je cherche ${withArticle(trade)} à ${city}. Lesquels me conseilles-tu ?`;

const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// Les réponses des IA changent peu d'une heure à l'autre : on les garde 24 h par (métier, ville),
// ce qui évite de payer deux fois la même recherche quand plusieurs commerçants d'une ville testent.
const DAY = 24 * 3600 * 1000;
const cache = new Map<string, { at: number; answer: Promise<AiAnswer> }>();
function cached(key: string, run: () => Promise<AiAnswer>) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < DAY) return hit.answer;
  const answer = run();
  answer.catch(() => cache.delete(key)); // une erreur n'est pas gardée
  cache.set(key, { at: Date.now(), answer });
  if (cache.size > 2000) cache.clear();
  return answer;
}

export const providersAvailable = () => claudeAvailable() || chatgptAvailable();

export async function runCheck(business: string, trade: string, city: string): Promise<CheckResult> {
  const question = questionFor(trade, city);
  const key = `${trade}|${city}`.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").trim();

  const providers: { label: string; run: () => Promise<AiAnswer> }[] = [];
  if (chatgptAvailable()) providers.push({ label: "ChatGPT", run: () => cached(`gpt:${key}`, () => askChatGPT(question, city)) });
  if (claudeAvailable()) providers.push({ label: "Claude", run: () => cached(`claude:${key}`, () => askClaude(question, city)) });

  const results = await Promise.all(
    providers.map(async (p): Promise<ProviderResult> => {
      try {
        const a = await p.run();
        const an = await analyse(a.answer, business, city);
        const domains = [...new Set(a.sources.map((s) => domainOf(s.url)).filter(Boolean))];
        return {
          label: p.label,
          ok: true,
          cited: an.target_cited,
          position: an.target_position,
          recommended: an.recommended,
          answer: a.answer,
          sourceDomains: domains.slice(0, 8),
        };
      } catch (e) {
        console.error(`[check] ${p.label}`, e);
        return { label: p.label, ok: false, cited: false, position: null, recommended: [], answer: "", sourceDomains: [] };
      }
    }),
  );

  return { business, trade, city, question, results };
}
