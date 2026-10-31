import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { Character } from '../../../components/characters/Character'
import { getCharacterVoice } from '../../../components/characters/types'
import type { CharacterKind } from '../../../components/characters/types'
import { Confetti } from '../../../components/Confetti'
import { say, stopTalking } from '../../../lib/speech'
import { canFlip, flipCard, memoryDone, memoryStars, resolveFlips, startMemory } from './memory'
import type { Card } from './memory'

interface MemoryGameProps {
  cards: Card[]
  character: CharacterKind
  onFinish: (stars: number) => void
  onExit: () => void
}

export function MemoryGame({ cards, character, onFinish, onExit }: MemoryGameProps) {
  const [state, setState] = useState(() => startMemory(cards))
  const [cheer, setCheer] = useState(false)
  const finishRef = useRef(onFinish)
  const { pitch, rate } = getCharacterVoice(character)
  const done = memoryDone(state)
  const pairs = cards.length / 2

  useEffect(() => {
    finishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    say([{ text: 'Büyük ve küçük harfi bul!' }], { pitch, rate })
    return () => stopTalking()
  }, [pitch, rate])

  // İki kart açılınca kısa bir süre sonra karar ver
  useEffect(() => {
    if (state.flipped.length !== 2) return
    const [first, second] = state.flipped
    const match = state.cards[first].pairId === state.cards[second].pairId
    const timer = setTimeout(
      () => {
        setState(resolveFlips)
        if (match) {
          setCheer(true)
          say([{ text: 'Aferin!' }], { pitch, rate })
          setTimeout(() => setCheer(false), 900)
        }
      },
      match ? 700 : 1200,
    )
    return () => clearTimeout(timer)
  }, [state.flipped, state.cards, pitch, rate])

  useEffect(() => {
    if (!done) return
    say([{ text: 'Hepsini buldun! Harikasın!' }], { pitch, rate })
    const timer = setTimeout(() => finishRef.current(memoryStars(state.moves, pairs)), 2600)
    return () => {
      clearTimeout(timer)
      stopTalking()
    }
  }, [done, state.moves, pairs, pitch, rate])

  function flip(index: number) {
    if (!canFlip(state, index)) return
    setState((current) => flipCard(current, index))
    const sound = state.cards[index].say
    say([{ text: sound, rate: 0.5 }], { pitch, rate })
  }

  const columns = cards.length <= 6 ? 3 : 4

  return (
    <section className="intro">
      <div className="intro__stage">
        <Character kind={character} mood={cheer || done ? 'happy' : 'idle'} size={110} />
        <div className="game__dots" aria-label={`${state.matched.length} / ${pairs} çift bulundu`}>
          {Array.from({ length: pairs }, (_, i) => (
            <span
              key={i}
              className={`game__dot${i < state.matched.length ? ' game__dot--done' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="memory" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {state.cards.map((card, index) => {
          const matched = state.matched.includes(card.pairId)
          const open = state.flipped.includes(index)
          const classes = ['mcard']
          if (open) classes.push('mcard--open')
          if (matched) classes.push('mcard--matched')
          return (
            <button
              key={card.id}
              type="button"
              className={classes.join(' ')}
              aria-label={open || matched ? card.face : 'Kapalı kart'}
              onClick={() => flip(index)}
            >
              <span className="mcard__back" aria-hidden="true">
                ❓
              </span>
              <span className="mcard__face">{card.face}</span>
            </button>
          )
        })}
      </div>

      <div className="actions">
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

      {done && <Confetti />}
    </section>
  )
}
