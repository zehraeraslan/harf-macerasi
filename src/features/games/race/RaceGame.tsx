import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { Character } from '../../../components/characters/Character'
import { getCharacterVoice } from '../../../components/characters/types'
import type { CharacterKind } from '../../../components/characters/types'
import { say, stopTalking } from '../../../lib/speech'
import type { Round } from '../balloons/rounds'
import { spokenForm } from '../spoken'
import { RACE_LENGTH, raceStars, raceStatus, rivalSteps, startRace } from './race'
import type { RaceState } from './race'

interface RaceGameProps {
  rounds: Round[]
  player: CharacterKind
  rival: CharacterKind
  onFinish: (stars: number) => void
  onExit: () => void
}

export function RaceGame({ rounds, player, rival, onFinish, onExit }: RaceGameProps) {
  const [state, setState] = useState<RaceState>(startRace)
  const [wrong, setWrong] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [cheer, setCheer] = useState(false)
  const [replay, setReplay] = useState(0)
  const finishRef = useRef(onFinish)
  const { pitch, rate } = getCharacterVoice(player)

  const status = raceStatus(state)
  const index = Math.min(state.correct, rounds.length - 1)
  const round = rounds[index]
  const rivalPosition = Math.min(rivalSteps(state), RACE_LENGTH)

  useEffect(() => {
    finishRef.current = onFinish
  }, [onFinish])

  // Soruyu sesle sor
  useEffect(() => {
    if (status !== 'running') return
    say(
      [
        { text: 'Doğru kapıyı bul!' },
        { text: spokenForm(round.kind, round.target), rate: 0.6, clip: round.target },
      ],
      { pitch, rate },
    )
    return () => stopTalking()
  }, [index, replay, status, round, pitch, rate])

  // Yarış bitince kutla ve sonucu bildir
  useEffect(() => {
    if (status === 'running') return
    say([{ text: status === 'won' ? 'Kazandın! Harikasın!' : 'Çok güzel yarıştın!' }], {
      pitch,
      rate,
    })
    const timer = setTimeout(() => finishRef.current(raceStars(state)), 2400)
    return () => {
      clearTimeout(timer)
      stopTalking()
    }
  }, [status, state, pitch, rate])

  function choose(option: string) {
    if (status !== 'running' || locked) return
    if (option === round.target) {
      setLocked(true)
      setCheer(true)
      say([{ text: 'Aferin!' }], { pitch, rate })
      setTimeout(() => {
        setState((current) => ({ ...current, correct: current.correct + 1 }))
        setCheer(false)
        setLocked(false)
      }, 1100)
    } else {
      setState((current) => ({ ...current, mistakes: current.mistakes + 1 }))
      setWrong(option)
      setTimeout(() => setWrong(null), 450)
      say(
        [
          { text: 'Bir daha bak!' },
          { text: spokenForm(round.kind, round.target), rate: 0.6, clip: round.target },
        ],
        { pitch, rate },
      )
    }
  }

  return (
    <section className="intro race">
      <div className="lane" aria-hidden="true">
        <div className="lane__road" />
        <span className="lane__goal">🎁</span>
        <div className="lane__runner" style={{ left: `${(state.correct / RACE_LENGTH) * 84}%` }}>
          <Character kind={player} mood={cheer ? 'happy' : 'idle'} size={76} />
        </div>
      </div>

      <div className="lane lane--rival" aria-hidden="true">
        <div className="lane__road" />
        <span className="lane__goal">🏁</span>
        <div className="lane__runner" style={{ left: `${(rivalPosition / RACE_LENGTH) * 84}%` }}>
          <Character kind={rival} mood="idle" size={76} />
        </div>
      </div>

      <div className="signs">
        {round.options.map((option) => (
          <button
            key={`${index}-${option}`}
            type="button"
            className={`sign${wrong === option ? ' sign--wrong' : ''}`}
            aria-label={option}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="actions">
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Tekrar dinle"
          title="Tekrar dinle"
          disabled={status !== 'running'}
          onClick={() => setReplay((count) => count + 1)}
        >
          🔊
        </Button>
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Oyun parkına dön"
          title="Oyun parkına dön"
          onClick={onExit}
        >
          🏠
        </Button>
      </div>
    </section>
  )
}
