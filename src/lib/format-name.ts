/**
 * Tidy a hand-entered name for display, without changing what was stored.
 *
 * Both /address and /rsvp take free-text names, so they arrive with stray
 * spacing, lowercase surnames ("Will gabriel"), and a mix of "and" / "&"
 * between partners. This normalises those three things only.
 *
 * It never lowercases a letter the person capitalised themselves, so
 * intentional spellings survive: TJ, AnaClare, LeeAn, McCormack, Jean-Marc.
 * Genuine misspellings are left alone — fix those at the source.
 */
export function formatDisplayName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\band\b/gi, "&")
    .replace(/\s*&\s*/g, " & ")
    .split(" ")
    .map(capitalizeWord)
    .join(" ")
    .trim();
}

/** Uppercase the first letter of the word and of each hyphenated part. */
function capitalizeWord(word: string): string {
  return word
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join("-");
}
