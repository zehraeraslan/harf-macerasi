import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import type { CharacterKind } from '../../components/characters/types'
import { getCharacterVoice } from '../../components/characters/types'
import { Confetti } from '../../components/Confetti'
import type { Sticker } from '../../data/stickers'
import { say, stopTalking } from '../../lib/speech'

interface ResultScreenProps {
  stars: number
  character: CharacterKind
  /** Bu oyundan kazanılan çıkartma (varsa) */
  sticker?: Sticker
  onContinue: () => void
}

export function ResultScreen({ stars, character, sticker, onContinue }: ResultScreenProps) {
  useEffect(() => {
    const items = [{ text: 'Harikasın!' }]
    if (sticker) items.push({ text: 'Yeni çıkartma kazandın!' })
    say(items, getCharacterVoice(character))
    return () => stopTalking()
  }, [character, sticker])

  return (
    <section className="intro">
      <Character kind={character} mood="happy" size={150} />
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
      {sticker && (
        <div className="sticker-reveal">
          <div className="sticker" role="img" aria-label={sticker.name}>
            {sticker.emoji}
          </div>
          <p className="subtitle">Yeni çıkartma: {sticker.name}!</p>
        </div>
      )}
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
