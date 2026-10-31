import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import type { CharacterKind } from '../../components/characters/types'
import { Confetti } from '../../components/Confetti'
import { speak, stopSpeaking } from '../../lib/speech'

const cheer: CharacterKind[] = ['chick', 'cat', 'flower', 'bunny', 'girl', 'boy']

export function FinishScreen({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    const controller = new AbortController()
    const text = 'Tebrikler! Bütün harfleri öğrendin!'
    void speak(text, { rate: 0.85, pitch: 1.6, signal: controller.signal, clip: text })
    return () => {
      controller.abort()
      stopSpeaking()
    }
  }, [])

  return (
    <section className="intro">
      <h1 className="title">Tebrikler!</h1>
      <p className="subtitle">Bütün harfleri öğrendin!</p>
      <div className="finish__cast">
        {cheer.map((kind) => (
          <Character key={kind} kind={kind} mood="happy" size={96} />
        ))}
      </div>
      <Button onClick={onRestart}>Haritaya dön</Button>
      <Confetti />
    </section>
  )
}
