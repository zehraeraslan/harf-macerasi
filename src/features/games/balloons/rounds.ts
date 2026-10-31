import type { Letter } from '../../../types/curriculum'
import { getSyllables, getWords } from '../../curriculum/content'

export type RoundKind = 'letter' | 'syllable' | 'word'

export interface Round {
  kind: RoundKind
  /** Karakterin söylediği, çocuğun bulması gereken öğe */
  target: string
  /** Balonlardaki seçenekler (hedef dahil, karışık sırada) */
  options: string[]
}

export interface Pool {
  letter: string[]
  syllable: string[]
  word: string[]
}

const KINDS: RoundKind[] = ['letter', 'syllable', 'word']
const OPTION_COUNT = 4
const MIN_POOL = 3

/** Öğrenilmiş harflerden oyunda kullanılabilecek harf, hece ve kelime havuzu. */
export function buildPool(learned: Letter[], words: string[]): Pool {
  return {
    // ğ tek başına söylenmez, harf sorusu olarak kullanılmaz
    letter: learned.filter((letter) => !letter.onlyAfterVowel).map((letter) => letter.lower),
    syllable: getSyllables(learned),
    word: getWords(learned, words),
  }
}

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Oyun için sorular üretir. Soru türleri sırayla değişir (harf, hece, kelime),
 * yeterli öğesi olmayan tür atlanır. Aynı hedef mümkün olduğunca tekrarlanmaz.
 */
export function buildRounds(
  pool: Pool,
  count: number,
  rng: () => number,
  optionCount = OPTION_COUNT,
): Round[] {
  const kinds = KINDS.filter((kind) => pool[kind].length >= MIN_POOL)
  if (kinds.length === 0) return []

  const queues: Record<RoundKind, string[]> = {
    letter: shuffle(pool.letter, rng),
    syllable: shuffle(pool.syllable, rng),
    word: shuffle(pool.word, rng),
  }
  const taken: Record<RoundKind, number> = { letter: 0, syllable: 0, word: 0 }
  const rounds: Round[] = []

  for (let i = 0; i < count; i++) {
    const kind = kinds[i % kinds.length]
    const queue = queues[kind]
    const target = queue[taken[kind] % queue.length]
    taken[kind]++

    const distractors = shuffle(
      pool[kind].filter((item) => item !== target),
      rng,
    )
      .sort((a, b) => Math.abs(a.length - target.length) - Math.abs(b.length - target.length))
      .slice(0, optionCount - 1)

    rounds.push({ kind, target, options: shuffle([target, ...distractors], rng) })
  }
  return rounds
}
