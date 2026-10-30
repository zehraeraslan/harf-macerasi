/**
 * Küçük harflerin vuruşları (yazılış sırasıyla). Koordinat kutusu: 100 x 120.
 * Üst çizgi y=12, orta çizgi y=42, taban y=92.
 */
export const strokes: Record<string, string[]> = {
  a: [
    'M68 56 C62 46 54 42 46 42 C32 42 22 54 22 67 C22 80 32 92 46 92 C58 92 68 82 68 68',
    'M68 42 V92',
  ],
  n: ['M30 42 V92', 'M30 64 C30 40 70 40 70 64 V92'],
  e: ['M26 68 H74 C74 50 64 42 50 42 C34 42 24 54 24 68 C24 82 34 92 50 92 C60 92 68 88 74 80'],
  t: ['M44 22 V82 Q44 92 56 92 Q64 92 70 88', 'M28 46 H64'],
  i: ['M50 42 V92', 'M50 26 V27'],
  l: ['M50 12 V92'],
}
