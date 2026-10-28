/**
 * Provider docs use Markdown for emphasis and code. Strip the markup for display
 * without changing the wording: `code`, **bold**, *italic*, __bold__, [links](url).
 */
export function plainText(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
