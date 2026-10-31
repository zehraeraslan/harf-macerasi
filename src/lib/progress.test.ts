import { describe, expect, it } from 'vitest'
import {
  completedCount,
  emptyProgress,
  parseProgress,
  totalStars,
  withStars,
  withSticker,
} from './progress'

const order = ['a', 'n', 'e', 't']
const validStickers = ['x1', 'x2']

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

  it('çıkartma alanı olmayan eski kaydı sorunsuz okur', () => {
    const raw = '{"version":1,"stars":{"a":2}}'
    expect(parseProgress(raw, order, validStickers)).toEqual({
      version: 1,
      stars: { a: 2 },
      stickers: [],
    })
  })

  it('geçersiz ve tekrar eden çıkartmaları ayıklar', () => {
    const raw = '{"version":1,"stars":{},"stickers":["x1","x1","zz",5]}'
    expect(parseProgress(raw, order, validStickers).stickers).toEqual(['x1'])
  })
})

describe('completedCount', () => {
  it('baştan üst üste tamamlanan harfleri sayar', () => {
    const progress = { ...emptyProgress, stars: { a: 2, n: 1, t: 3 } }
    expect(completedCount(progress, order)).toBe(2)
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

  it('çıkartmaları korur', () => {
    const owned = withSticker(emptyProgress, 'x1')
    expect(withStars(owned, 'a', 2).stickers).toEqual(['x1'])
  })
})

describe('withSticker', () => {
  it('çıkartmayı bir kez ekler', () => {
    const once = withSticker(emptyProgress, 'x1')
    expect(once.stickers).toEqual(['x1'])
    expect(withSticker(once, 'x1')).toBe(once)
  })
})

describe('totalStars', () => {
  it('tüm yıldızları toplar', () => {
    expect(totalStars({ ...emptyProgress, stars: { a: 3, n: 2 } })).toBe(5)
  })
})
