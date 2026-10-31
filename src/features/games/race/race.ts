export const RACE_LENGTH = 6

export interface RaceState {
  correct: number
  mistakes: number
}

export type RaceStatus = 'running' | 'won' | 'lost'

export const startRace: RaceState = { correct: 0, mistakes: 0 }

/**
 * Rakibin ilerleyişi: çocuğun her 2 doğrusunda 1 adım, her 2 hatasında 1 adım.
 * Rakip yavaş ve nazik: çocuk çok fazla hata yapmadıkça kazanır.
 */
export function rivalSteps(state: RaceState): number {
  return Math.floor(state.correct / 2) + Math.floor(state.mistakes / 2)
}

export function raceStatus(state: RaceState, length = RACE_LENGTH): RaceStatus {
  if (state.correct >= length) return 'won'
  if (rivalSteps(state) >= length) return 'lost'
  return 'running'
}

/** Kaybedilen yarış da 1 yıldız verir; ödül (çıkartma) için 2 yıldız gerekir. */
export function raceStars(state: RaceState, length = RACE_LENGTH): number {
  if (raceStatus(state, length) !== 'won') return 1
  if (state.mistakes === 0) return 3
  return state.mistakes <= 2 ? 2 : 1
}
