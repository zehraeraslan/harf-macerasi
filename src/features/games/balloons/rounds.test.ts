import { describe, expect, it } from 'vitest'
import { alphabet } from '../../../data/alphabet'
import { words } from '../../../data/words'
import { buildPool, buildRounds, shuffle } from './rounds'

/** Testte aynı sonucu veren basit sahte rastgele sayı üreteci. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

describe('shuffle', () => {
  it('öğeleri kaybetmeden karıştırır', () => {
    const items = [1, 2, 3, 4, 5]
    expect([...shuffle(items, seeded(7))].sort()).toEqual(items)
  })
})

describe('buildPool', () => {
  it('ğ harfini harf sorusu havuzuna almaz', () => {
    const pool = buildPool(alphabet, words)
    expect(pool.letter).not.toContain('ğ')
    expect(pool.letter).toHaveLength(28)
  })
})

describe('buildRounds', () => {
  const pool = buildPool(alphabet.slice(0, 6), words)

  it('yeterli öğe yoksa soru üretmez', () => {
    expect(buildRounds(buildPool(alphabet.slice(0, 1), words), 4, seeded(1))).toEqual([])
  })

  it('her soruda hedef seçenekler arasındadır ve seçenekler tekrarsızdır', () => {
    const rounds = buildRounds(pool, 6, seeded(3))
    expect(rounds).toHaveLength(6)
    for (const round of rounds) {
      expect(round.options).toContain(round.target)
      expect(new Set(round.options).size).toBe(round.options.length)
      expect(round.options.length).toBeGreaterThanOrEqual(3)
      expect(round.options.length).toBeLessThanOrEqual(4)
    }
  })

  it('soru türleri sırayla değişir', () => {
    const kinds = buildRounds(pool, 6, seeded(5)).map((round) => round.kind)
    expect(kinds).toEqual(['letter', 'syllable', 'word', 'letter', 'syllable', 'word'])
  })

  it('aynı türdeki hedefler mümkün olduğunca tekrar etmez', () => {
    const letters = buildRounds(pool, 6, seeded(9)).filter((round) => round.kind === 'letter')
    expect(new Set(letters.map((round) => round.target)).size).toBe(letters.length)
  })
})
