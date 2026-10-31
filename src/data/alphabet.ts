import type { Letter } from '../types/curriculum'

/** Öğretim sırası: dizideki sıra, harflerin öğrenilme sırasıdır. */
export const alphabet: Letter[] = [
  // 1. grup
  { lower: 'a', upper: 'A', kind: 'vowel', group: 1 },
  { lower: 'n', upper: 'N', kind: 'consonant', group: 1 },
  { lower: 'e', upper: 'E', kind: 'vowel', group: 1 },
  { lower: 't', upper: 'T', kind: 'consonant', group: 1 },
  { lower: 'i', upper: 'İ', kind: 'vowel', group: 1 },
  { lower: 'l', upper: 'L', kind: 'consonant', group: 1 },
  // 2. grup
  { lower: 'o', upper: 'O', kind: 'vowel', group: 2 },
  { lower: 'k', upper: 'K', kind: 'consonant', group: 2 },
  { lower: 'u', upper: 'U', kind: 'vowel', group: 2 },
  { lower: 'r', upper: 'R', kind: 'consonant', group: 2 },
  { lower: 'ı', upper: 'I', kind: 'vowel', group: 2 },
  { lower: 'm', upper: 'M', kind: 'consonant', group: 2 },
  // 3. grup
  { lower: 'ü', upper: 'Ü', kind: 'vowel', group: 3 },
  { lower: 's', upper: 'S', kind: 'consonant', group: 3 },
  { lower: 'ö', upper: 'Ö', kind: 'vowel', group: 3 },
  { lower: 'y', upper: 'Y', kind: 'consonant', group: 3 },
  { lower: 'd', upper: 'D', kind: 'consonant', group: 3 },
  { lower: 'z', upper: 'Z', kind: 'consonant', group: 3 },
  // 4. grup
  { lower: 'ç', upper: 'Ç', kind: 'consonant', group: 4 },
  { lower: 'b', upper: 'B', kind: 'consonant', group: 4 },
  { lower: 'g', upper: 'G', kind: 'consonant', group: 4 },
  { lower: 'c', upper: 'C', kind: 'consonant', group: 4 },
  { lower: 'ş', upper: 'Ş', kind: 'consonant', group: 4 },
  // 5. grup
  { lower: 'p', upper: 'P', kind: 'consonant', group: 5 },
  { lower: 'h', upper: 'H', kind: 'consonant', group: 5 },
  { lower: 'v', upper: 'V', kind: 'consonant', group: 5 },
  { lower: 'ğ', upper: 'Ğ', kind: 'consonant', group: 5, onlyAfterVowel: true },
  { lower: 'f', upper: 'F', kind: 'consonant', group: 5 },
  { lower: 'j', upper: 'J', kind: 'consonant', group: 5 },
]
