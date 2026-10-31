import { describe, expect, it } from 'vitest'
import { labelFontSize, shapeBox, shapeCenter } from './shapes'

describe('shapeCenter', () => {
  it('dikdörtgenin ortasını bulur', () => {
    expect(shapeCenter({ type: 'rect', x: 10, y: 20, width: 40, height: 20 })).toEqual({
      x: 30,
      y: 30,
    })
  })

  it('üçgenin ağırlık merkezini bulur', () => {
    const center = shapeCenter({ type: 'polygon', points: '0,0 30,0 0,30' })
    expect(center).toEqual({ x: 10, y: 10 })
  })
})

describe('shapeBox', () => {
  it('dairenin kutusunu verir', () => {
    expect(shapeBox({ type: 'circle', cx: 0, cy: 0, r: 5 })).toEqual({ width: 10, height: 10 })
  })

  it('çokgenin kutusunu %60 daraltır', () => {
    const box = shapeBox({ type: 'polygon', points: '0,0 100,0 0,30' })
    expect(box.width).toBeCloseTo(60)
    expect(box.height).toBeCloseTo(18)
  })
})

describe('labelFontSize', () => {
  it('büyük kutuda üst sınıra takılır', () => {
    expect(labelFontSize({ width: 100, height: 100 }, 1)).toBe(26)
  })

  it('çok küçük kutuda alt sınıra takılır', () => {
    expect(labelFontSize({ width: 10, height: 10 }, 8)).toBe(9)
  })

  it('alçak kutuda yüksekliğe göre küçülür', () => {
    expect(labelFontSize({ width: 100, height: 20 }, 1)).toBe(16)
  })
})
