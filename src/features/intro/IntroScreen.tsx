import { Button } from '../../components/Button'
import type { Letter } from '../../types/curriculum'

interface IntroScreenProps {
  letter: Letter
  newSyllables: string[]
  words: string[]
  hasNext: boolean
  onNext: () => void
}

export function IntroScreen({ letter, newSyllables, words, hasNext, onNext }: IntroScreenProps) {
  return (
    <section className="intro">
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
