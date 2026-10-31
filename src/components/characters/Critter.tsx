import { Eyes, Mouth } from './Parts'
import type { Accessory, CritterLook, EarStyle } from './critterLooks'
import type { CharacterMood } from './types'

const OUTLINE = 'rgb(0 0 0 / 14%)'

function Ears({ style, body, belly }: { style: EarStyle; body: string; belly: string }) {
  switch (style) {
    case 'round':
      return (
        <g>
          <circle cx="56" cy="62" r="22" fill={body} />
          <circle cx="144" cy="62" r="22" fill={body} />
          <circle cx="56" cy="62" r="12" fill={belly} />
          <circle cx="144" cy="62" r="12" fill={belly} />
        </g>
      )
    case 'pointy':
      return (
        <g>
          <polygon points="46,80 56,26 96,54" fill={body} />
          <polygon points="154,80 144,26 104,54" fill={body} />
          <polygon points="58,68 62,42 82,56" fill={belly} />
          <polygon points="142,68 138,42 118,56" fill={belly} />
        </g>
      )
    case 'long':
      return (
        <g>
          <ellipse cx="68" cy="44" rx="15" ry="40" fill={body} transform="rotate(-8 68 44)" />
          <ellipse cx="132" cy="44" rx="15" ry="40" fill={body} transform="rotate(8 132 44)" />
          <ellipse cx="68" cy="46" rx="7" ry="28" fill={belly} transform="rotate(-8 68 46)" />
          <ellipse cx="132" cy="46" rx="7" ry="28" fill={belly} transform="rotate(8 132 46)" />
        </g>
      )
    case 'floppy':
      return (
        <g stroke={OUTLINE} strokeWidth="3">
          <ellipse cx="30" cy="116" rx="18" ry="38" fill={body} transform="rotate(12 30 116)" />
          <ellipse cx="170" cy="116" rx="18" ry="38" fill={body} transform="rotate(-12 170 116)" />
        </g>
      )
    default:
      return null
  }
}

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle
          key={angle}
          cx={Math.cos((angle * Math.PI) / 180) * 8}
          cy={Math.sin((angle * Math.PI) / 180) * 8}
          r="6"
          fill="#ff4f81"
        />
      ))}
      <circle r="5" fill="#ffc93c" />
    </g>
  )
}

function Extras({ accessory }: { accessory: Accessory }) {
  switch (accessory) {
    case 'bow':
      return (
        <g>
          <polygon points="130,56 108,42 108,70" fill="#ff4f81" />
          <polygon points="130,56 152,42 152,70" fill="#ff4f81" />
          <circle cx="130" cy="56" r="6" fill="#c4325f" />
        </g>
      )
    case 'hat':
      return (
        <g>
          <polygon points="76,62 100,8 124,62" fill="#7b5cfa" />
          <polygon points="86,44 114,44 120,58 80,58" fill="#ffc93c" />
          <circle cx="100" cy="10" r="7" fill="#ff4f81" />
        </g>
      )
    case 'glasses':
      return (
        <g fill="rgb(255 255 255 / 35%)" stroke="#3b2e5a" strokeWidth="4">
          <circle cx="76" cy="104" r="17" />
          <circle cx="124" cy="104" r="17" />
          <path d="M93 104 H107" />
        </g>
      )
    case 'flower':
      return <Flower x={132} y={58} />
    case 'scarf':
      return (
        <g fill="#3ec1f3">
          <path d="M48 156 Q100 192 152 156 L156 176 Q100 212 44 176 Z" />
          <rect x="118" y="178" width="22" height="26" rx="7" />
        </g>
      )
    default:
      return null
  }
}

export function Critter({ look, mood }: { look: CritterLook; mood: CharacterMood }) {
  return (
    <g>
      <Ears style={look.ears} body={look.body} belly={look.belly} />
      <circle cx="100" cy="112" r="64" fill={look.body} />
      <ellipse cx="100" cy="142" rx="36" ry="24" fill={look.belly} />
      <circle cx="62" cy="124" r="10" fill="#ff4f81" opacity="0.35" />
      <circle cx="138" cy="124" r="10" fill="#ff4f81" opacity="0.35" />
      <Eyes left={76} right={124} y={104} happy={mood === 'happy'} radius={7} />
      <ellipse cx="100" cy="121" rx="6" ry="4.5" fill="#3b2e5a" />
      <Mouth cx={100} y={132} mood={mood} width={12} />
      <Extras accessory={look.accessory} />
    </g>
  )
}
