import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { getCharacterName, getCharacterVoice } from '../../components/characters/types'
import type { CharacterKind } from '../../components/characters/types'
import { Confetti } from '../../components/Confetti'
import { strokes } from '../../data/strokes'
import { speak, stopSpeaking } from '../../lib/speech'
import type { Letter } from '../../types/curriculum'
import { samplePath } from './samplePath'
import { advance, isComplete, progressPercent } from './tracing'
import type { Point } from './tracing'

const RULE_LINES = [12, 42, 92]
const NO_STROKES: string[] = []

interface TraceScreenProps {
  letter: Letter
  character: CharacterKind
  hasNext: boolean
  onNext: () => void
}

export function TraceScreen({ letter, character, hasNext, onNext }: TraceScreenProps) {
  const paths = strokes[letter.lower] ?? NO_STROKES
  const samples = useMemo(() => paths.map((d) => samplePath(d)), [paths])

  const [indexes, setIndexes] = useState<number[]>(() => paths.map(() => -1))
  const [talking, setTalking] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const drawing = useRef(false)

  const completed = samples.map((s, i) => isComplete(s, indexes[i]))
  const activeStroke = completed.findIndex((done) => !done)
  const finished = samples.length > 0 && activeStroke === -1
  const started = indexes.some((index) => index >= 0)
  const name = getCharacterName(character)
  const voice = getCharacterVoice(character)

  useEffect(() => {
    const controller = new AbortController()
    const text = 'Şimdi yazalım. Noktadan başla!'

    async function intro() {
      setTalking(true)
      await speak(text, {
        rate: voice.rate,
        pitch: voice.pitch,
        signal: controller.signal,
        clip: text,
      })
      if (!controller.signal.aborted) setTalking(false)
    }
    void intro()

    return () => {
      controller.abort()
      stopSpeaking()
    }
  }, [voice.rate, voice.pitch])

  useEffect(() => {
    if (!finished) return
    const controller = new AbortController()
    const text = 'Harikasın! Çok güzel yazdın!'

    async function celebrate() {
      stopSpeaking()
      setTalking(true)
      await speak(text, {
        rate: voice.rate,
        pitch: voice.pitch,
        signal: controller.signal,
        clip: text,
      })
      if (!controller.signal.aborted) setTalking(false)
    }
    void celebrate()

    return () => {
      controller.abort()
      stopSpeaking()
    }
  }, [finished, voice.rate, voice.pitch])

  function toBoardPoint(event: PointerEvent<SVGSVGElement>): Point | null {
    const matrix = svgRef.current?.getScreenCTM()
    if (!matrix) return null
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    return { x: point.x, y: point.y }
  }

  function trace(event: PointerEvent<SVGSVGElement>) {
    const point = toBoardPoint(event)
    if (!point) return
    setIndexes((previous) => {
      const active = samples.findIndex((s, i) => !isComplete(s, previous[i]))
      if (active === -1) return previous
      const next = advance(samples[active], previous[active], point)
      return next === previous[active]
        ? previous
        : previous.map((v, i) => (i === active ? next : v))
    })
  }

  function handleDown(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    trace(event)
  }

  function handleMove(event: PointerEvent<SVGSVGElement>) {
    if (drawing.current) trace(event)
  }

  function handleUp() {
    drawing.current = false
  }

  const bubble = finished
    ? 'Harikasın! Çok güzel yazdın!'
    : started
      ? 'Devam et, çok iyi gidiyorsun!'
      : 'Parmağınla noktadan başla!'

  const tip =
    activeStroke >= 0 && indexes[activeStroke] >= 0
      ? samples[activeStroke][indexes[activeStroke]]
      : null
  const startPoint =
    activeStroke >= 0 && indexes[activeStroke] < 0 ? samples[activeStroke][0] : null

  return (
    <section className="intro trace">
      <div className="intro__stage">
        <Character
          kind={character}
          mood={finished ? 'happy' : talking ? 'talking' : 'idle'}
          size={150}
        />
        <p className="bubble" aria-live="polite">
          {bubble}
        </p>
      </div>

      <svg
        ref={svgRef}
        className={`trace__board${finished ? ' trace--done' : ''}`}
        viewBox="0 0 100 120"
        role="img"
        aria-label={`${name} ile ${letter.lower} harfini yazma alanı`}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        {RULE_LINES.map((y) => (
          <line key={y} x1="4" x2="96" y1={y} y2={y} className="trace__rule" />
        ))}

        {paths.map((d) => (
          <g key={d}>
            <path d={d} className="trace__track" />
            <path d={d} className="trace__dash" />
          </g>
        ))}

        {paths.map((d, i) => {
          const percent = progressPercent(samples[i], indexes[i])
          return percent > 0 ? (
            <path
              key={d}
              d={d}
              pathLength={100}
              className="trace__ink"
              strokeDasharray={`${percent} 100`}
            />
          ) : null
        })}

        {tip && <circle cx={tip.x} cy={tip.y} r="5" className="trace__tip" />}

        {startPoint && (
          <g transform={`translate(${startPoint.x} ${startPoint.y})`}>
            <circle r="7" className="trace__start" />
            <text className="trace__number" textAnchor="middle" dy="3">
              {activeStroke + 1}
            </text>
          </g>
        )}
      </svg>

      <div className="actions">
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Baştan yaz"
          title="Baştan yaz"
          onClick={() => setIndexes(paths.map(() => -1))}
        >
          ↺
        </Button>
        <Button
          className={finished && hasNext ? 'btn--go btn--attention' : 'btn--go'}
          onClick={onNext}
          disabled={!hasNext}
        >
          {hasNext ? (
            <>
              Devam
              <span className="btn__arrow" aria-hidden="true">
                ➜
              </span>
            </>
          ) : (
            'Şimdilik bu kadar!'
          )}
        </Button>
      </div>

      {finished && <Confetti />}
    </section>
  )
}
