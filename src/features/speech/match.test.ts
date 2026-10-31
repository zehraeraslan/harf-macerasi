import { describe, expect, it } from 'vitest'
import { editDistance, isMatch, normalize } from './match'

describe('normalize', () => {
  it('Türkçe kurallarıyla küçültür ve noktalamayı atar', () => {
    expect(normalize('Ana!')).toBe('ana')
    expect(normalize('IŞIK')).toBe('ışık')
    expect(normalize('  İl  ')).toBe('il')
  })

  it('şapkalı harfleri düz harfe çevirir', () => {
    expect(normalize('Ân')).toBe('an')
  })

  it('rakamları kelimeye çevirir', () => {
    expect(normalize('10')).toBe('on')
    expect(normalize('3')).toBe('üç')
  })
})

describe('editDistance', () => {
  it('harf farkını sayar', () => {
    expect(editDistance('papatya', 'papaya')).toBe(1)
    expect(editDistance('kale', 'kale')).toBe(0)
  })
})

describe('isMatch (sıkı mod)', () => {
  it('doğru söylenen kelimeyi kabul eder', () => {
    expect(isMatch('ana', ['Ana.'])).toBe(true)
  })

  it('alternatiflerden biri tutarsa kabul eder', () => {
    expect(isMatch('kale', ['bale', 'kale'])).toBe(true)
  })

  it('cümle içinde geçen kelimeyi kabul eder', () => {
    expect(isMatch('ana', ['bana ana'])).toBe(true)
  })

  it('rakam olarak duyulan kelimeyi kabul eder', () => {
    expect(isMatch('on', ['10'])).toBe(true)
    expect(isMatch('üç', ['3'])).toBe(true)
  })

  it('uzun kelimelerde bir harf hatayı affeder', () => {
    expect(isMatch('papatya', ['papaya'])).toBe(true)
  })

  it('kısa kelimelerde hata payı tanımaz', () => {
    expect(isMatch('ana', ['bana'])).toBe(false)
    expect(isMatch('kale', ['kalem'])).toBe(false)
    expect(isMatch('an', ['kan'])).toBe(false)
  })

  it('tek ünsüz harf için harf adını da kabul eder', () => {
    expect(isMatch('n', ['ne'])).toBe(true)
    expect(isMatch('n', ['an'])).toBe(false)
  })

  it('hiçbir şey duyulmadıysa eşleşmez', () => {
    expect(isMatch('an', [])).toBe(false)
  })
})

describe('isMatch (cömert mod)', () => {
  const lenient = { lenient: true }

  it('kısa hecede benzer sesi kabul eder', () => {
    expect(isMatch('an', ['kan'], lenient)).toBe(true)
    expect(isMatch('ta', ['da'], lenient)).toBe(true)
  })

  it('tek harf için içinde geçen sesi kabul eder', () => {
    expect(isMatch('a', ['ah'], lenient)).toBe(true)
  })

  it('tamamen farklı sesi yine de reddeder', () => {
    expect(isMatch('an', ['ben'], lenient)).toBe(false)
  })
})
