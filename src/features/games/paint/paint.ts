import { shuffle } from '../balloons/rounds'
import type { Pool, RoundKind } from '../balloons/rounds'
import type { Picture } from './pictures'

export const PAINT_COLORS = ['#ff4f81', '#3ec1f3', '#ffc93c', '#7b5cfa', '#3ddc97', '#ff8a3d']
export const POT_COUNT = 3
/** Küçük parçalara sığması için boyamada kullanılacak en uzun kelime */
const MAX_WORD_LENGTH = 5

export interface PaintSetup {
  picture: Picture
  /** Boya kaplarındaki yazılar */
  items: string[]
  /** Boya kapları için renkler (items ile aynı sırada) */
  colors: string[]
  /** Resmin her parçasındaki yazı (picture.regions ile aynı sırada) */
  labels: string[]
}

export function paintItems(pool: Pool, kind: RoundKind): string[] {
  return kind === 'word' ? pool.word.filter((word) => word.length <= MAX_WORD_LENGTH) : pool[kind]
}

export function canPaint(pool: Pool, picture: Picture): boolean {
  return paintItems(pool, picture.kind).length >= POT_COUNT
}

/** Parçalara yazıları dengeli dağıtır: her yazı en az bir kez, sayılar en fazla 1 farklı. */
export function assignLabels(regionCount: number, items: string[], rng: () => number): string[] {
  const base = Array.from({ length: regionCount }, (_, i) => items[i % items.length])
  return shuffle(base, rng)
}

export function buildPaintSetup(
  picture: Picture,
  pool: Pool,
  rng: () => number,
): PaintSetup | null {
  const available = paintItems(pool, picture.kind)
  if (available.length < POT_COUNT) return null
  const items = shuffle(available, rng).slice(0, POT_COUNT)
  return {
    picture,
    items,
    colors: shuffle(PAINT_COLORS, rng).slice(0, POT_COUNT),
    labels: assignLabels(picture.regions.length, items, rng),
  }
}
