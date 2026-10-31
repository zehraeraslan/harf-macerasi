import { describe, expect, it } from 'vitest'
import { alphabet } from './alphabet'

describe('alfabe', () => {
  it('29 harf içerir ve hiçbiri tekrar etmez', () => {
    expect(alphabet).toHaveLength(29)
    expect(new Set(alphabet.map((letter) => letter.lower)).size).toBe(29)
  })

  it('MEB grup sırasına uyar', () => {
    expect(alphabet.map((letter) => letter.lower).join('')).toBe('anetilokurımüsöydzçbgcşphvğfj')
  })

  it('gruplar 6-6-6-5-6 harften oluşur', () => {
    const counts = [1, 2, 3, 4, 5].map(
      (group) => alphabet.filter((letter) => letter.group === group).length,
    )
    expect(counts).toEqual([6, 6, 6, 5, 6])
  })

  it('sekiz ünlü harf vardır', () => {
    const vowels = alphabet.filter((letter) => letter.kind === 'vowel').map((l) => l.lower)
    expect(vowels.sort()).toEqual(['a', 'e', 'i', 'o', 'u', 'ı', 'ö', 'ü'].sort())
  })
})
