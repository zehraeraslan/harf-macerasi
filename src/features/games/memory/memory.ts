import type { Letter } from '../../../types/curriculum'
import { shuffle } from '../balloons/rounds'

export interface Card {
  id: number
  /** Eşleşen iki kartın ortak kimliği (küçük harf) */
  pairId: string
  /** Kartın üzerinde görünen harf */
  face: string
  /** Kart açılınca okunacak ses */
  say: string
}

export interface MemoryState {
  cards: Card[]
  /** Şu an açık olan kartların sırası (en fazla 2) */
  flipped: number[]
  matched: string[]
  moves: number
}

/** Son öğrenilen harflerden yarısı, kalanı daha eski harflerden rastgele seçilir. */
export function pickLetters(learned: Letter[], count: number, rng: () => number): Letter[] {
  const total = Math.min(count, learned.length)
  const recent = learned.slice(-Math.ceil(total / 2))
  const older = shuffle(learned.slice(0, learned.length - recent.length), rng).slice(
    0,
    total - recent.length,
  )
  return [...recent, ...older]
}

/** Her harf için bir büyük, bir küçük kart dağıtır. */
export function dealCards(letters: Letter[], rng: () => number): Card[] {
  const cards = letters.flatMap((letter) => {
    // ğ tek başına söylenmez: "ağ" gibi bir hecenin içinde duyulur
    const sound = letter.onlyAfterVowel ? `a${letter.lower}` : letter.lower
    return [
      { pairId: letter.lower, face: letter.upper, say: sound },
      { pairId: letter.lower, face: letter.lower, say: sound },
    ]
  })
  return shuffle(cards, rng).map((card, id) => ({ ...card, id }))
}

export function startMemory(cards: Card[]): MemoryState {
  return { cards, flipped: [], matched: [], moves: 0 }
}

export function canFlip(state: MemoryState, index: number): boolean {
  const card = state.cards[index]
  return (
    card !== undefined &&
    state.flipped.length < 2 &&
    !state.flipped.includes(index) &&
    !state.matched.includes(card.pairId)
  )
}

export function flipCard(state: MemoryState, index: number): MemoryState {
  return canFlip(state, index) ? { ...state, flipped: [...state.flipped, index] } : state
}

/** İki kart açıksa: eşleşiyorlarsa kalıcı yapar, eşleşmiyorlarsa kapatır. Bir hamle sayılır. */
export function resolveFlips(state: MemoryState): MemoryState {
  if (state.flipped.length < 2) return state
  const [first, second] = state.flipped
  const same = state.cards[first].pairId === state.cards[second].pairId
  return {
    ...state,
    flipped: [],
    matched: same ? [...state.matched, state.cards[first].pairId] : state.matched,
    moves: state.moves + 1,
  }
}

export function memoryDone(state: MemoryState): boolean {
  return state.matched.length * 2 === state.cards.length
}

/** Az hamle = çok yıldız. */
export function memoryStars(moves: number, pairs: number): number {
  if (moves <= pairs + 3) return 3
  return moves <= pairs * 2 + 2 ? 2 : 1
}
