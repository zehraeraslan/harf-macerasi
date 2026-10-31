import type { RoundKind } from '../balloons/rounds'
import type { Point2, Shape } from './shapes'

export interface Region {
  id: string
  shape: Shape
  /** Yazının duracağı yer (başka parçalar şeklin ortasını örtüyorsa) */
  labelAt?: Point2
}

export interface Picture {
  id: string
  title: string
  icon: string
  /** Bu resimde hangi türden yazılar kullanılır */
  kind: RoundKind
  viewBox: string
  regions: Region[]
  /** Boyanmayan süsler (göz gibi) */
  decor?: { cx: number; cy: number; r: number; fill: string }[]
}

const round1 = (value: number) => Math.round(value * 10) / 10

const petals: Region[] = [0, 60, 120, 180, 240, 300].map((angle) => {
  const radians = (angle * Math.PI) / 180
  return {
    id: `petal-${angle}`,
    shape: {
      type: 'ellipse',
      cx: round1(150 + 40 * Math.sin(radians)),
      cy: round1(90 - 40 * Math.cos(radians)),
      rx: 20,
      ry: 36,
      rotate: angle,
    },
  }
})

export const pictures: Picture[] = [
  {
    id: 'house',
    title: 'Ev',
    icon: '🏠',
    kind: 'letter',
    viewBox: '0 0 300 240',
    regions: [
      { id: 'grass', shape: { type: 'rect', x: 0, y: 200, width: 300, height: 40 } },
      { id: 'chimney', shape: { type: 'rect', x: 190, y: 38, width: 24, height: 50 } },
      {
        id: 'wall',
        shape: { type: 'rect', x: 75, y: 100, width: 150, height: 102 },
        labelAt: { x: 104, y: 176 },
      },
      { id: 'roof', shape: { type: 'polygon', points: '55,102 150,30 245,102' } },
      { id: 'door', shape: { type: 'rect', x: 134, y: 142, width: 34, height: 60, rx: 4 } },
      { id: 'window-left', shape: { type: 'rect', x: 90, y: 116, width: 34, height: 30, rx: 4 } },
      { id: 'window-right', shape: { type: 'rect', x: 176, y: 116, width: 34, height: 30, rx: 4 } },
      { id: 'sun', shape: { type: 'circle', cx: 252, cy: 44, r: 28 } },
    ],
  },
  {
    id: 'flower',
    title: 'Çiçek',
    icon: '🌼',
    kind: 'syllable',
    viewBox: '0 0 300 250',
    regions: [
      { id: 'stem', shape: { type: 'rect', x: 137, y: 120, width: 26, height: 120 } },
      {
        id: 'leaf-left',
        shape: { type: 'ellipse', cx: 108, cy: 196, rx: 28, ry: 11, rotate: -30 },
      },
      {
        id: 'leaf-right',
        shape: { type: 'ellipse', cx: 192, cy: 172, rx: 28, ry: 11, rotate: 30 },
      },
      ...petals,
      { id: 'center', shape: { type: 'circle', cx: 150, cy: 90, r: 24 } },
    ],
  },
  {
    id: 'fish',
    title: 'Balık',
    icon: '🐟',
    kind: 'word',
    viewBox: '0 0 300 200',
    regions: [
      { id: 'tail', shape: { type: 'polygon', points: '205,100 272,52 272,148' } },
      {
        id: 'top-fin',
        shape: { type: 'polygon', points: '108,56 140,20 176,58' },
        labelAt: { x: 141, y: 34 },
      },
      {
        id: 'bottom-fin',
        shape: { type: 'polygon', points: '118,146 150,182 178,144' },
        labelAt: { x: 150, y: 168 },
      },
      { id: 'body', shape: { type: 'ellipse', cx: 140, cy: 100, rx: 82, ry: 54 } },
      { id: 'bubble-1', shape: { type: 'circle', cx: 46, cy: 56, r: 17 } },
      { id: 'bubble-2', shape: { type: 'circle', cx: 20, cy: 26, r: 13 } },
      { id: 'bubble-3', shape: { type: 'circle', cx: 62, cy: 22, r: 12 } },
    ],
    decor: [
      { cx: 92, cy: 90, r: 8, fill: '#3b2e5a' },
      { cx: 94.5, cy: 87.5, r: 2.6, fill: '#ffffff' },
    ],
  },
]
