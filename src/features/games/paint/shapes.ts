export type Shape =
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rotate?: number }
  | { type: 'polygon'; points: string }

export interface Point2 {
  x: number
  y: number
}

export interface Box {
  width: number
  height: number
}

function parsePoints(points: string): Point2[] {
  return points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number)
      return { x, y }
    })
}

/** Şeklin ortası (çokgenlerde köşelerin ortalaması). */
export function shapeCenter(shape: Shape): Point2 {
  switch (shape.type) {
    case 'rect':
      return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 }
    case 'circle':
    case 'ellipse':
      return { x: shape.cx, y: shape.cy }
    case 'polygon': {
      const points = parsePoints(shape.points)
      return {
        x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
        y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
      }
    }
  }
}

/** Yazının sığabileceği yaklaşık kutu (çokgenlerde köşeler dar olduğu için %60). */
export function shapeBox(shape: Shape): Box {
  switch (shape.type) {
    case 'rect':
      return { width: shape.width, height: shape.height }
    case 'circle':
      return { width: shape.r * 2, height: shape.r * 2 }
    case 'ellipse':
      return { width: shape.rx * 2, height: shape.ry * 2 }
    case 'polygon': {
      const points = parsePoints(shape.points)
      const xs = points.map((p) => p.x)
      const ys = points.map((p) => p.y)
      return {
        width: (Math.max(...xs) - Math.min(...xs)) * 0.6,
        height: (Math.max(...ys) - Math.min(...ys)) * 0.6,
      }
    }
  }
}

/** Yazı boyutu: kutuya ve yazı uzunluğuna göre, 9 ile 26 arasında. */
export function labelFontSize(box: Box, length: number): number {
  const byWidth = (box.width * 0.9) / (Math.max(length, 1) * 0.62)
  const byHeight = box.height * 0.8
  return Math.round(Math.min(26, Math.max(9, Math.min(byWidth, byHeight))))
}
