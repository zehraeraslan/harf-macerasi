const PROGRESS_KEY = 'harf-macerasi:progress'

export interface Progress {
  version: 1
  /** Harf -> kazanılan yıldız (1-3). Kaydı olmayan harf henüz tamamlanmamıştır. */
  stars: Record<string, number>
}

export const emptyProgress: Progress = { version: 1, stars: {} }

/** Saklanan metni güvenle okur: bozuk ya da yabancı veri gelirse boş ilerleme döner. */
export function parseProgress(raw: string | null, validLetters: string[]): Progress {
  if (!raw) return emptyProgress
  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return emptyProgress
    const record = data as { version?: unknown; stars?: unknown }
    if (record.version !== 1 || typeof record.stars !== 'object' || record.stars === null) {
      return emptyProgress
    }
    const stars: Record<string, number> = {}
    for (const [letter, value] of Object.entries(record.stars as Record<string, unknown>)) {
      const valid =
        validLetters.includes(letter) &&
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 3
      if (valid) stars[letter] = value
    }
    return { version: 1, stars }
  } catch {
    return emptyProgress
  }
}

/** Baştan kaç harf üst üste tamamlanmış? (Sıradaki harf bunun hemen ardındadır.) */
export function completedCount(progress: Progress, order: string[]): number {
  let count = 0
  while (count < order.length && (progress.stars[order[count]] ?? 0) > 0) count++
  return count
}

export function totalStars(progress: Progress): number {
  return Object.values(progress.stars).reduce((sum, value) => sum + value, 0)
}

/** Harfin yıldızını günceller; daha önce aldığı yıldız asla azalmaz. */
export function withStars(progress: Progress, letter: string, stars: number): Progress {
  const earned = Math.min(3, Math.max(1, Math.round(stars)))
  const best = Math.max(progress.stars[letter] ?? 0, earned)
  return { version: 1, stars: { ...progress.stars, [letter]: best } }
}

export function loadProgress(validLetters: string[]): Progress {
  try {
    return parseProgress(localStorage.getItem(PROGRESS_KEY), validLetters)
  } catch {
    return emptyProgress
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // depolama kapalıysa ilerleme sadece bu oturumda tutulur
  }
}
