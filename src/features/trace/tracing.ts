export interface Point {
  x: number
  y: number
}

/** Parmağın yoldan en fazla ne kadar uzakta olabileceği (kutu birimi). Zorluğu buradan ayarla. */
export const TOLERANCE = 11

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Bir vuruştaki ilerlemeyi günceller.
 * samples: vuruşun yol üzerindeki noktaları, current: ulaşılan nokta (-1 = başlanmadı).
 */
export function advance(
  samples: Point[],
  current: number,
  pointer: Point,
  tolerance = TOLERANCE,
  lookahead = 12,
): number {
  if (current < 0) {
    return distance(pointer, samples[0]) <= tolerance * 1.6 ? 0 : -1
  }
  const last = Math.min(current + lookahead, samples.length - 1)
  for (let i = last; i > current; i--) {
    if (distance(pointer, samples[i]) <= tolerance) return i
  }
  return current
}

/** Vuruş tamamlandı mı? (Son noktaya çok yaklaşmak yeterli.) */
export function isComplete(samples: Point[], current: number): boolean {
  return current >= samples.length - 2
}

export function progressPercent(samples: Point[], current: number): number {
  if (current < 0) return 0
  if (isComplete(samples, current)) return 100
  return ((current + 1) / samples.length) * 100
}
