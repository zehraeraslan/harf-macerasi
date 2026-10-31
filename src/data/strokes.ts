/**
 * Küçük harflerin vuruşları (yazılış sırasıyla). Koordinat kutusu: 100 x 120.
 * Üst çizgi y=12, orta çizgi y=42, taban y=92, aşağı uzantılar y=112'ye kadar.
 */
const BOWL = 'M68 56 C62 46 54 42 46 42 C32 42 22 54 22 67 C22 80 32 92 46 92 C58 92 68 82 68 68'
const ARCH = 'M30 64 C30 40 70 40 70 64 V92'
const U_BEND = 'M30 42 V68 C30 86 40 92 52 92 C62 92 70 86 70 72'
const S_CURVE = 'M66 50 C60 42 36 40 34 54 C32 68 66 64 66 80 C66 94 40 96 32 84'
const C_CURVE = 'M72 52 C66 44 58 42 50 42 C34 42 24 54 24 67 C24 80 34 92 50 92 C58 92 66 90 72 82'
const CEDILLA = 'M50 94 V102 C50 110 42 112 36 108'
const DOT_LEFT = 'M38 26 V27'
const DOT_RIGHT = 'M62 26 V27'
const RING = 'M50 42 C36 42 24 54 24 67 C24 80 36 92 50 92 C64 92 76 80 76 67 C76 54 64 42 50 42'

export const strokes: Record<string, string[]> = {
  // 1. grup
  a: [BOWL, 'M68 42 V92'],
  n: ['M30 42 V92', ARCH],
  e: ['M26 68 H74 C74 50 64 42 50 42 C34 42 24 54 24 68 C24 82 34 92 50 92 C60 92 68 88 74 80'],
  t: ['M44 22 V82 Q44 92 56 92 Q64 92 70 88', 'M28 46 H64'],
  i: ['M50 42 V92', 'M50 26 V27'],
  l: ['M50 12 V92'],
  // 2. grup
  o: [RING],
  k: ['M30 12 V92', 'M66 42 L32 68', 'M42 60 L68 92'],
  u: [U_BEND, 'M70 42 V92'],
  r: ['M34 42 V92', 'M34 62 C36 46 50 40 64 44'],
  ı: ['M50 42 V92'],
  m: ['M24 42 V92', 'M24 62 C24 40 50 40 50 62 V92', 'M50 62 C50 40 76 40 76 62 V92'],
  // 3. grup
  ü: [U_BEND, 'M70 42 V92', DOT_LEFT, DOT_RIGHT],
  s: [S_CURVE],
  ö: [RING, DOT_LEFT, DOT_RIGHT],
  y: ['M28 42 L50 92', 'M72 42 L40 112'],
  d: [BOWL, 'M68 12 V92'],
  z: ['M28 44 H72 L28 90 H72'],
  // 4. grup
  ç: [C_CURVE, CEDILLA],
  b: [
    'M30 12 V92',
    'M30 60 C34 48 44 42 54 42 C68 42 76 54 76 67 C76 80 68 92 54 92 C44 92 34 86 30 74',
  ],
  g: [BOWL, 'M68 42 V98 C68 110 54 114 40 108'],
  c: [C_CURVE],
  ş: [S_CURVE, CEDILLA],
  // 5. grup
  p: [
    'M30 42 V112',
    'M30 52 C34 44 42 42 52 42 C66 42 74 54 74 67 C74 80 66 92 52 92 C42 92 34 90 30 82',
  ],
  h: ['M30 12 V92', ARCH],
  v: ['M26 42 L50 92 L74 42'],
  ğ: [BOWL, 'M68 42 V98 C68 110 54 114 40 108', 'M34 26 Q46 38 58 26'],
  f: ['M62 26 C58 16 44 12 40 28 V92', 'M26 46 H58'],
  j: ['M54 42 V98 C54 110 44 114 32 108', 'M54 26 V27'],
}
