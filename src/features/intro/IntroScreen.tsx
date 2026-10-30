import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { characterNames, characterVoices } from '../../components/characters/types'
import type { CharacterKind, CharacterMood } from '../../components/characters/types'
import { pause, speak, stopSpeaking } from '../../lib/speech'
import type { Letter } from '../../types/curriculum'
import { syllabify } from '../curriculum/syllables'

type Phase = 'letter' | 'repeat' | 'syllables' | 'words' | 'done'
type ItemKind = 'syllable' | 'word'

/** Çocuğun tekrar etmesi için tanınan süreler (milisaniye). Gerekirse buradan ayarla. */
const SYLLABLE_TURN_MS = 2000
const WORD_TURN_BASE_MS = 1600
const WORD_TURN_PER_SYLLABLE_MS = 900

interface IntroScreenProps {
  letter: Letter
  character: CharacterKind
  newSyllables: string[]
  words: string[]
  hasNext: boolean
  onNext: () => void
}

interface TalkOptions {
  rate?: number
  mood?: CharacterMood
  /** Ekranda yazandan farklı bir metin okutmak için. */
  spoken?: string
}

export function IntroScreen({
  letter,
  character,
  newSyllables,
  words,
  hasNext,
  onNext,
}: IntroScreenProps) {
  const [mood, setMood] = useState<CharacterMood>('idle')
  const [said, setSaid] = useState('')
  const [phase, setPhase] = useState<Phase>('letter')
  const [active, setActive] = useState<string | null>(null)
  const [turnMs, setTurnMs] = useState(0)
  const [runId, setRunId] = useState(0)
  const childDone = useRef<(() => void) | null>(null)
  const name = characterNames[character]

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const voice = characterVoices[character]

    async function talk(text: string, options: TalkOptions = {}) {
      if (signal.aborted) return
      const { rate = voice.rate, mood: talkMood = 'talking', spoken = text } = options
      setSaid(text)
      setMood(talkMood)
      await speak(spoken, { rate, pitch: voice.pitch, signal, clip: text })
      if (!signal.aborted) setMood('idle')
    }

    /** Çocuğa söyleme sırası verir: süre çubuğu akar, bitince devam edilir. */
    async function childTurn(ms: number) {
      if (signal.aborted) return
      setSaid('Sıra sende!')
      setTurnMs(ms)
      await pause(ms, signal)
      setTurnMs(0)
    }

    async function readItems(items: string[], intro: string, kind: ItemKind) {
      await talk(intro)
      for (const item of items) {
        if (signal.aborted) return
        setActive(item)

        const parts = kind === 'word' ? syllabify(item) : [item]

        // Çok heceli kelimeler önce hece hece okunur
        if (parts.length > 1) {
          for (const part of parts) {
            await talk(part, { rate: 0.6 })
            await pause(250, signal)
          }
        }
        // Tireli yazım, kısa kelimelerin İngilizce okunmasını azaltır (ni-ne)
        await talk(item, { rate: 0.7, spoken: parts.join('-') })

        const ms =
          kind === 'syllable'
            ? SYLLABLE_TURN_MS
            : WORD_TURN_BASE_MS + WORD_TURN_PER_SYLLABLE_MS * parts.length
        await childTurn(ms)
      }
      setActive(null)
    }

    async function run() {
      setActive(null)
      setTurnMs(0)

      setPhase('letter')
      await talk(`Merhaba, ben ${name}!`)
      await talk('Bugünkü harfimiz:')
      await talk(letter.lower, { rate: 0.5 })
      if (signal.aborted) return

      setPhase('repeat')
      await talk('Şimdi sen söyle!')
      await new Promise<void>((resolve) => {
        childDone.current = resolve
        signal.addEventListener('abort', () => resolve(), { once: true })
      })
      if (signal.aborted) return
      await talk('Aferin sana!', { rate: 0.85, mood: 'happy' })

      if (newSyllables.length > 0) {
        setPhase('syllables')
        await readItems(newSyllables, 'Şimdi heceleri okuyalım. Önce ben, sonra sen!', 'syllable')
        if (signal.aborted) return
      }

      if (words.length > 0) {
        setPhase('words')
        await readItems(words, 'Şimdi kelimeleri okuyalım. Önce ben, sonra sen!', 'word')
        if (signal.aborted) return
      }

      setPhase('done')
      await talk('Çok güzel! Şimdi yazmayı deneyelim!', { rate: 0.85, mood: 'happy' })
    }

    void run()

    return () => {
      controller.abort()
      stopSpeaking()
    }
  }, [runId, letter.lower, name, character, newSyllables, words])

  function handleCharacterTap() {
    if (mood !== 'idle') return
    setMood('happy')
    setTimeout(() => setMood('idle'), 1500)
  }

  return (
    <section className="intro">
      <div className="intro__stage">
        <button
          type="button"
          className="character-button"
          aria-label={`${name} ile oyna`}
          onClick={handleCharacterTap}
        >
          <Character kind={character} mood={mood} size={170} />
        </button>
        <p className="bubble" aria-live="polite">
          {said}
        </p>
      </div>

      {turnMs > 0 && (
        <div className="turn" aria-hidden="true">
          <span className="turn__label">🗣️</span>
          <div className="turn__track">
            <div
              key={active ?? 'letter'}
              className="turn__bar"
              style={{ animationDuration: `${turnMs}ms` }}
            />
          </div>
        </div>
      )}

      <div className="letter-card" aria-label={`${letter.upper} ${letter.lower}`}>
        <span className="letter-card__upper">{letter.upper}</span>
        <span className="letter-card__lower">{letter.lower}</span>
      </div>

      {newSyllables.length > 0 && (
        <div className="chips-block">
          <h2>Yeni heceler</h2>
          <ul className="chips">
            {newSyllables.map((syllable) => (
              <li key={syllable} className={`chip${active === syllable ? ' chip--active' : ''}`}>
                {syllable}
              </li>
            ))}
          </ul>
        </div>
      )}

      {words.length > 0 && (
        <div className="chips-block">
          <h2>Kelimeler</h2>
          <ul className="chips">
            {words.map((word) => (
              <li key={word} className={`chip chip--word${active === word ? ' chip--active' : ''}`}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="actions">
        {phase === 'repeat' && (
          <Button className="btn--attention" onClick={() => childDone.current?.()}>
            🎤 Söyledim!
          </Button>
        )}
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Tekrar dinle"
          title="Tekrar dinle"
          onClick={() => setRunId((id) => id + 1)}
        >
          🔁
        </Button>
        <Button
          className={phase === 'done' && hasNext ? 'btn--go btn--attention' : 'btn--go'}
          onClick={onNext}
          disabled={!hasNext}
        >
          {hasNext ? (
            <>
              Yazalım!
              <span className="btn__arrow" aria-hidden="true">
                ➜
              </span>
            </>
          ) : (
            'Şimdilik bu kadar!'
          )}
        </Button>
      </div>
    </section>
  )
}
