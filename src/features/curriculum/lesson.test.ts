import { describe, expect, it } from 'vitest'
import { alphabet } from '../../data/alphabet'
import {
  MAX_SYLLABLES,
  getNewSyllables,
  getSyllables,
  lettersUpTo,
  pickWords,
  spreadPick,
} from './content'

describe('spreadPick', () => {
  it('liste kısaysa hepsini döndürür', () => {
    expect(spreadPick(['a', 'b'], 6)).toEqual(['a', 'b'])
  })

  it('uzun listeden eşit aralıklarla, tekrarsız seçer', () => {
    const items = Array.from({ length: 16 }, (_, i) => `h${i}`)
    const picked = spreadPick(items, 6)
    expect(picked).toHaveLength(6)
    expect(new Set(picked).size).toBe(6)
    expect(picked[0]).toBe('h0')
  })
})

describe('pickWords', () => {
  it('en kısa kelimeleri önce alır', () => {
    expect(pickWords(['bisiklet', 'balık', 'bal', 'baba'], 3)).toEqual(['bal', 'baba', 'balık'])
  })
})

describe('ğ harfi', () => {
  it('sadece ünlü+ğ heceleri üretir (ağ), ğa üretmez', () => {
    const learned = lettersUpTo(alphabet, 'ğ').filter((l) => l.lower === 'a' || l.lower === 'ğ')
    expect(getSyllables(learned)).toEqual(['ağ'])
  })
})

describe('ders boyutu', () => {
  it('hiçbir harfte ders için seçilen hece sayısı sınırı aşmaz', () => {
    for (let i = 1; i < alphabet.length; i++) {
      const fresh = getNewSyllables(alphabet.slice(0, i), alphabet.slice(0, i + 1))
      expect(spreadPick(fresh, MAX_SYLLABLES).length).toBeLessThanOrEqual(MAX_SYLLABLES)
    }
  })
})
