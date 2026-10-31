import { syllabify } from '../curriculum/syllables'
import type { RoundKind } from './balloons/rounds'

/** Kelimeler tireli okutulur (ni-ne): kısa kelimelerin İngilizce okunmasını azaltır. */
export function spokenForm(kind: RoundKind, target: string): string {
  return kind === 'word' ? syllabify(target).join('-') : target
}
