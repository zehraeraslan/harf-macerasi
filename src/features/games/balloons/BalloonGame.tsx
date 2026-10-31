import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { Character } from '../../../components/characters/Character'
import { getCharacterVoice } from '../../../components/characters/types'
import type { CharacterKind, CharacterMood } from '../../../components/characters/types'
import { speak, stopSpeaking } from '../../../lib/speech'
import { syllabify } from '../../curriculum/syllables'
import type { Round } from './rounds'

const COLORS = ['#ff4f81', '#3ec1f3', '#ffc93c', '#7b5cfa', '#3ddc97', '#ff8a3d']

export interface GameResult {
  firstTry: number
  total: number
}

interface BalloonGameProps {
  rounds: Round[]
  character: CharacterKind
  onFinish: (result: GameResult) => void
  onExit: () => void
}

function Balloon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 130" aria-hidden="true">
      <path d="M50 94 L43 106 H57 Z" fill={color} />
      <path d="M50 106 Q38 118 50 130" fill="none" stroke="#3b2e5a" strokeWidth="2" />
      <ellipse cx="50" cy="48" rx="40" ry="47" fill={color} />
      <ellipse
        cx="34"
        cy="30"
        rx="8"
        ry="14"
        fill="#fff"
        opacity="0.35"
        transform="rotate(25 34 30)"
      />
    </svg>
  )
}

export function BalloonGame({ rounds, character, onFinish, onExit }: BalloonGameProps) {
  const [index, setIndex] = useState(0)
  const [mood, setMood] = useState<CharacterMood>('idle')
  const [popped, setPopped] = useState<string | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [firstTry, setFirstTry] = useState(0)
  const [replay, setReplay] = useState(0)
  const finishRef = useRef(onFinish)
  const voice = getCharacterVoice(character)
  const round = rounds[index]

  useEffect(() => {
    finishRef.current = onFinish
  }, [onFinish])

  // Soruyu sesle sor: "Bul bakalım!" + hedef
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const spoken = round.kind === 'word' ? syllabify(round.target).join('-') : round.target

    async function ask() {
      setMood('talking')
      await speak('Bul bakalım!', {
        rate: voice.rate,
        pitch: voice.pitch,
        signal,
        clip: 'Bul bakalım!',
      })
      await speak(spoken, { rate: 0.6, pitch: voice.pitch, signal, clip: round.target })
      if (!signal.aborted) setMood('idle')
    }
    void ask()

    return () => {
      controller.abort()
      stopSpeaking()
    }
  }, [index, replay, round.kind, round.target, voice.pitch, voice.rate])

  // Doğru balon patlayınca: kutla, sonraki soruya geç
  useEffect(() => {
    if (popped === null) return
    const controller = new AbortController()
    void speak('Aferin!', {
      rate: 0.9,
      pitch: voice.pitch,
      signal: controller.signal,
      clip: 'Aferin!',
    })

    const timer = setTimeout(() => {
      if (index + 1 >= rounds.length) {
        finishRef.current({ firstTry, total: rounds.length })
      } else {
        setIndex(index + 1)
        setPopped(null)
        setMistakes(0)
        setMood('idle')
      }
    }, 1600)

    return () => {
      clearTimeout(timer)
      controller.abort()
      stopSpeaking()
    }
  }, [popped, index, rounds.length, firstTry, voice.pitch])

  // Yanlış balonun titremesi kısa sürer
  useEffect(() => {
    if (wrong === null) return
    const timer = setTimeout(() => setWrong(null), 450)
    return () => clearTimeout(timer)
  }, [wrong])

  function choose(option: string) {
    if (popped !== null) return
    if (option === round.target) {
      setPopped(option)
      setMood('happy')
      if (mistakes === 0) setFirstTry((count) => count + 1)
    } else {
      setWrong(option)
      setMistakes((count) => count + 1)
      stopSpeaking()
      void speak('Bir daha bak!', { rate: voice.rate, pitch: voice.pitch, clip: 'Bir daha bak!' })
    }
  }

  return (
    <section className="intro game">
      <div className="intro__stage">
        <Character kind={character} mood={mood} size={140} />
        <div className="game__dots" aria-label={`Soru ${index + 1} / ${rounds.length}`}>
          {rounds.map((item, i) => (
            <span
              key={`${item.target}-${i}`}
              className={`game__dot${i < index || (i === index && popped !== null) ? ' game__dot--done' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="balloons">
        {round.options.map((option, i) => {
          const classes = ['balloon']
          if (popped === option) classes.push('balloon--pop')
          else if (popped !== null) classes.push('balloon--fade')
          if (wrong === option) classes.push('balloon--wrong')
          return (
            <button
              key={`${index}-${option}`}
              type="button"
              className={classes.join(' ')}
              style={{ animationDelay: `${i * 0.35}s` }}
              aria-label={option}
              onClick={() => choose(option)}
            >
              <Balloon color={COLORS[(index + i) % COLORS.length]} />
              <span
                className="balloon__label"
                style={{
                  fontSize: option.length > 5 ? '1.3rem' : option.length > 3 ? '1.8rem' : '2.6rem',
                }}
              >
                {option}
              </span>
            </button>
          )
        })}
      </div>

      <div className="actions">
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Tekrar dinle"
          title="Tekrar dinle"
          disabled={popped !== null}
          onClick={() => setReplay((count) => count + 1)}
        >
          🔊
        </Button>
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Haritaya dön"
          title="Haritaya dön"
          onClick={onExit}
        >
          🏠
        </Button>
      </div>
    </section>
  )
}
