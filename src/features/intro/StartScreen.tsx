import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { getVoiceStatus } from '../../lib/speech'
import type { VoiceStatus } from '../../lib/speech'

export function StartScreen({ onStart }: { onStart: () => void }) {
  const [voice, setVoice] = useState<VoiceStatus>('ok')

  useEffect(() => {
    void getVoiceStatus().then(setVoice)
  }, [])

  return (
    <section className="intro">
      <Character kind="chick" mood="happy" size={200} />
      <h1 className="title">Harf Macerası</h1>
      <p className="subtitle">Harfleri birlikte öğrenelim!</p>
      <Button onClick={onStart}>Başlayalım!</Button>
      {voice === 'unsupported' && (
        <p className="notice">Bu tarayıcı sesli okumayı desteklemiyor. Chrome veya Safari dene.</p>
      )}
      {voice === 'no-turkish' && (
        <p className="notice">
          Bu cihazda Türkçe ses bulunamadı, okunuşlar doğru olmayabilir. Cihaz ayarlarından Türkçe
          ses ekleyebilirsin.
        </p>
      )}
    </section>
  )
}
