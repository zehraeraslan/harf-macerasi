import { describe, expect, it } from 'vitest'
import { alphabet } from './alphabet'
import { castByLetter } from './cast'

describe('karakter dağılımı', () => {
  it('her harfin bir karakteri vardır', () => {
    for (const letter of alphabet) {
      expect(castByLetter[letter.lower]).toBeDefined()
    }
  })

  it('hiçbir karakter iki farklı harfte tekrar etmez', () => {
    const kinds = alphabet.map((letter) => castByLetter[letter.lower])
    expect(new Set(kinds).size).toBe(kinds.length)
  })
})
