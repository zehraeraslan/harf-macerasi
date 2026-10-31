import { describe, expect, it } from 'vitest'
import { critterLooks } from './critterLooks'

describe('karakter fabrikası', () => {
  const looks = Object.values(critterLooks)

  it('her karakterin adı benzersizdir', () => {
    expect(new Set(looks.map((look) => look.name)).size).toBe(looks.length)
  })

  it('renk, kulak ve aksesuar birleşimi benzersizdir', () => {
    const combos = looks.map((look) => `${look.body}|${look.ears}|${look.accessory}`)
    expect(new Set(combos).size).toBe(combos.length)
  })

  it('ses inceliği geçerli aralıktadır', () => {
    for (const look of looks) {
      expect(look.pitch).toBeGreaterThanOrEqual(1)
      expect(look.pitch).toBeLessThanOrEqual(2)
    }
  })
})
