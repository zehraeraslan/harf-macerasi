import { describe, expect, it } from 'vitest'
import { POT_COUNT } from './paint'
import { pictures } from './pictures'
import { shapeCenter } from './shapes'

describe('boyama resimleri', () => {
  it('parça kimlikleri resim içinde benzersizdir', () => {
    for (const picture of pictures) {
      const ids = picture.regions.map((region) => region.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('her resimde boya sayısından fazla parça vardır', () => {
    for (const picture of pictures) {
      expect(picture.regions.length).toBeGreaterThan(POT_COUNT)
    }
  })

  it('her parçanın yazı noktası resmin içindedir', () => {
    for (const picture of pictures) {
      const [x, y, width, height] = picture.viewBox.split(' ').map(Number)
      for (const region of picture.regions) {
        const point = region.labelAt ?? shapeCenter(region.shape)
        expect(point.x).toBeGreaterThanOrEqual(x)
        expect(point.x).toBeLessThanOrEqual(x + width)
        expect(point.y).toBeGreaterThanOrEqual(y)
        expect(point.y).toBeLessThanOrEqual(y + height)
      }
    }
  })

  it('üç farklı yazı türü kullanılır: harf, hece, kelime', () => {
    expect(pictures.map((picture) => picture.kind)).toEqual(['letter', 'syllable', 'word'])
  })
})
