import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import type { CharacterKind } from '../../components/characters/types'
import { getCharacterVoice } from '../../components/characters/types'
import { Confetti } from '../../components/Confetti'
import { speak, stopSpeaking } from '../../lib/speech'

interface ResultScreenProps {
  stars: number
  character: CharacterKind
  onContinue: () => void
}

export function ResultScreen({ stars, character, onContinue }: ResultScreenProps) {
  useEffect(() => {
    const controller = new AbortController()
    const voice = getCharacterVoice(character)
    void speak('Harikasın!', {
      rate: 0.85,
      pitch: voice.pitch,
      signal: controller.signal,
      clip: 'Harikasın!',
    })
    return () => {
      controller.abort()
      stopSpeaking()
    }
  }, [character])

  return (
    <section className="intro">
      <Character kind={character} mood="happy" size={170} />
      <h1 className="title">Harika!</h1>
      <div className="stars" role="img" aria-label={`${stars} yıldız`}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`star${n <= stars ? ' star--on' : ''}`}
            style={{ animationDelay: `${n * 0.3}s` }}
          >
            ⭐
          </span>
        ))}
      </div>
      <Button className="btn--go btn--attention" onClick={onContinue}>
        Devam
        <span className="btn__arrow" aria-hidden="true">
          ➜
        </span>
      </Button>
      <Confetti />
    </section>
  )
}
