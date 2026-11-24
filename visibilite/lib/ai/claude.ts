import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { dedupeSources, type AiAnswer } from "./types";

let client: Anthropic | null = null;
export const getClaude = () => (client ??= new Anthropic()); // lit ANTHROPIC_API_KEY
export const claudeAvailable = () => Boolean(process.env.ANTHROPIC_API_KEY);

export const MODEL = "claude-opus-5-5";

/**
 * Pose la question à Claude, avec recherche sur Internet, comme le ferait un client.
 * Pas de consigne particulière : on veut la réponse qu'un client obtiendrait vraiment.
 */
export async function askClaude(question: string, city: string): Promise<AiAnswer> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: question }];
  let text = "";
  const sources: { url: string; title: string }[] = [];

  // La recherche web peut mettre le tour en pause (pause_turn) : on relance alors la suite.
  for (let i = 0; i < 3; i++) {
    const response = await getClaude().beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      // Si le modèle principal décline la demande, l'API la relance sur un modèle de repli.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: 3,
          user_location: { type: "approximate", city, country: "FR", timezone: "Europe/Paris" },
        },
      ],
      messages,
    });

    for (const block of response.content) {
      if (block.type === "text") text += block.text;
      else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
        for (const r of block.content) sources.push({ url: r.url, title: r.title });
      }
    }
    if (response.stop_reason === "refusal") throw new Error("Claude a refusé de répondre");
    if (response.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: response.content });
  }

  return { provider: "claude", label: "Claude", answer: text.trim(), sources: dedupeSources(sources) };
}
