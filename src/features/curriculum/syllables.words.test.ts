import { describe, expect, it } from 'vitest'
import { words } from '../../data/words'
import { syllabify } from './syllables'

const VOWELS = new Set(['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'])

describe('heceleme, tüm kelime havuzunda', () => {
  it('her hecede tam bir ünlü vardır', () => {
    for (const word of words) {
      for (const syllable of syllabify(word)) {
        const vowelCount = [...syllable].filter((char) => VOWELS.has(char)).length
        expect({ word, syllable, vowelCount }).toEqual({ word, syllable, vowelCount: 1 })
      }
    }
  })
})
