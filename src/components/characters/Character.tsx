import './characters.css'
import { Cat } from './Cat'
import { Boy } from './Boy'
import { Bunny } from './Bunny'
import { Chick } from './Chick'
import { Flower } from './Flower'
import { Girl } from './Girl'
import { Sparkles } from './Parts'
import { characterNames } from './types'
import type { CharacterKind, CharacterMood } from './types'

const bodies = { chick: Chick, cat: Cat, flower: Flower, bunny: Bunny, girl: Girl, boy: Boy }

interface CharacterProps {
  kind: CharacterKind
  mood?: CharacterMood
  size?: number
}

export function Character({ kind, mood = 'idle', size = 160 }: CharacterProps) {
  const Body = bodies[kind]

  return (
    <div
      className={`character character--${mood}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={characterNames[kind]}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
        <Body mood={mood} />
        {mood === 'happy' && <Sparkles />}
      </svg>
    </div>
  )
}
