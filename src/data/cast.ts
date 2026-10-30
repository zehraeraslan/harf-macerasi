import type { CharacterKind } from '../components/characters/types'

/** Hangi harfi hangi karakter anlatır. Her harfin kendi karakteri vardır. */
export const castByLetter: Record<string, CharacterKind> = {
  a: 'chick',
  n: 'cat',
  e: 'flower',
  t: 'bunny',
  i: 'girl',
  l: 'boy',
}
