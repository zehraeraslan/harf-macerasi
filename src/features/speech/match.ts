const NUMBER_WORDS = [
  'sıfır',
  'bir',
  'iki',
  'üç',
  'dört',
  'beş',
  'altı',
  'yedi',
  'sekiz',
  'dokuz',
  'on',
  'on bir',
  'on iki',
  'on üç',
  'on dört',
  'on beş',
  'on altı',
  'on yedi',
  'on sekiz',
  'on dokuz',
  'yirmi',
]

/** Sert ünsüz çiftleri: tanıyıcı sıkça birini diğeriyle karıştırır (t/d, k/g, p/b...). */
const VOICING: Record<string, string> = { d: 't', g: 'k', b: 'p', c: 'ç', z: 's', v: 'f', j: 'ş' }

function fold(text: string): string {
  return [...text].map((char) => VOICING[char] ?? char).join('')
}

/** Tanıyıcı bazen rakam döndürür ("on" -> "10"). Küçük sayıları kelimeye çevirir. */
function digitsToWords(text: string): string {
  return text.replace(/\d+/g, (digits) => NUMBER_WORDS[Number(digits)] ?? ' ')
}

/** Küçük harfe çevirir (Türkçe kurallarıyla), şapkalı harfleri düzeltir, noktalamayı atar. */
export function normalize(text: string): string {
  const lower = text
    .toLocaleLowerCase('tr-TR')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
  return digitsToWords(lower)
    .replace(/[^\p{L}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** İki metin arasındaki harf farkı sayısı (Levenshtein). */
export function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
    }
    previous = current
  }
  return previous[b.length]
}

interface MatchOptions {
  /** Cömert mod: tek harf ve kısa hecelerde benzer sesleri de kabul eder. */
  lenient?: boolean
}

/** Duyulan alternatiflerden biri hedefle eşleşiyor mu? */
export function isMatch(
  target: string,
  heard: string[],
  { lenient = false }: MatchOptions = {},
): boolean {
  const goal = normalize(target)
  if (!goal) return false

  const single = [...goal].length === 1
  const accepted = new Set([goal])
  if (single) accepted.add(`${goal}e`) // "n" yerine "ne"

  const strictDistance = goal.length >= 8 ? 2 : goal.length >= 5 ? 1 : 0
  const lenientDistance = goal.length >= 6 ? 2 : goal.length >= 2 ? 1 : 0

  for (const phrase of heard) {
    const text = normalize(phrase)
    if (!text) continue
    const candidates = [text, text.replace(/ /g, ''), ...text.split(' ')]
    for (const candidate of candidates) {
      if (accepted.has(candidate)) return true
      if (strictDistance > 0 && editDistance(candidate, goal) <= strictDistance) return true
      if (!lenient) continue
      if (single) {
        if (candidate.length <= 3 && fold(candidate).includes(fold(goal))) return true
        continue
      }
      if (lenientDistance > 0 && editDistance(fold(candidate), fold(goal)) <= lenientDistance) {
        return true
      }
    }
  }
  return false
}
