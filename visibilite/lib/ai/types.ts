/** Ce qu'une IA a répondu à la question d'un client. */
export type AiAnswer = {
  provider: "claude" | "chatgpt";
  label: string; // nom affiché : « ChatGPT », « Claude »
  answer: string; // la réponse telle que le client la lit
  sources: { url: string; title: string }[]; // pages web consultées par l'IA
};

export const dedupeSources = (list: { url: string; title: string }[]) => {
  const seen = new Set<string>();
  return list.filter((s) => {
    if (!s.url || seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
};
