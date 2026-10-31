import { Button } from '../../components/Button'
import { stickers } from '../../data/stickers'

interface AlbumScreenProps {
  owned: string[]
  onBack: () => void
}

export function AlbumScreen({ owned, onBack }: AlbumScreenProps) {
  return (
    <section className="map">
      <h1 className="map__title">🎒 Çıkartma Albümü</h1>
      <p className="map__stars">
        {owned.length} / {stickers.length}
      </p>

      <div className="album">
        {stickers.map((sticker) => {
          const has = owned.includes(sticker.id)
          return (
            <div key={sticker.id} className={`album__item${has ? '' : ' album__item--locked'}`}>
              <span className="album__emoji" aria-hidden="true">
                {has ? sticker.emoji : '❔'}
              </span>
              <span>{has ? sticker.name : 'Henüz yok'}</span>
            </div>
          )
        })}
      </div>

      <Button variant="ghost" className="btn--icon" aria-label="Oyun parkına dön" onClick={onBack}>
        🏠
      </Button>
    </section>
  )
}
