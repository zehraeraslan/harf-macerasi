import type { Letter } from '../../types/curriculum'

/** Alfabede verilen harfe kadar (o dahil) öğrenilmiş harfleri döndürür. */
export function lettersUpTo(alphabet: Letter[], lower: string): Letter[] {
  const index = alphabet.findIndex((letter) => letter.lower === lower)
  return index === -1 ? [] : alphabet.slice(0, index + 1)
}

/** Öğrenilmiş harflerden üretilebilen ünsüz+ünlü ve ünlü+ünsüz heceleri döndürür. */
export function getSyllables(learned: Letter[]): string[] {
  const vowels = learned.filter((letter) => letter.kind === 'vowel')
  const consonants = learned.filter((letter) => letter.kind === 'consonant')
  const result: string[] = []

  for (const consonant of consonants) {
    for (const vowel of vowels) {
      result.push(vowel.lower + consonant.lower) // an
      result.push(consonant.lower + vowel.lower) // na
    }
  }
  return result
}

/** Sadece öğrenilmiş harflerden oluşan kelimeleri döndürür. */
export function getWords(learned: Letter[], words: string[]): string[] {
  const known = new Set(learned.map((letter) => letter.lower))
  return words.filter((word) => [...word].every((char) => known.has(char)))
}

/** Yeni harf eklenince ortaya çıkan heceler (önceden olmayanlar). */
export function getNewSyllables(previous: Letter[], next: Letter[]): string[] {
  const before = new Set(getSyllables(previous))
  return getSyllables(next).filter((syllable) => !before.has(syllable))
}
