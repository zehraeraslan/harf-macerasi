import { Eyes } from './Parts'
import type { CharacterMood } from './types'

export function Chick({ mood }: { mood: CharacterMood }) {
  return (
    <g>
      <ellipse cx="78" cy="176" rx="15" ry="6" fill="#ff8a3d" />
      <ellipse cx="122" cy="176" rx="15" ry="6" fill="#ff8a3d" />
      <circle cx="100" cy="108" r="66" fill="#ffc93c" />
      <ellipse cx="100" cy="134" rx="38" ry="28" fill="#ffe27a" />
      <g className="wing wing--left">
        <ellipse cx="42" cy="122" rx="13" ry="26" fill="#ffb81f" />
      </g>
      <g className="wing wing--right">
        <ellipse cx="158" cy="122" rx="13" ry="26" fill="#ffb81f" />
      </g>
      <path
        d="M92 44 Q94 28 100 42 Q106 26 110 44"
        fill="none"
        stroke="#ff8a3d"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="64" cy="112" r="10" fill="#ff4f81" opacity="0.4" />
      <circle cx="136" cy="112" r="10" fill="#ff4f81" opacity="0.4" />
      <Eyes left={76} right={124} y={92} happy={mood === 'happy'} />
      <g className="mouth">
        <path
          d="M88 106 L112 106 L100 126 Z"
          fill="#ff8a3d"
          stroke="#ff8a3d"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>
    </g>
  )
}
