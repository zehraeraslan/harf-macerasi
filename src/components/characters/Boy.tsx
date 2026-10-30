import { Eyes, Mouth } from './Parts'
import type { CharacterMood } from './types'

const SKIN = '#b9794b'

export function Boy({ mood }: { mood: CharacterMood }) {
  return (
    <g>
      <path d="M40 200 Q40 160 100 156 Q160 160 160 200 Z" fill="#ff8a3d" />
      <rect x="88" y="140" width="24" height="24" rx="8" fill={SKIN} />
      <circle cx="48" cy="110" r="11" fill={SKIN} />
      <circle cx="152" cy="110" r="11" fill={SKIN} />
      <circle cx="100" cy="106" r="52" fill={SKIN} />
      <path d="M46 94 Q48 40 100 38 Q152 40 154 94 Z" fill="#3ec1f3" />
      <ellipse cx="100" cy="95" rx="62" ry="9" fill="#2a9fd0" />
      <circle cx="100" cy="40" r="6" fill="#ffc93c" />
      <circle cx="68" cy="120" r="9" fill="#ff4f81" opacity="0.3" />
      <circle cx="132" cy="120" r="9" fill="#ff4f81" opacity="0.3" />
      <Eyes left={80} right={120} y={110} happy={mood === 'happy'} radius={6.5} />
      <Mouth cx={100} y={132} mood={mood} />
    </g>
  )
}
