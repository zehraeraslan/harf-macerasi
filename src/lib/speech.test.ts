import { describe, expect, it } from 'vitest'
import { clipKey } from './speech'

describe('clipKey', () => {
  it('cümleleri dosya adına çevirir', () => {
    expect(clipKey('Merhaba, ben Pıtır!')).toBe('merhaba-ben-pi_ti_r')
  })

  it('Türkçe harfler asla birbiriyle çakışmaz', () => {
    expect(clipKey('i')).toBe('i')
    expect(clipKey('ı')).toBe('i_')
    expect(clipKey('İ')).toBe('i')
    expect(clipKey('I')).toBe('i_')
    expect(clipKey('ğ')).not.toBe(clipKey('g'))
  })
})
