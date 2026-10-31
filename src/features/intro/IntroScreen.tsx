import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { getCharacterName, getCharacterVoice } from '../../components/characters/types'
import type { CharacterKind, CharacterMood } from '../../components/characters/types'
import { isListeningSupported, listen } from '../../lib/listen'
import { pause, speak, stopSpeaking } from '../../lib/speech'
import type { Letter } from '../../types/curriculum'
import { syllabify } from '../curriculum/syllables'
import { isMatch } from '../speech/match'

type Phase = 'letter' | 'repeat' | 'syllables' | 'words' | 'done'
type ItemKind = 'syllable' | 'word'
/** success: doğru duyuldu, tried: ses algılandı, gaveUp: iki denemede olmadı, timed: mikrofon yok */
type TurnResult = 'success' | 'tried' | 'gaveUp' | 'timed'

/** Çocuğun söylemesi için tanınan süreler (milisaniye). Gerekirse buradan ayarla. */
const LETTER_TURN_MS = 5000
const SYLLABLE_TURN_MS = 3500
const WORD_TURN_BASE_MS = 2500
const WORD_TURN_PER_SYLLABLE_MS = 900

interface IntroScreenProps {
  letter: Letter
  character: CharacterKind
  newSyllables: string[]
  words: string[]
  micEnabled: boolean
  /** Mikrofon izni reddedilirse ya da çalışmazsa çağrılır. */
  onMicProblem: () => void
  onNext: () => void
}

interface TalkOptions {
  rate?: number
  mood?: CharacterMood
  /** Ekranda yazandan farklı bir metin okutmak için (okunuşu düzeltmek gerekirse). */
  spoken?: string
}

export function IntroScreen({
  letter,
  character,
  newSyllables,
  words,
  micEnabled,
  onMicProblem,
  onNext,
}: IntroScreenProps) {
  const [mood, setMood] = useState<CharacterMood>('idle')
  const [said, setSaid] = useState('')
  const [phase, setPhase] = useState<Phase>('letter')
  const [active, setActive] = useState<string | null>(null)
  const [turnMs, setTurnMs] = useState(0)
  const [turnActive, setTurnActive] = useState(false)
  const [listening, setListening] = useState(false)
  const [runId, setRunId] = useState(0)
  const skip = useRef<(() => void) | null>(null)
  const micOn = useRef(micEnabled)
  const name = getCharacterName(character)

  useEffect(() => {
    micOn.current = micEnabled
  }, [micEnabled])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const voice = getCharacterVoice(character)
    // ğ tek başına söylenmez: "ağ" gibi bir hecenin içinde duyulur
    const letterTarget = letter.onlyAfterVowel ? `a${letter.lower}` : letter.lower

    async function talk(text: string, options: TalkOptions = {}) {
      if (signal.aborted) return
      const { rate = voice.rate, mood: talkMood = 'talking', spoken = text } = options
      setSaid(text)
      setMood(talkMood)
      await speak(spoken, { rate, pitch: voice.pitch, signal, clip: text })
      if (!signal.aborted) setMood('idle')
    }

    /**
     * Çocuğa söyleme sırası verir; hiçbir butona basması gerekmez.
     * Mikrofon açıksa kendiliğinden dinler (en fazla 2 deneme), kapalıysa süre tanır.
     * Çocuk pembe 🎤 butonuyla süreyi erken bitirebilir.
     */
    async function childTurn(
      target: string,
      ms: number,
      sayAgain: () => Promise<void>,
    ): Promise<TurnResult> {
      for (let attempt = 0; attempt < 2; attempt++) {
        if (signal.aborted) return 'timed'

        const local = new AbortController()
        const link = () => local.abort()
        signal.addEventListener('abort', link, { once: true })
        skip.current = () => local.abort()

        setSaid('Sıra sende!')
        setTurnActive(true)

        try {
          if (!micOn.current || !isListeningSupported()) {
            setTurnMs(ms)
            await pause(ms, local.signal)
            return signal.aborted ? 'timed' : local.signal.aborted ? 'success' : 'timed'
          }

          // Karakterin sesi tamamen bitsin, ses sistemi girişe geçsin
          stopSpeaking()
          await pause(450, local.signal)
          if (local.signal.aborted) return signal.aborted ? 'timed' : 'success'

          // Tek harf ve kısa hecelerde tanıyıcı zayıf: baştan cömert davran
          const lenient = attempt === 1 || [...target].length <= 2
          const outcome = await listen({
            timeoutMs: ms,
            signal: local.signal,
            accept: (heard) => isMatch(target, heard, { lenient }),
            onReady: () => {
              setListening(true)
              setTurnMs(ms)
            },
          })
          if (signal.aborted) return 'timed'
          if (local.signal.aborted || outcome.status === 'matched') return 'success'

          if (
            outcome.status === 'denied' ||
            outcome.status === 'unsupported' ||
            outcome.status === 'error'
          ) {
            micOn.current = false
            onMicProblem()
            setListening(false)
            await talk('Mikrofona ulaşamadım. Sadece dinleyip tekrar edelim.')
            return 'timed'
          }

          // Ses algılandı ama tanıyıcı yazıya çeviremedi: çocuk denemiş, cesaretlendir
          if (outcome.status === 'sound') return 'tried'

          if (attempt === 1) return 'gaveUp'
          setListening(false)
          setTurnMs(0)
          await talk(
            outcome.status === 'silence'
              ? 'Seni duyamadım. Bir daha söyle!'
              : 'Neredeyse! Birlikte söyleyelim.',
          )
          await sayAgain()
        } finally {
          setListening(false)
          setTurnMs(0)
          setTurnActive(false)
          skip.current = null
          signal.removeEventListener('abort', link)
        }
      }
      return 'gaveUp'
    }

    async function readItems(items: string[], intro: string, kind: ItemKind) {
      await talk(intro)
      for (const item of items) {
        if (signal.aborted) return
        setActive(item)

        const parts = kind === 'word' ? syllabify(item) : [item]
        // Tireli yazım, kısa kelimelerin İngilizce okunmasını azaltır (ni-ne)
        const sayItem = () => talk(item, { rate: 0.7, spoken: parts.join('-') })

        // Çok heceli kelimeler önce hece hece okunur
        if (parts.length > 1) {
          for (const part of parts) {
            await talk(part, { rate: 0.6 })
            await pause(250, signal)
          }
        }
        await sayItem()

        const ms =
          kind === 'syllable'
            ? SYLLABLE_TURN_MS
            : WORD_TURN_BASE_MS + WORD_TURN_PER_SYLLABLE_MS * parts.length
        const result = await childTurn(item, ms, sayItem)
        if (signal.aborted) return

        if (result === 'success') await talk('Aferin!', { rate: 0.9, mood: 'happy' })
        else if (result === 'tried') await talk('Güzel söyledin!', { rate: 0.9, mood: 'happy' })
        else if (result === 'gaveUp') await talk('Olsun, devam edelim!')
      }
      setActive(null)
    }

    async function run() {
      setActive(null)

      setPhase('letter')
      await talk(`Merhaba, ben ${name}!`)
      await talk('Bugünkü harfimiz:')
      const sayLetter = () => talk(letter.lower, { rate: 0.5, spoken: letterTarget })
      await sayLetter()
      if (signal.aborted) return

      setPhase('repeat')
      await talk('Şimdi sen söyle!')
      const result = await childTurn(letterTarget, LETTER_TURN_MS, sayLetter)
      if (signal.aborted) return
      if (result === 'gaveUp') await talk('Olsun, yavaş yavaş öğreniriz!', { rate: 0.85 })
      else await talk('Aferin sana!', { rate: 0.85, mood: 'happy' })

      if (newSyllables.length > 0) {
        setPhase('syllables')
        await readItems(
          newSyllables,
          'Şimdi heceleri okuyalım. Beni dinle, sonra sen söyle!',
          'syllable',
        )
        if (signal.aborted) return
      }

      if (words.length > 0) {
        setPhase('words')
        await readItems(words, 'Şimdi kelimeleri okuyalım. Beni dinle, sonra sen söyle!', 'word')
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
  }, [
    runId,
    letter.lower,
    letter.onlyAfterVowel,
    name,
    character,
    newSyllables,
    words,
    onMicProblem,
  ])

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

      {listening && <p className="mic-live">🎤 Dinliyorum…</p>}

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
        {turnActive && (
          <Button
            className="btn--icon btn--attention"
            aria-label="Söyledim, geç"
            title="Söyledim, geç"
            onClick={() => skip.current?.()}
          >
            🎤
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
          className={phase === 'done' ? 'btn--go btn--attention' : 'btn--go'}
          onClick={onNext}
        >
          Yazalım!
          <span className="btn__arrow" aria-hidden="true">
            ➜
          </span>
        </Button>
      </div>
    </section>
  )
}
