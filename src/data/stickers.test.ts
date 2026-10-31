import { describe, expect, it } from 'vitest'
import { pickSticker, stickers } from './stickers'

describe('çıkartmalar', () => {
  it('24 benzersiz çıkartma vardır', () => {
    expect(stickers).toHaveLength(24)
    expect(new Set(stickers.map((sticker) => sticker.id)).size).toBe(24)
  })

  it('sahip olunmayan bir çıkartma seçer', () => {
    const owned = stickers.slice(0, 23).map((sticker) => sticker.id)
    expect(pickSticker(owned, () => 0)?.id).toBe(stickers[23].id)
  })

  it('hepsi toplandıysa null döner', () => {
    expect(
      pickSticker(
        stickers.map((sticker) => sticker.id),
        () => 0.5,
      ),
    ).toBeNull()
  })
})
