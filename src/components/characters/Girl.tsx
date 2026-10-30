import { Eyes, Mouth } from './Parts'
import type { CharacterMood } from './types'

const SKIN = '#f2b48c'
const HAIR = '#4a2c2a'

export function Girl({ mood }: { mood: CharacterMood }) {
  return (
    <g>
      <circle cx="46" cy="58" r="22" fill={HAIR} />
      <circle cx="154" cy="58" r="22" fill={HAIR} />
      <circle cx="46" cy="58" r="6" fill="#ffc93c" />
      <circle cx="154" cy="58" r="6" fill="#ffc93c" />
      <circle cx="100" cy="104" r="62" fill={HAIR} />
      <path d="M40 200 Q40 160 100 156 Q160 160 160 200 Z" fill="#7b5cfa" />
      <rect x="88" y="140" width="24" height="24" rx="8" fill={SKIN} />
      <circle cx="100" cy="106" r="52" fill={SKIN} />
      <path d="M48 98 Q56 52 100 50 Q144 52 152 98 Q128 68 100 74 Q72 68 48 98 Z" fill={HAIR} />
      <circle cx="68" cy="118" r="9" fill="#ff4f81" opacity="0.35" />
      <circle cx="132" cy="118" r="9" fill="#ff4f81" opacity="0.35" />
      <Eyes left={80} right={120} y={108} happy={mood === 'happy'} radius={6.5} />
      <Mouth cx={100} y={130} mood={mood} />
    </g>
  )
}
