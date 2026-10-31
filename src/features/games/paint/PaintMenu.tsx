import { Button } from '../../../components/Button'
import type { Pool } from '../balloons/rounds'
import { canPaint } from './paint'
import { pictures } from './pictures'

const HINTS = { letter: 'Harfleri bul', syllable: 'Heceleri bul', word: 'Kelimeleri bul' }

interface PaintMenuProps {
  pool: Pool
  onPick: (pictureId: string) => void
  onBack: () => void
}

export function PaintMenu({ pool, onPick, onBack }: PaintMenuProps) {
  return (
    <section className="map">
      <h1 className="map__title">🎨 Ne boyayalım?</h1>
      <div className="park__grid">
        {pictures.map((picture) => (
          <button
            key={picture.id}
            type="button"
            className="game-card game-card--paint"
            disabled={!canPaint(pool, picture)}
            onClick={() => onPick(picture.id)}
          >
            <span className="game-card__icon" aria-hidden="true">
              {picture.icon}
            </span>
            <span className="game-card__title">{picture.title}</span>
            <span className="game-card__hint">{HINTS[picture.kind]}</span>
          </button>
        ))}
      </div>
      <Button variant="ghost" className="btn--icon" aria-label="Oyun parkına dön" onClick={onBack}>
        🏠
      </Button>
    </section>
  )
}
