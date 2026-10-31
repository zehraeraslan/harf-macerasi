import './characters.css'
import { Boy } from './Boy'
import { Bunny } from './Bunny'
import { Cat } from './Cat'
import { Chick } from './Chick'
import { Critter } from './Critter'
import { Flower } from './Flower'
import { Girl } from './Girl'
import { Sparkles } from './Parts'
import { getCharacterName, getCritterLook, isCritter } from './types'
import type { CharacterKind, CharacterMood } from './types'

const bodies = { chick: Chick, cat: Cat, flower: Flower, bunny: Bunny, girl: Girl, boy: Boy }

function Body({ kind, mood }: { kind: CharacterKind; mood: CharacterMood }) {
  if (isCritter(kind)) return <Critter look={getCritterLook(kind)} mood={mood} />
  const Base = bodies[kind]
  return <Base mood={mood} />
}

interface CharacterProps {
  kind: CharacterKind
  mood?: CharacterMood
  size?: number
}

export function Character({ kind, mood = 'idle', size = 160 }: CharacterProps) {
  return (
    <div
      className={`character character--${mood}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={getCharacterName(kind)}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
        <Body kind={kind} mood={mood} />
        {mood === 'happy' && <Sparkles />}
      </svg>
    </div>
  )
}
