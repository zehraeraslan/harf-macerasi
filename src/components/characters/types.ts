import { critterLooks } from './critterLooks'
import type { CritterLook } from './critterLooks'

export type BaseKind = 'chick' | 'cat' | 'flower' | 'bunny' | 'girl' | 'boy'
export type CritterId = keyof typeof critterLooks
export type CharacterKind = BaseKind | CritterId

export type CharacterMood = 'idle' | 'talking' | 'happy'

const baseNames: Record<BaseKind, string> = {
  chick: 'Pıtır',
  cat: 'Minnoş',
  flower: 'Papatya',
  bunny: 'Pofuduk',
  girl: 'Defne',
  boy: 'Can',
}

/** Yükseldikçe ses incelir (1 = normal, en fazla 2). */
const baseVoices: Record<BaseKind, { pitch: number; rate: number }> = {
  chick: { pitch: 1.9, rate: 0.85 },
  cat: { pitch: 1.5, rate: 0.8 },
  flower: { pitch: 1.65, rate: 0.8 },
  bunny: { pitch: 1.75, rate: 0.85 },
  girl: { pitch: 1.45, rate: 0.8 },
  boy: { pitch: 1.25, rate: 0.8 },
}

export function isCritter(kind: CharacterKind): kind is CritterId {
  return kind in critterLooks
}

export function getCritterLook(id: CritterId): CritterLook {
  return critterLooks[id]
}

export function getCharacterName(kind: CharacterKind): string {
  return isCritter(kind) ? critterLooks[kind].name : baseNames[kind]
}

export function getCharacterVoice(kind: CharacterKind): { pitch: number; rate: number } {
  return isCritter(kind) ? { pitch: critterLooks[kind].pitch, rate: 0.82 } : baseVoices[kind]
}
