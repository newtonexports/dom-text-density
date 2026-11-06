export interface DensityScore {
  tag: string;
  charCount: number;
  tagCount: number;
  density: number;
  selectorSnippet: string;
}

export function calculateTextDensity(htmlChunk: string): DensityScore {
  const cleanMarkup = htmlChunk.replace(/<!--[\s\S]*?-->/g, "");
  const tagMatches = cleanMarkup.match(/<[^>]+>/g) || [];
  const textContent = cleanMarkup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const charCount = textContent.length;
  const tagCount = tagMatches.length;
  const density = tagCount === 0 ? charCount : Number((charCount / tagCount).toFixed(2));

  const firstTagMatch = cleanMarkup.match(/<([a-zA-Z0-9-]+)([^>]*)>/);
  const selectorSnippet = firstTagMatch ? `<${firstTagMatch[1]}>` : "unknown";

  return {
    tag: firstTagMatch ? firstTagMatch[1].toLowerCase() : "root",
    charCount,
    tagCount,
    density,
    selectorSnippet
  };
}

export function extractHighDensityBlocks(htmlBlocks: string[], threshold = 12.0): string[] {
  return htmlBlocks.filter((block) => calculateTextDensity(block).density >= threshold);
}
