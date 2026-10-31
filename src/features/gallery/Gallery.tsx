import { Character } from '../../components/characters/Character'
import { getCharacterName } from '../../components/characters/types'
import { alphabet } from '../../data/alphabet'
import { castByLetter } from '../../data/cast'
import { strokes } from '../../data/strokes'

const RULE_LINES = [12, 42, 92]

/** Yolun başlangıç noktasını ("M x y") okur. */
function startOf(d: string): { x: number; y: number } | null {
  const match = /^M\s*([\d.]+)\s+([\d.]+)/.exec(d)
  return match ? { x: Number(match[1]), y: Number(match[2]) } : null
}

export function Gallery() {
  return (
    <main className="gallery">
      <h1>Harf galerisi (geliştirici görünümü)</h1>
      <p>Sarı numaralı daire = vuruşun başlangıcı. Şekli bozuk duran harfi not et.</p>
      <div className="gallery__grid">
        {alphabet.map((letter) => {
          const kind = castByLetter[letter.lower]
          const paths = strokes[letter.lower] ?? []
          return (
            <figure key={letter.lower} className="gallery__item">
              <svg viewBox="0 0 100 120" className="gallery__board">
                {RULE_LINES.map((y) => (
                  <line key={y} x1="4" x2="96" y1={y} y2={y} className="trace__rule" />
                ))}
                {paths.map((d) => (
                  <path key={d} d={d} className="trace__track" />
                ))}
                {paths.map((d) => (
                  <path key={`dash-${d}`} d={d} className="trace__dash" />
                ))}
                {paths.map((d, i) => {
                  const start = startOf(d)
                  return start ? (
                    <g key={`start-${d}`} transform={`translate(${start.x} ${start.y})`}>
                      <circle r="6" fill="#ffc93c" stroke="#3b2e5a" strokeWidth="1" />
                      <text textAnchor="middle" dy="3" fontSize="8" fontWeight="700" fill="#3b2e5a">
                        {i + 1}
                      </text>
                    </g>
                  ) : null
                })}
              </svg>
              <Character kind={kind} size={90} />
              <figcaption>
                {letter.upper} {letter.lower} · {getCharacterName(kind)}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </main>
  )
}
