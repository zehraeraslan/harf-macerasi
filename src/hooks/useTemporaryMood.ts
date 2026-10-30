import { useCallback, useEffect, useRef, useState } from 'react'
import type { CharacterMood } from '../components/characters/types'

/**
 * Karakter önce `initial` ruh halinde başlar, bir süre sonra dinlenme haline (idle) döner.
 * `play` ile geçici olarak başka bir ruh haline geçirilebilir.
 */
export function useTemporaryMood(initial: CharacterMood, initialDuration = 2500) {
  const [mood, setMood] = useState<CharacterMood>(initial)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const play = useCallback((next: CharacterMood, duration: number) => {
    clearTimeout(timer.current)
    setMood(next)
    timer.current = setTimeout(() => setMood('idle'), duration)
  }, [])

  useEffect(() => {
    timer.current = setTimeout(() => setMood('idle'), initialDuration)
    return () => clearTimeout(timer.current)
  }, [initialDuration])

  return { mood, play }
}
