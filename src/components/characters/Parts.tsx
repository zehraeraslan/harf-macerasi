import type { CharacterMood } from './types'
interface EyesProps {
  left: number
  right: number
  y: number
  happy: boolean
  radius?: number
}

/** Normalde yuvarlak, mutluyken kapalı gülen gözler. */
export function Eyes({ left, right, y, happy, radius = 8 }: EyesProps) {
  if (happy) {
    const w = radius + 1
    return (
      <g fill="none" stroke="#3b2e5a" strokeWidth={radius * 0.6} strokeLinecap="round">
        <path d={`M${left - w} ${y + 3} Q${left} ${y - w * 1.4} ${left + w} ${y + 3}`} />
        <path d={`M${right - w} ${y + 3} Q${right} ${y - w * 1.4} ${right + w} ${y + 3}`} />
      </g>
    )
  }
  return (
    <g className="eyes">
      <circle cx={left} cy={y} r={radius} fill="#3b2e5a" />
      <circle cx={right} cy={y} r={radius} fill="#3b2e5a" />
      <circle cx={left + radius * 0.4} cy={y - radius * 0.4} r={radius * 0.32} fill="#fff" />
      <circle cx={right + radius * 0.4} cy={y - radius * 0.4} r={radius * 0.32} fill="#fff" />
    </g>
  )
}

const spots = [
  { x: 28, y: 44, color: '#7b5cfa', delay: 0 },
  { x: 172, y: 52, color: '#3ec1f3', delay: 0.25 },
  { x: 166, y: 150, color: '#ff4f81', delay: 0.5 },
]

/** Mutlu anlarda karakterin etrafında parlayan yıldızlar. */
export function Sparkles() {
  return (
    <g aria-hidden="true">
      {spots.map((spot) => (
        <g key={spot.x} transform={`translate(${spot.x} ${spot.y})`}>
          <path
            className="sparkle"
            d="M0 -12 L3.5 -3.5 L12 0 L3.5 3.5 L0 12 L-3.5 3.5 L-12 0 L-3.5 -3.5 Z"
            fill={spot.color}
            style={{ animationDelay: `${spot.delay}s` }}
          />
        </g>
      ))}
    </g>
  )
}

interface MouthProps {
  cx: number
  y: number
  mood: CharacterMood
  width?: number
}

/** Ruh haline göre değişen ağız: gülümseme, konuşma, açık kahkaha. */
export function Mouth({ cx, y, mood, width = 14 }: MouthProps) {
  if (mood === 'happy') {
    return (
      <path
        d={`M${cx - width} ${y} Q${cx} ${y + width * 1.8} ${cx + width} ${y} Z`}
        fill="#c4325f"
      />
    )
  }
  if (mood === 'talking') {
    return (
      <g className="mouth">
        <ellipse cx={cx} cy={y + 4} rx={width * 0.45} ry={width * 0.5} fill="#c4325f" />
      </g>
    )
  }
  return (
    <path
      d={`M${cx - width * 0.7} ${y} Q${cx} ${y + width * 0.8} ${cx + width * 0.7} ${y}`}
      fill="none"
      stroke="#3b2e5a"
      strokeWidth="3"
      strokeLinecap="round"
    />
  )
}
