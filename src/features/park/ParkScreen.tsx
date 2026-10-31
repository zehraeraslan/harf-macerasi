import { Button } from '../../components/Button'
import { GAME_UNLOCK } from '../map/MapScreen'

export type GameId = 'balloons' | 'race' | 'paint' | 'memory'

const GAMES: { id: GameId; icon: string; title: string; hint: string }[] = [
  { id: 'balloons', icon: '🎈', title: 'Balon Patlat', hint: 'Duyduğunu bul' },
  { id: 'race', icon: '🏁', title: 'Yol Yarışı', hint: 'Doğru kapıdan geç' },
  { id: 'paint', icon: '🎨', title: 'Boyama', hint: 'Aynı yazıyı boya' },
  { id: 'memory', icon: '🃏', title: 'Hafıza', hint: 'Büyük küçük harfi bul' },
]

interface ParkScreenProps {
  learnedCount: number
  stickerCount: number
  totalStickers: number
  onPlay: (game: GameId) => void
  onAlbum: () => void
  onBack: () => void
}

export function ParkScreen({
  learnedCount,
  stickerCount,
  totalStickers,
  onPlay,
  onAlbum,
  onBack,
}: ParkScreenProps) {
  const locked = learnedCount < GAME_UNLOCK

  return (
    <section className="map">
      <h1 className="map__title">🎮 Oyun Parkı</h1>
      {locked && <p className="notice">🔒 {GAME_UNLOCK} harf öğrenince açılır</p>}

      <div className="park__grid">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`game-card game-card--${game.id}`}
            disabled={locked}
            onClick={() => onPlay(game.id)}
          >
            <span className="game-card__icon" aria-hidden="true">
              {game.icon}
            </span>
            <span className="game-card__title">{game.title}</span>
            <span className="game-card__hint">{game.hint}</span>
          </button>
        ))}
      </div>

      <Button variant="ghost" onClick={onAlbum}>
        🎒 Çıkartma Albümü ({stickerCount}/{totalStickers})
      </Button>
      <Button variant="ghost" className="btn--icon" aria-label="Haritaya dön" onClick={onBack}>
        🏠
      </Button>
    </section>
  )
}
