import { describe, expect, it } from 'vitest'
import { words } from '../../data/words'
import { syllabify } from './syllables'

describe('syllabify', () => {
  it('tek heceli kelimeleri bölmez', () => {
    expect(syllabify('an')).toEqual(['an'])
    expect(syllabify('tel')).toEqual(['tel'])
  })

  it('iki ünlü arasında tek ünsüz varsa hece o ünsüzle başlar', () => {
    expect(syllabify('nine')).toEqual(['ni', 'ne'])
    expect(syllabify('ata')).toEqual(['a', 'ta'])
    expect(syllabify('ela')).toEqual(['e', 'la'])
    expect(syllabify('lale')).toEqual(['la', 'le'])
  })

  it('iki ünsüz arasında hece bölünür', () => {
    expect(syllabify('anne')).toEqual(['an', 'ne'])
  })

  it('heceler birleşince kelimeyi verir', () => {
    for (const word of words) {
      expect(syllabify(word).join('')).toBe(word)
    }
  })
})
