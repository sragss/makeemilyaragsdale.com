/**
 * Generates pronounceable invite codes like EBR-TOVIK, EBR-BALEN, EBR-MUSEL.
 * Alternates consonants and vowels so every code looks like a real word.
 */

const CONSONANTS = "BDFGKLMNPRSTVZ";
const VOWELS = "AEIOU";

function pick(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

export function generateCode(): string {
  // 5 chars: CVCVC (consonant-vowel-consonant-vowel-consonant)
  const word = [
    pick(CONSONANTS),
    pick(VOWELS),
    pick(CONSONANTS),
    pick(VOWELS),
    pick(CONSONANTS),
  ].join("");

  return `EBR-${word}`;
}
