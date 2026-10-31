import { describe, expect, it } from 'vitest'
import { alphabet } from '../../../data/alphabet'
import { words } from '../../../data/words'
import { buildPool, buildRounds } from '../balloons/rounds'
import { RACE_LENGTH, raceStars, raceStatus, rivalSteps, startRace } from './race'

describe('yarış', () => {
  it('başlangıçta yarış sürer', () => {
    expect(raceStatus(startRace)).toBe('running')
    expect(rivalSteps(startRace)).toBe(0)
  })

  it('hatasız bitirince çocuk kazanır, rakip geride kalır', () => {
    const done = { correct: RACE_LENGTH, mistakes: 0 }
    expect(raceStatus(done)).toBe('won')
    expect(rivalSteps(done)).toBe(3)
  })

  it('hatalar rakibi ilerletir', () => {
    expect(rivalSteps({ correct: 2, mistakes: 4 })).toBe(3)
  })

  it('çok hata yapılırsa yarış kaybedilir', () => {
    expect(raceStatus({ correct: 2, mistakes: 10 })).toBe('lost')
  })

  it('çocuk son adıma ulaşırsa rakip önde olsa bile kazanır', () => {
    expect(raceStatus({ correct: RACE_LENGTH, mistakes: 12 })).toBe('won')
  })

  it('yıldızlar hata sayısına göre verilir', () => {
    expect(raceStars({ correct: 6, mistakes: 0 })).toBe(3)
    expect(raceStars({ correct: 6, mistakes: 2 })).toBe(2)
    expect(raceStars({ correct: 6, mistakes: 5 })).toBe(1)
    expect(raceStars({ correct: 2, mistakes: 10 })).toBe(1)
  })
})

describe('yarış soruları', () => {
  it('3 seçenekli sorularda hedef her zaman seçeneklerdedir', () => {
    const pool = buildPool(alphabet.slice(0, 6), words)
    const rounds = buildRounds(pool, RACE_LENGTH, Math.random, 3)
    expect(rounds).toHaveLength(RACE_LENGTH)
    for (const round of rounds) {
      expect(round.options).toHaveLength(3)
      expect(round.options).toContain(round.target)
    }
  })
})
