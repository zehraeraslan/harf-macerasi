import { describe, expect, it } from 'vitest'
import { completedCount, emptyProgress, parseProgress, totalStars, withStars } from './progress'

const order = ['a', 'n', 'e', 't']

describe('parseProgress', () => {
  it('boş ya da bozuk veride boş ilerleme döner', () => {
    expect(parseProgress(null, order)).toEqual(emptyProgress)
    expect(parseProgress('{bozuk', order)).toEqual(emptyProgress)
    expect(parseProgress('[1,2]', order)).toEqual(emptyProgress)
    expect(parseProgress('{"version":2,"stars":{}}', order)).toEqual(emptyProgress)
  })

  it('geçersiz harfleri ve yıldız değerlerini ayıklar', () => {
    const raw = '{"version":1,"stars":{"a":3,"n":2,"x":1,"e":9,"t":0}}'
    expect(parseProgress(raw, order).stars).toEqual({ a: 3, n: 2 })
  })
})

describe('completedCount', () => {
  it('baştan üst üste tamamlanan harfleri sayar', () => {
    expect(completedCount({ version: 1, stars: { a: 2, n: 1, t: 3 } }, order)).toBe(2)
    expect(completedCount(emptyProgress, order)).toBe(0)
  })
})

describe('withStars', () => {
  it('yeni harf ekler, yıldızı azaltmaz', () => {
    const first = withStars(emptyProgress, 'a', 3)
    expect(withStars(first, 'a', 1).stars.a).toBe(3)
    expect(withStars(first, 'n', 2).stars).toEqual({ a: 3, n: 2 })
  })

  it('yıldızı 1-3 aralığına sıkıştırır', () => {
    expect(withStars(emptyProgress, 'a', 9).stars.a).toBe(3)
    expect(withStars(emptyProgress, 'a', 0).stars.a).toBe(1)
  })
})

describe('totalStars', () => {
  it('tüm yıldızları toplar', () => {
    expect(totalStars({ version: 1, stars: { a: 3, n: 2 } })).toBe(5)
  })
})
