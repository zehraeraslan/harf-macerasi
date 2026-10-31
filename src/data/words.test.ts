import { describe, expect, it } from 'vitest'
import { lettersUpTo, getWords } from '../features/curriculum/content'
import { alphabet } from './alphabet'
import { words } from './words'

describe('kelime havuzu', () => {
  it('tekrar eden kelime yoktur', () => {
    expect(new Set(words).size).toBe(words.length)
  })

  it('her harf için, o harfe kadar öğrenilmiş harflerle yazılabilen kelime vardır', () => {
    // İlk harf (a) tek başına kelime oluşturamaz, onu atla
    for (const letter of alphabet.slice(1)) {
      const available = getWords(lettersUpTo(alphabet, letter.lower), words)
      expect(available.some((word) => word.includes(letter.lower))).toBe(true)
    }
  })
})
