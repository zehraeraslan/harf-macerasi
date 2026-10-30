import { Eyes, Mouth } from './Parts'
import type { CharacterMood } from './types'

export function Bunny({ mood }: { mood: CharacterMood }) {
  return (
    <g>
      <ellipse cx="68" cy="44" rx="16" ry="44" fill="#d9c8ff" transform="rotate(-8 68 44)" />
      <ellipse cx="68" cy="46" rx="8" ry="32" fill="#ffb3c9" transform="rotate(-8 68 46)" />
      <ellipse cx="132" cy="44" rx="16" ry="44" fill="#d9c8ff" transform="rotate(8 132 44)" />
      <ellipse cx="132" cy="46" rx="8" ry="32" fill="#ffb3c9" transform="rotate(8 132 46)" />
      <circle cx="100" cy="116" r="64" fill="#d9c8ff" />
      <ellipse cx="100" cy="140" rx="34" ry="24" fill="#f1eaff" />
      <circle cx="62" cy="122" r="10" fill="#ff4f81" opacity="0.35" />
      <circle cx="138" cy="122" r="10" fill="#ff4f81" opacity="0.35" />
      <Eyes left={76} right={124} y={104} happy={mood === 'happy'} />
      <path d="M93 118 L107 118 L100 127 Z" fill="#ff4f81" />
      <Mouth cx={100} y={134} mood={mood} width={12} />
    </g>
  )
}
