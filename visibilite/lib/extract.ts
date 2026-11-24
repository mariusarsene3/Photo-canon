import "server-only";
import type { Analysis } from "./analysis";
import { analyseWithClaude, claudeAvailable } from "./ai/claude";
import { analyseWithChatGPT } from "./ai/chatgpt";

/** Analyse la réponse avec Claude si sa clé est configurée, sinon avec ChatGPT. */
export const analyse = (answer: string, business: string, city: string): Promise<Analysis> =>
  claudeAvailable() ? analyseWithClaude(answer, business, city) : analyseWithChatGPT(answer, business, city);
