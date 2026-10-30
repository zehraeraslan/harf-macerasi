export type CharacterKind = 'chick' | 'cat' | 'flower' | 'bunny' | 'girl' | 'boy'

export type CharacterMood = 'idle' | 'talking' | 'happy'

export const characterNames: Record<CharacterKind, string> = {
  chick: 'Pıtır',
  cat: 'Minnoş',
  flower: 'Papatya',
  bunny: 'Pofuduk',
  girl: 'Defne',
  boy: 'Can',
}

/** Her karakterin sesi: pitch yükseldikçe ses incelir (1 = normal, en fazla 2). */
export const characterVoices: Record<CharacterKind, { pitch: number; rate: number }> = {
  chick: { pitch: 1.9, rate: 0.85 },
  cat: { pitch: 1.5, rate: 0.8 },
  flower: { pitch: 1.65, rate: 0.8 },
  bunny: { pitch: 1.75, rate: 0.85 },
  girl: { pitch: 1.45, rate: 0.8 },
  boy: { pitch: 1.25, rate: 0.8 },
}
