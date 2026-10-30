import type { Point } from './tracing'

const NS = 'http://www.w3.org/2000/svg'

/** Bir SVG yolunu, aralıklı noktalara böler. */
export function samplePath(d: string, spacing = 3): Point[] {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.visibility = 'hidden'

  const path = document.createElementNS(NS, 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  document.body.appendChild(svg)

  try {
    const total = path.getTotalLength()
    const count = Math.max(2, Math.ceil(total / spacing) + 1)
    return Array.from({ length: count }, (_, i) => {
      const point = path.getPointAtLength((total * i) / (count - 1))
      return { x: point.x, y: point.y }
    })
  } finally {
    svg.remove()
  }
}
