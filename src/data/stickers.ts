export interface Sticker {
  id: string
  emoji: string
  name: string
}

export const stickers: Sticker[] = [
  { id: 'unicorn', emoji: '🦄', name: 'Tek boynuzlu at' },
  { id: 'rocket', emoji: '🚀', name: 'Roket' },
  { id: 'whale', emoji: '🐳', name: 'Balina' },
  { id: 'strawberry', emoji: '🍓', name: 'Çilek' },
  { id: 'rainbow', emoji: '🌈', name: 'Gökkuşağı' },
  { id: 'turtle', emoji: '🐢', name: 'Kaplumbağa' },
  { id: 'butterfly', emoji: '🦋', name: 'Kelebek' },
  { id: 'lollipop', emoji: '🍭', name: 'Lolipop' },
  { id: 'balloon', emoji: '🎈', name: 'Balon' },
  { id: 'ladybug', emoji: '🐞', name: 'Uğur böceği' },
  { id: 'sunflower', emoji: '🌻', name: 'Ayçiçeği' },
  { id: 'octopus', emoji: '🐙', name: 'Ahtapot' },
  { id: 'watermelon', emoji: '🍉', name: 'Karpuz' },
  { id: 'owl', emoji: '🦉', name: 'Baykuş' },
  { id: 'dolphin', emoji: '🐬', name: 'Yunus' },
  { id: 'icecream', emoji: '🍦', name: 'Dondurma' },
  { id: 'star', emoji: '⭐', name: 'Yıldız' },
  { id: 'bee', emoji: '🐝', name: 'Arı' },
  { id: 'fox', emoji: '🦊', name: 'Tilki' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'train', emoji: '🚂', name: 'Tren' },
  { id: 'guitar', emoji: '🎸', name: 'Gitar' },
  { id: 'donut', emoji: '🍩', name: 'Çörek' },
  { id: 'teddy', emoji: '🧸', name: 'Oyuncak ayı' },
]

/** Henüz sahip olunmayan çıkartmalardan birini seçer. Hepsi toplandıysa null döner. */
export function pickSticker(owned: string[], rng: () => number): Sticker | null {
  const available = stickers.filter((sticker) => !owned.includes(sticker.id))
  if (available.length === 0) return null
  return available[Math.floor(rng() * available.length)]
}
