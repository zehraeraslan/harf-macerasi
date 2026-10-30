const VOWELS = new Set(['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'])

/** Türkçe bir kelimeyi hecelerine ayırır: nine -> ni, ne; anne -> an, ne. */
export function syllabify(word: string): string[] {
  const chars = [...word]
  const vowelIndexes = chars.flatMap((char, index) => (VOWELS.has(char) ? [index] : []))
  if (vowelIndexes.length <= 1) return [word]

  const cuts: number[] = []
  for (let k = 0; k < vowelIndexes.length - 1; k++) {
    const current = vowelIndexes[k]
    const next = vowelIndexes[k + 1]
    const consonantsBetween = next - current - 1
    // 0 ya da 1 ünsüz: sonraki hece o ünsüzle başlar. 2+ ünsüz: ilk ünsüz öncekine kalır.
    cuts.push(consonantsBetween <= 1 ? next - consonantsBetween : current + 2)
  }

  const parts: string[] = []
  let start = 0
  for (const cut of cuts) {
    parts.push(chars.slice(start, cut).join(''))
    start = cut
  }
  parts.push(chars.slice(start).join(''))
  return parts
}
