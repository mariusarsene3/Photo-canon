import "server-only";
import { dedupeSources, type AiAnswer } from "./types";
import { Analysis, ANALYSIS_SYSTEM, analysisPrompt } from "../analysis";

// ChatGPT est interrogé par l'API d'OpenAI (Responses API, avec recherche web).
// Facultatif : sans OPENAI_API_KEY, l'outil n'interroge que Claude.
export const chatgptAvailable = () => Boolean(process.env.OPENAI_API_KEY);

type OutputItem = {
  type: string;
  content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[];
};

// Modèle de la réponse « client » (le plus proche de ChatGPT) et modèle de l'analyse (plus léger).
const ANSWER_MODEL = () => process.env.OPENAI_MODEL || "gpt-5.5";
const ANALYSIS_MODEL = () => process.env.OPENAI_ANALYSIS_MODEL || "gpt-5.4-mini";

async function callResponses(body: Record<string, unknown>): Promise<OutputItem[]> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`ChatGPT : erreur ${res.status} ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { output?: OutputItem[] };
  return data.output ?? [];
}

const outputText = (output: OutputItem[]) =>
  output
    .filter((i) => i.type === "message")
    .flatMap((i) => i.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("");

export async function askChatGPT(question: string, city: string): Promise<AiAnswer> {
  const output = await callResponses({
    model: ANSWER_MODEL(),
    input: question,
    tools: [{ type: "web_search", user_location: { type: "approximate", country: "FR", city } }],
  });
  const data = { output };

  let text = "";
  const sources: { url: string; title: string }[] = [];
  for (const item of data.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (c.type !== "output_text") continue;
      text += c.text ?? "";
      for (const a of c.annotations ?? []) {
        if (a.type === "url_citation" && a.url) sources.push({ url: a.url.replace(/[?&]utm_source=openai$/, ""), title: a.title ?? a.url });
      }
    }
  }
  return { provider: "chatgpt", label: "ChatGPT", answer: text.trim(), sources: dedupeSources(sources) };
}

// Même format que l'analyse Claude, décrit en JSON Schema pour OpenAI (mode strict).
const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["recommended", "target_cited", "target_position"],
  properties: {
    recommended: { type: "array", items: { type: "string" } },
    target_cited: { type: "boolean" },
    target_position: { type: ["number", "null"] },
  },
};

/** Analyse faite par ChatGPT, utilisée quand aucune clé Claude n'est configurée. */
export async function analyseWithChatGPT(answer: string, business: string, city: string): Promise<Analysis> {
  const output = await callResponses({
    model: ANALYSIS_MODEL(),
    instructions: ANALYSIS_SYSTEM,
    input: analysisPrompt(answer, business, city),
    text: { format: { type: "json_schema", name: "analyse", strict: true, schema: ANALYSIS_SCHEMA } },
  });
  return Analysis.parse(JSON.parse(outputText(output)));
}
