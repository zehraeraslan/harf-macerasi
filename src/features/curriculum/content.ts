import type { Letter } from '../../types/curriculum'

/** Bir derste en fazla kaç hece ve kelime çalışılır. Çocuğun dikkat süresine göre ayarlanır. */
export const MAX_SYLLABLES = 6
export const MAX_WORDS = 4

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
      if (!consonant.onlyAfterVowel) result.push(consonant.lower + vowel.lower) // na
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

/** Listeden en fazla `max` öğeyi, listeye eşit aralıklarla yayılmış şekilde seçer. */
export function spreadPick<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items
  return Array.from({ length: max }, (_, i) => items[Math.floor((i * items.length) / max)])
}

/** En kısa kelimeleri önce alır: kısa kelimeler başlangıç için daha kolaydır. */
export function pickWords(candidates: string[], max = MAX_WORDS): string[] {
  return [...candidates].sort((a, b) => a.length - b.length).slice(0, max)
}
