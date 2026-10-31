import { describe, expect, it } from 'vitest'
import { alphabet } from '../../../data/alphabet'
import { words } from '../../../data/words'
import { buildPool } from '../balloons/rounds'
import { POT_COUNT, assignLabels, buildPaintSetup, canPaint, paintItems } from './paint'
import { pictures } from './pictures'

/** Testte aynı sonucu veren basit sahte rastgele sayı üreteci. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

describe('assignLabels', () => {
  it('her yazı en az bir kez kullanılır ve dağılım dengelidir', () => {
    const items = ['a', 'n', 'e']
    const labels = assignLabels(10, items, seeded(4))
    expect(labels).toHaveLength(10)
    const counts = items.map((item) => labels.filter((label) => label === item).length)
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(1)
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1)
  })
})

describe('buildPaintSetup', () => {
  const pool = buildPool(alphabet.slice(0, 4), words)

  it('her resim için yazılar parça sayısına eşittir', () => {
    for (const picture of pictures) {
      const setup = buildPaintSetup(picture, pool, seeded(8))
      expect(setup).not.toBeNull()
      expect(setup?.labels).toHaveLength(picture.regions.length)
      expect(new Set(setup?.items).size).toBe(POT_COUNT)
      expect(setup?.colors).toHaveLength(POT_COUNT)
    }
  })

  it('yeterli öğe yoksa kurulum yapılmaz', () => {
    const tiny = buildPool(alphabet.slice(0, 2), words)
    expect(canPaint(tiny, pictures[0])).toBe(false)
    expect(buildPaintSetup(pictures[0], tiny, seeded(1))).toBeNull()
  })

  it('kelime resminde uzun kelimeler kullanılmaz', () => {
    const everything = buildPool(alphabet, words)
    for (const word of paintItems(everything, 'word')) {
      expect(word.length).toBeLessThanOrEqual(5)
    }
  })
})
