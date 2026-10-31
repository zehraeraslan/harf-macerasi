import { describe, expect, it } from 'vitest'
import { alphabet } from '../../../data/alphabet'
import {
  dealCards,
  flipCard,
  memoryDone,
  memoryStars,
  pickLetters,
  resolveFlips,
  startMemory,
} from './memory'
import type { Card } from './memory'

/** Testte aynı sonucu veren basit sahte rastgele sayı üreteci. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const cards: Card[] = [
  { id: 0, pairId: 'a', face: 'A', say: 'a' },
  { id: 1, pairId: 'a', face: 'a', say: 'a' },
  { id: 2, pairId: 'n', face: 'N', say: 'n' },
  { id: 3, pairId: 'n', face: 'n', say: 'n' },
]

describe('dealCards', () => {
  it('her harf için büyük ve küçük iki kart dağıtır', () => {
    const dealt = dealCards(alphabet.slice(0, 3), seeded(2))
    expect(dealt).toHaveLength(6)
    expect(dealt.map((card) => card.face).sort()).toEqual(['A', 'E', 'N', 'a', 'e', 'n'].sort())
  })

  it('i harfinin büyüğü İ, ı harfinin büyüğü I olur', () => {
    const letters = alphabet.filter((letter) => letter.lower === 'i' || letter.lower === 'ı')
    const faces = dealCards(letters, seeded(5)).map((card) => card.face)
    expect(faces.sort()).toEqual(['I', 'İ', 'i', 'ı'].sort())
  })
})

describe('pickLetters', () => {
  it('son öğrenilen harfleri ve eskilerden rastgele harfleri seçer', () => {
    const picked = pickLetters(alphabet.slice(0, 10), 6, seeded(3))
    expect(picked).toHaveLength(6)
    expect(picked.slice(0, 3).map((letter) => letter.lower)).toEqual(['k', 'u', 'r'])
    expect(new Set(picked.map((letter) => letter.lower)).size).toBe(6)
  })

  it('az harf öğrenildiyse hepsini alır', () => {
    expect(pickLetters(alphabet.slice(0, 3), 6, seeded(1))).toHaveLength(3)
  })
})

describe('kart çevirme', () => {
  it('eşleşen kartlar kalıcı olur', () => {
    const state = resolveFlips(flipCard(flipCard(startMemory(cards), 0), 1))
    expect(state.matched).toEqual(['a'])
    expect(state.flipped).toEqual([])
    expect(state.moves).toBe(1)
  })

  it('eşleşmeyen kartlar kapanır', () => {
    const state = resolveFlips(flipCard(flipCard(startMemory(cards), 0), 2))
    expect(state.matched).toEqual([])
    expect(state.flipped).toEqual([])
    expect(state.moves).toBe(1)
  })

  it('iki kart açıkken üçüncü kart çevrilmez', () => {
    const state = flipCard(flipCard(flipCard(startMemory(cards), 0), 2), 1)
    expect(state.flipped).toEqual([0, 2])
  })

  it('aynı kart iki kez çevrilmez', () => {
    const state = flipCard(flipCard(startMemory(cards), 0), 0)
    expect(state.flipped).toEqual([0])
  })

  it('eşleşmiş kart tekrar çevrilmez', () => {
    const matched = resolveFlips(flipCard(flipCard(startMemory(cards), 0), 1))
    expect(flipCard(matched, 0)).toBe(matched)
  })

  it('bütün çiftler bulununca oyun biter', () => {
    let state = startMemory(cards)
    state = resolveFlips(flipCard(flipCard(state, 0), 1))
    expect(memoryDone(state)).toBe(false)
    state = resolveFlips(flipCard(flipCard(state, 2), 3))
    expect(memoryDone(state)).toBe(true)
  })
})

describe('memoryStars', () => {
  it('az hamle çok yıldız verir', () => {
    expect(memoryStars(6, 6)).toBe(3)
    expect(memoryStars(12, 6)).toBe(2)
    expect(memoryStars(20, 6)).toBe(1)
  })
})
