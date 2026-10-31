import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { alphabet } from '../../data/alphabet'
import { completedCount, totalStars } from '../../lib/progress'
import type { Progress } from '../../lib/progress'

const GROUPS = [
  { icon: '🌼', title: 'Papatya Bahçesi' },
  { icon: '🍄', title: 'Mantar Ormanı' },
  { icon: '🌈', title: 'Gökkuşağı Tepesi' },
  { icon: '🏰', title: 'Kale Yolu' },
  { icon: '☁️', title: 'Bulut Ülkesi' },
]

const ORDER = alphabet.map((letter) => letter.lower)
/** Balon oyununun açılması için gereken tamamlanmış harf sayısı. */
export const GAME_UNLOCK = 3

interface MapScreenProps {
  progress: Progress
  onOpenLetter: (index: number) => void
  onOpenGame: () => void
  onReset: () => void
}

export function MapScreen({ progress, onOpenLetter, onOpenGame, onReset }: MapScreenProps) {
  const done = completedCount(progress, ORDER)
  const canPlay = done >= GAME_UNLOCK

  return (
    <section className="map">
      <div className="map__header">
        <Character kind="chick" mood="idle" size={90} />
        <h1 className="map__title">Macera Haritası</h1>
        <p className="map__stars" aria-label={`${totalStars(progress)} yıldız`}>
          ⭐ {totalStars(progress)}
        </p>
      </div>

      <div className="map__game">
        <Button className="btn--go" disabled={!canPlay} onClick={onOpenGame}>
          🎈 Balon oyunu
        </Button>
        {!canPlay && <p className="notice">🔒 {GAME_UNLOCK} harf öğrenince açılır</p>}
      </div>

      {GROUPS.map((group, groupIndex) => (
        <div key={group.title} className="map__group">
          <h2>
            <span aria-hidden="true">{group.icon}</span> {group.title}
          </h2>
          <div className="map__nodes">
            {alphabet.map((letter, i) => {
              if (letter.group !== groupIndex + 1) return null
              const state = i < done ? 'done' : i === done ? 'current' : 'locked'
              const stars = progress.stars[letter.lower] ?? 0
              return (
                <button
                  key={letter.lower}
                  type="button"
                  className={`node node--${state}`}
                  disabled={state === 'locked'}
                  aria-label={`${letter.upper} ${letter.lower}${stars ? `, ${stars} yıldız` : ''}`}
                  onClick={() => onOpenLetter(i)}
                >
                  <span className="node__letter">{letter.lower}</span>
                  {state === 'done' && (
                    <span className="node__stars" aria-hidden="true">
                      {'⭐'.repeat(stars)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <Button variant="ghost" className="btn--small" onClick={onReset}>
        ↺ İlerlemeyi sıfırla
      </Button>
    </section>
  )
}
