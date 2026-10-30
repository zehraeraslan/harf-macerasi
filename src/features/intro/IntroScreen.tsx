import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { characterNames } from '../../components/characters/types'
import type { CharacterKind } from '../../components/characters/types'
import { useTemporaryMood } from '../../hooks/useTemporaryMood'
import type { Letter } from '../../types/curriculum'

interface IntroScreenProps {
  letter: Letter
  character: CharacterKind
  newSyllables: string[]
  words: string[]
  hasNext: boolean
  onNext: () => void
}

export function IntroScreen({
  letter,
  character,
  newSyllables,
  words,
  hasNext,
  onNext,
}: IntroScreenProps) {
  const { mood, play } = useTemporaryMood('talking')

  return (
    <section className="intro">
      <div className="intro__stage">
        <button
          type="button"
          className="character-button"
          aria-label={`${characterNames[character]} ile oyna`}
          onClick={() => play('happy', 1800)}
        >
          <Character kind={character} mood={mood} size={170} />
        </button>
        <p className="bubble">
          Ben {characterNames[character]}! Bu harf: <strong>{letter.upper}</strong>{' '}
          <strong>{letter.lower}</strong>
        </p>
      </div>

      <p className="intro__badge">Yeni harf</p>

      <div className="letter-card" aria-label={`${letter.upper} ${letter.lower}`}>
        <span className="letter-card__upper">{letter.upper}</span>
        <span className="letter-card__lower">{letter.lower}</span>
      </div>

      {newSyllables.length > 0 && (
        <div className="chips-block">
          <h2>Yeni heceler</h2>
          <ul className="chips">
            {newSyllables.map((syllable) => (
              <li key={syllable} className="chip">
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
              <li key={word} className="chip chip--word">
                {word}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onNext} disabled={!hasNext}>
        {hasNext ? 'Sonraki harf' : 'Şimdilik bu kadar!'}
      </Button>
    </section>
  )
}
