import "server-only";
import { dedupeSources, type AiAnswer } from "./types";

// ChatGPT est interrogé par l'API d'OpenAI (Responses API, avec recherche web).
// Facultatif : sans OPENAI_API_KEY, l'outil n'interroge que Claude.
export const chatgptAvailable = () => Boolean(process.env.OPENAI_API_KEY);

type OutputItem = {
  type: string;
  content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[];
};

export async function askChatGPT(question: string, city: string): Promise<AiAnswer> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: question,
      tools: [{ type: "web_search", user_location: { type: "approximate", country: "FR", city } }],
    }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`ChatGPT : erreur ${res.status}`);
  const data = (await res.json()) as { output?: OutputItem[] };

  let text = "";
  const sources: { url: string; title: string }[] = [];
  for (const item of data.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (c.type !== "output_text") continue;
      text += c.text ?? "";
      for (const a of c.annotations ?? []) {
        if (a.type === "url_citation" && a.url) sources.push({ url: a.url, title: a.title ?? a.url });
      }
    }
  }
  return { provider: "chatgpt", label: "ChatGPT", answer: text.trim(), sources: dedupeSources(sources) };
}
