import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Button } from '../../../components/Button'
import { Character } from '../../../components/characters/Character'
import { getCharacterVoice } from '../../../components/characters/types'
import type { CharacterKind } from '../../../components/characters/types'
import { Confetti } from '../../../components/Confetti'
import { say, stopTalking } from '../../../lib/speech'
import { spokenForm } from '../spoken'
import type { PaintSetup } from './paint'
import { labelFontSize, shapeBox, shapeCenter } from './shapes'
import type { Shape } from './shapes'

function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3
  return mistakes <= 3 ? 2 : 1
}

function ShapeView({ shape, fill }: { shape: Shape; fill: string }) {
  switch (shape.type) {
    case 'rect':
      return (
        <rect
          className="region__shape"
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          fill={fill}
        />
      )
    case 'circle':
      return (
        <circle className="region__shape" cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />
      )
    case 'ellipse':
      return (
        <ellipse
          className="region__shape"
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          transform={shape.rotate ? `rotate(${shape.rotate} ${shape.cx} ${shape.cy})` : undefined}
          fill={fill}
        />
      )
    case 'polygon':
      return <polygon className="region__shape" points={shape.points} fill={fill} />
  }
}

interface PaintGameProps {
  setup: PaintSetup
  character: CharacterKind
  onFinish: (stars: number) => void
  onExit: () => void
}

export function PaintGame({ setup, character, onFinish, onExit }: PaintGameProps) {
  const { picture, items, colors, labels } = setup
  const [selected, setSelected] = useState<number | null>(null)
  const [painted, setPainted] = useState<Record<string, string>>({})
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [hint, setHint] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const finishRef = useRef(onFinish)
  const { pitch, rate } = getCharacterVoice(character)
  const done = Object.keys(painted).length === picture.regions.length

  useEffect(() => {
    finishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    say([{ text: 'Bir boya seç, sonra aynısını bul!' }], { pitch, rate })
    return () => stopTalking()
  }, [pitch, rate])

  useEffect(() => {
    if (!done) return
    say([{ text: 'Çok güzel boyadın!' }], { pitch, rate })
    const timer = setTimeout(() => finishRef.current(starsFor(mistakes)), 2600)
    return () => {
      clearTimeout(timer)
      stopTalking()
    }
  }, [done, mistakes, pitch, rate])

  useEffect(() => {
    if (!hint) return
    const timer = setTimeout(() => setHint(false), 900)
    return () => clearTimeout(timer)
  }, [hint])

  useEffect(() => {
    if (wrongId === null) return
    const timer = setTimeout(() => setWrongId(null), 450)
    return () => clearTimeout(timer)
  }, [wrongId])

  function selectPot(index: number) {
    setSelected(index)
    say([{ text: spokenForm(picture.kind, items[index]), rate: 0.6, clip: items[index] }], {
      pitch,
      rate,
    })
  }

  function paintRegion(index: number) {
    const region = picture.regions[index]
    if (done || painted[region.id]) return

    if (selected === null) {
      setHint(true)
      say([{ text: 'Önce bir boya seç!' }], { pitch, rate })
      return
    }
    if (labels[index] === items[selected]) {
      setPainted((current) => ({ ...current, [region.id]: colors[selected] }))
    } else {
      setWrongId(region.id)
      setMistakes((count) => count + 1)
      say([{ text: 'Bu başka! Bir daha bak.' }], { pitch, rate })
    }
  }

  function handleKey(event: KeyboardEvent<SVGGElement>, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      paintRegion(index)
    }
  }

  return (
    <section className="intro">
      <div className="intro__stage">
        <Character kind={character} mood={done ? 'happy' : 'idle'} size={120} />
        <p className="bubble">Aynı yazıyı boya!</p>
      </div>

      <svg
        className="paint__canvas"
        viewBox={picture.viewBox}
        role="group"
        aria-label={`${picture.title} boyama`}
      >
        {picture.regions.map((region, index) => {
          const label = labels[index]
          const color = painted[region.id]
          const center = region.labelAt ?? shapeCenter(region.shape)
          const fontSize = labelFontSize(shapeBox(region.shape), label.length)
          const classes = ['region']
          if (color) classes.push('region--done')
          if (wrongId === region.id) classes.push('region--wrong')
          return (
            <g
              key={region.id}
              className={classes.join(' ')}
              role="button"
              tabIndex={color ? -1 : 0}
              aria-label={label}
              onClick={() => paintRegion(index)}
              onKeyDown={(event) => handleKey(event, index)}
            >
              <ShapeView shape={region.shape} fill={color ?? '#fff8ec'} />
              <text
                className="region__label"
                x={center.x}
                y={center.y}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {label}
              </text>
            </g>
          )
        })}
        {picture.decor?.map((spot) => (
          <circle
            key={`${spot.cx}-${spot.cy}`}
            cx={spot.cx}
            cy={spot.cy}
            r={spot.r}
            fill={spot.fill}
            pointerEvents="none"
          />
        ))}
      </svg>

      <div className={`pots${hint ? ' pots--hint' : ''}`}>
        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            className={`pot${selected === index ? ' pot--on' : ''}`}
            style={{ background: colors[index] }}
            aria-label={`${item} boyası`}
            onClick={() => selectPot(index)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="actions">
        <Button
          variant="ghost"
          className="btn--icon"
          aria-label="Oyun parkına dön"
          title="Oyun parkına dön"
          onClick={onExit}
        >
          🏠
        </Button>
      </div>

      {done && <Confetti />}
    </section>
  )
}
