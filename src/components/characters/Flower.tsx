import { Eyes } from './Parts'
import type { CharacterMood } from './types'

const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315]

export function Flower({ mood }: { mood: CharacterMood }) {
  return (
    <g className="sway">
      <path d="M100 110 Q94 155 100 196" fill="none" stroke="#2fb56f" strokeWidth="8" />
      <ellipse cx="78" cy="162" rx="18" ry="8" fill="#3ddc97" transform="rotate(-30 78 162)" />
      <ellipse cx="122" cy="146" rx="18" ry="8" fill="#3ddc97" transform="rotate(30 122 146)" />
      {petalAngles.map((angle, i) => (
        <ellipse
          key={angle}
          cx="100"
          cy="50"
          rx="15"
          ry="26"
          fill={i % 2 === 0 ? '#ff4f81' : '#ff7aa2'}
          transform={`rotate(${angle} 100 85)`}
        />
      ))}
      <circle cx="100" cy="85" r="32" fill="#ffc93c" />
      <circle cx="82" cy="92" r="4.5" fill="#ff4f81" opacity="0.5" />
      <circle cx="118" cy="92" r="4.5" fill="#ff4f81" opacity="0.5" />
      <Eyes left={89} right={111} y={79} happy={mood === 'happy'} radius={4.5} />

      {mood === 'idle' && (
        <path
          d="M91 92 Q100 100 109 92"
          fill="none"
          stroke="#3b2e5a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === 'talking' && (
        <g className="mouth">
          <ellipse cx="100" cy="95" rx="5" ry="4.5" fill="#c4325f" />
        </g>
      )}
      {mood === 'happy' && <path d="M89 90 Q100 108 111 90 Z" fill="#c4325f" />}
    </g>
  )
}
