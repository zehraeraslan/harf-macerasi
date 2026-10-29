import { describe, expect, it } from 'vitest'
import { alphabet } from '../../data/alphabet'
import { words } from '../../data/words'
import { getNewSyllables, getSyllables, getWords, lettersUpTo } from './content'

describe('lettersUpTo', () => {
  it('verilen harfe kadar (o dahil) öğrenilmiş harfleri döndürür', () => {
    const learned = lettersUpTo(alphabet, 'e')
    expect(learned.map((letter) => letter.lower)).toEqual(['a', 'n', 'e'])
  })

  it('bilinmeyen harf için boş liste döndürür', () => {
    expect(lettersUpTo(alphabet, 'x')).toEqual([])
  })
})

describe('getSyllables', () => {
  it('a ve n biliniyorken sadece an ve na üretir', () => {
    const learned = lettersUpTo(alphabet, 'n')
    expect(getSyllables(learned)).toEqual(['an', 'na'])
  })

  it('sadece ünlü ya da sadece ünsüz varken hece üretmez', () => {
    expect(getSyllables(lettersUpTo(alphabet, 'a'))).toEqual([])
  })
})

describe('getNewSyllables', () => {
  it('yeni harf eklenince sadece yeni heceleri döndürür', () => {
    const previous = lettersUpTo(alphabet, 'n')
    const next = lettersUpTo(alphabet, 'e')
    expect(getNewSyllables(previous, next)).toEqual(['en', 'ne'])
  })
})

describe('getWords', () => {
  it('sadece öğrenilmiş harflerden oluşan kelimeleri döndürür', () => {
    const learned = lettersUpTo(alphabet, 'n')
    expect(getWords(learned, words)).toEqual(['an', 'ana'])
  })

  it('henüz görülmemiş harf içeren kelimeleri dışarıda bırakır', () => {
    const learned = lettersUpTo(alphabet, 'a')
    expect(getWords(learned, words)).toEqual([])
  })
})

describe('veri bütünlüğü', () => {
  it('büyük harfler Türkçe kurallara uyar (i -> İ, ı -> I)', () => {
    for (const letter of alphabet) {
      expect(letter.upper).toBe(letter.lower.toLocaleUpperCase('tr-TR'))
    }
  })

  it('kelime havuzundaki her harf alfabede tanımlıdır', () => {
    const known = new Set(alphabet.map((letter) => letter.lower))
    for (const word of words) {
      for (const char of word) {
        expect(known.has(char)).toBe(true)
      }
    }
  })
})
