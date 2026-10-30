import { describe, expect, it } from 'vitest'
import { alphabet } from './alphabet'
import { strokes } from './strokes'

describe('harf vuruşları', () => {
  it('her harfin yazım verisi vardır', () => {
    for (const letter of alphabet) {
      expect(strokes[letter.lower]?.length).toBeGreaterThan(0)
    }
  })

  it('her vuruş geçerli bir yol komutuyla başlar', () => {
    for (const paths of Object.values(strokes)) {
      for (const d of paths) {
        expect(d.startsWith('M')).toBe(true)
      }
    }
  })
})
