import { describe, expect, it } from 'vitest'
import { advance, isComplete, progressPercent } from './tracing'
import type { Point } from './tracing'

/** (0,0)'dan (60,0)'a 3'er birim arayla 21 nokta. */
const line: Point[] = Array.from({ length: 21 }, (_, i) => ({ x: i * 3, y: 0 }))

describe('advance', () => {
  it('başlangıçtan uzakta başlanırsa ilerleme olmaz', () => {
    expect(advance(line, -1, { x: 40, y: 0 })).toBe(-1)
  })

  it('başlangıç noktasına yakın dokunulursa vuruş başlar', () => {
    expect(advance(line, -1, { x: 5, y: 3 })).toBe(0)
  })

  it('yol boyunca ilerleyince en uzak yakın noktaya geçer', () => {
    expect(advance(line, 0, { x: 15, y: 0 })).toBe(8)
  })

  it('yoldan uzaklaşılırsa ilerleme olduğu yerde kalır', () => {
    expect(advance(line, 5, { x: 30, y: 40 })).toBe(5)
  })

  it('çok uzağa atlayarak kestirme yapılamaz', () => {
    expect(advance(line, 0, { x: 60, y: 0 })).toBe(0)
  })

  it('geriye gidilirse ilerleme azalmaz', () => {
    expect(advance(line, 10, { x: 6, y: 0 })).toBe(10)
  })
})

describe('isComplete ve progressPercent', () => {
  it('son noktalara ulaşınca vuruş tamamlanır', () => {
    expect(isComplete(line, 19)).toBe(true)
    expect(isComplete(line, 18)).toBe(false)
    expect(progressPercent(line, 20)).toBe(100)
  })

  it('başlanmamış vuruşun ilerlemesi sıfırdır', () => {
    expect(progressPercent(line, -1)).toBe(0)
  })

  it('iki noktalı vuruş (nokta) dokunmakla tamamlanır', () => {
    const dot: Point[] = [
      { x: 50, y: 26 },
      { x: 50, y: 27 },
    ]
    const started = advance(dot, -1, { x: 52, y: 28 })
    expect(isComplete(dot, started)).toBe(true)
  })
})
