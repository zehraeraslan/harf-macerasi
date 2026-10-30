import { Eyes } from './Parts'
import type { CharacterMood } from './types'

export function Cat({ mood }: { mood: CharacterMood }) {
  return (
    <g>
      <polygon points="48,72 56,22 98,50" fill="#ff8a3d" />
      <polygon points="152,72 144,22 102,50" fill="#ff8a3d" />
      <polygon points="60,62 62,38 84,52" fill="#ffb3c9" />
      <polygon points="140,62 138,38 116,52" fill="#ffb3c9" />
      <circle cx="100" cy="110" r="68" fill="#ff8a3d" />
      <g stroke="#c4622a" strokeWidth="5" strokeLinecap="round">
        <path d="M92 48 v16" />
        <path d="M100 44 v20" />
        <path d="M108 48 v16" />
      </g>
      <ellipse cx="100" cy="132" rx="28" ry="19" fill="#fff" />
      <Eyes left={72} right={128} y={102} happy={mood === 'happy'} />
      <path d="M93 123 L107 123 L100 132 Z" fill="#ff4f81" />

      {mood === 'idle' && (
        <path
          d="M100 132 v5 M100 137 q-8 8 -16 2 M100 137 q8 8 16 2"
          fill="none"
          stroke="#3b2e5a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {mood === 'talking' && (
        <g className="mouth">
          <ellipse cx="100" cy="143" rx="9" ry="8" fill="#c4325f" />
        </g>
      )}
      {mood === 'happy' && (
        <g>
          <path d="M84 136 Q100 162 116 136 Z" fill="#c4325f" />
          <ellipse cx="100" cy="149" rx="7" ry="4" fill="#ff7aa2" />
        </g>
      )}

      <g stroke="#3b2e5a" strokeWidth="3" strokeLinecap="round">
        <path d="M70 128 L34 122" />
        <path d="M70 136 L34 142" />
        <path d="M130 128 L166 122" />
        <path d="M130 136 L166 142" />
      </g>
    </g>
  )
}
