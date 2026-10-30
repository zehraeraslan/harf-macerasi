import { useState } from 'react'
import './scene.css'

/** Çiçekler mantar evlerin ve mantarların konumlarından uzak tutulur. */
const BLOSSOMS = [
  { x: 30, y: 672, color: '#ff4f81', size: 1 },
  { x: 240, y: 664, color: '#ffc93c', size: 0.9 },
  { x: 345, y: 684, color: '#ffffff', size: 0.9 },
  { x: 430, y: 660, color: '#7b5cfa', size: 0.8 },
  { x: 930, y: 668, color: '#ffffff', size: 0.9 },
  { x: 1055, y: 662, color: '#ff8a3d', size: 1 },
  { x: 1110, y: 686, color: '#ff4f81', size: 0.9 },
  { x: 1180, y: 672, color: '#ffc93c', size: 0.9 },
]

const FRUIT_SPOTS = [
  { x: -22, y: -108 },
  { x: 16, y: -120 },
  { x: -12, y: -134 },
  { x: -40, y: -78 },
  { x: 34, y: -84 },
  { x: -4, y: -86 },
  { x: 4, y: -60 },
]

function Blossom({ x, y, color, size }: { x: number; y: number; color: string; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M0 0 V22" stroke="#2fb56f" strokeWidth="3" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-7"
          rx="4.5"
          ry="7"
          fill={color}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="3.5" fill="#fff3b0" />
    </g>
  )
}

function Tree({ x, y, scale = 1, fruit }: { x: number; y: number; scale?: number; fruit: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-9" y="-70" width="18" height="70" rx="6" fill="#a8652f" />
      <circle cx="0" cy="-98" r="48" fill="#2fa862" />
      <circle cx="-30" cy="-68" r="30" fill="#2fa862" />
      <circle cx="30" cy="-68" r="30" fill="#2fa862" />
      <circle cx="-10" cy="-112" r="30" fill="#4fcf86" opacity="0.7" />
      {FRUIT_SPOTS.map((spot) => (
        <g key={`${spot.x}-${spot.y}`} transform={`translate(${spot.x} ${spot.y})`}>
          <circle r="6" fill={fruit} />
          <circle cx="-2" cy="-2" r="1.8" fill="#fff" opacity="0.6" />
        </g>
      ))}
    </g>
  )
}

function Mushroom({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-7" y="0" width="14" height="22" rx="6" fill="#fff0d6" />
      <path d="M-24 2 Q0 -34 24 2 Z" fill="#ff4f4f" />
      <circle cx="-9" cy="-8" r="3.5" fill="#fff" />
      <circle cx="7" cy="-12" r="3" fill="#fff" />
    </g>
  )
}

function Butterfly({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="flutter" style={{ animationDelay: `${delay}s` }}>
        <g className="flap">
          <ellipse cx="-7" cy="-3" rx="8" ry="6" fill={color} transform="rotate(-20 -7 -3)" />
          <ellipse cx="7" cy="-3" rx="8" ry="6" fill={color} transform="rotate(20 7 -3)" />
        </g>
        <rect x="-1" y="-6" width="2" height="14" rx="1" fill="#3b2e5a" />
      </g>
    </g>
  )
}

interface BirdProps {
  y: number
  color: string
  wing: string
  direction: 'left' | 'right'
  duration: number
  /** Eksi değer: kuş sayfa açıldığında zaten uçuşun ortasında olur. */
  delay: number
}

/** Ekranı baştan sona geçen, kanat çırpan kuş. */
function Bird({ y, color, wing, direction, duration, delay }: BirdProps) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g
        className={`bird bird--${direction}`}
        style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      >
        <g transform={direction === 'left' ? 'scale(-1 1)' : undefined}>
          <polygon points="-10,-2 -21,-7 -18,3" fill={color} />
          <ellipse cx="0" cy="0" rx="11" ry="8" fill={color} />
          <circle cx="10" cy="-4" r="6" fill={color} />
          <circle cx="12" cy="-5" r="1.4" fill="#3b2e5a" />
          <polygon points="15,-4 22,-2.5 15,-1" fill="#ff8a3d" />
          <g className="bird__wing">
            <ellipse cx="-1" cy="-6" rx="9" ry="5" fill={wing} transform="rotate(-25 -1 -6)" />
          </g>
        </g>
      </g>
    </g>
  )
}

/** Sayfanın arkasındaki sabit masal manzarası. public/backgrounds/scene.jpg varsa onun altında kalır. */
export function Scene() {
  const [imageReady, setImageReady] = useState(false)

  return (
    <>
      <svg
        className="scene"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fd3ff" />
            <stop offset="0.7" stopColor="#cdeeff" />
            <stop offset="1" stopColor="#fff4d9" />
          </linearGradient>
          <radialGradient id="sun">
            <stop offset="0" stopColor="#fff3b0" />
            <stop offset="0.35" stopColor="#ffd45c" />
            <stop offset="1" stopColor="#ffd45c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8e6b4" />
            <stop offset="1" stopColor="#8fdc9a" />
          </linearGradient>
          <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fdc99" />
            <stop offset="1" stopColor="#4fcf86" />
          </linearGradient>
          <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4fcf86" />
            <stop offset="1" stopColor="#2fb56f" />
          </linearGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <rect width="1200" height="700" fill="url(#sky)" />
        <circle cx="1040" cy="110" r="150" fill="url(#sun)" />

        <g className="cloud cloud--slow" fill="#fff" opacity="0.92">
          <ellipse cx="200" cy="120" rx="64" ry="26" />
          <ellipse cx="242" cy="104" rx="42" ry="24" />
          <ellipse cx="160" cy="108" rx="36" ry="20" />
        </g>
        <g className="cloud cloud--fast" fill="#fff" opacity="0.85">
          <ellipse cx="720" cy="70" rx="52" ry="20" />
          <ellipse cx="756" cy="58" rx="34" ry="18" />
        </g>

        <Bird y={200} color="#ff8a3d" wing="#e06a1a" direction="right" duration={26} delay={-8} />
        <Bird y={300} color="#7b5cfa" wing="#5a3fd6" direction="left" duration={34} delay={-20} />

        <g filter="url(#soft)" opacity="0.85">
          <path d="M0 470 L130 340 L240 430 L360 330 L520 470 V520 H0 Z" fill="#c9b9f5" />
          <path d="M700 470 L860 340 L960 420 L1090 330 L1200 440 V520 H700 Z" fill="#b7a6ee" />
        </g>

        <path d="M0 520 Q260 450 560 510 T1200 490 V700 H0 Z" fill="url(#hill-far)" />

        {/* Kalenin kendi tepesi: kale havada kalmasın */}
        <ellipse cx="980" cy="530" rx="150" ry="34" fill="url(#hill-far)" />

        <g transform="translate(980 522) scale(0.85)">
          <rect x="-70" y="-40" width="140" height="40" fill="#f1e8ff" />
          <rect x="-96" y="-62" width="24" height="62" fill="#f8f1ff" />
          <polygon points="-101,-62 -84,-100 -67,-62" fill="#ffc93c" />
          <rect x="72" y="-62" width="24" height="62" fill="#f8f1ff" />
          <polygon points="67,-62 84,-100 101,-62" fill="#ffc93c" />
          <rect x="-24" y="-110" width="48" height="110" fill="#fbf6ff" />
          <polygon points="-32,-110 0,-172 32,-110" fill="#7b5cfa" />
          <path d="M-11 0 V-22 Q0 -36 11 -22 V0 Z" fill="#8a4f2a" />
          <rect className="glow" x="-6" y="-90" width="12" height="18" rx="6" fill="#ffd45c" />
          <path d="M0 -172 V-196" stroke="#3b2e5a" strokeWidth="2" />
          <polygon className="pennant" points="0,-196 26,-188 0,-180" fill="#ff4f4f" />
        </g>

        {/* Çim kenarı: kalenin tabanını örter */}
        <ellipse cx="980" cy="538" rx="118" ry="24" fill="url(#hill-far)" />

        <ellipse cx="330" cy="560" rx="170" ry="22" fill="#8fdcff" />
        <ellipse cx="300" cy="558" rx="40" ry="6" fill="#fff" opacity="0.5" />

        <path d="M0 580 Q300 530 620 575 T1200 560 V700 H0 Z" fill="url(#hill-mid)" />

        <path
          d="M540 700 C570 650 640 630 700 610 C780 585 860 560 930 520 L950 526 C890 575 800 610 730 636 C670 658 640 676 690 700 Z"
          fill="#ffe3a3"
        />

        <path d="M0 640 Q300 600 620 640 T1200 628 V700 H0 Z" fill="url(#hill-near)" />

        <Tree x={60} y={640} scale={1.2} fruit="#ff4f4f" />
        <Tree x={1150} y={640} scale={1.1} fruit="#ff9a2e" />
        <Tree x={250} y={590} scale={0.6} fruit="#ff4f4f" />
        <Tree x={900} y={594} scale={0.55} fruit="#ff9a2e" />

        <g transform="translate(150 690)">
          <path d="M-34 0 Q-38 -46 -24 -62 H24 Q38 -46 34 0 Z" fill="#f2c48d" />
          <path d="M-62 -58 Q0 -140 62 -58 Q0 -48 -62 -58 Z" fill="#ff4f4f" />
          <circle cx="-30" cy="-72" r="6" fill="#fff" />
          <circle cx="-4" cy="-94" r="7" fill="#fff" />
          <circle cx="26" cy="-76" r="5" fill="#fff" />
          <path className="glow" d="M-11 0 V-26 Q0 -40 11 -26 V0 Z" fill="#ffd45c" />
        </g>
        <Mushroom x={300} y={676} scale={0.8} />
        <Mushroom x={1000} y={684} scale={0.9} />

        {BLOSSOMS.map((blossom) => (
          <Blossom key={`${blossom.x}-${blossom.y}`} {...blossom} />
        ))}

        <Butterfly x={300} y={400} color="#ff4f81" delay={0} />
        <Butterfly x={900} y={300} color="#ffc93c" delay={1} />
      </svg>

      <img
        className={`scene__image${imageReady ? ' scene__image--ready' : ''}`}
        src={`${import.meta.env.BASE_URL}backgrounds/scene.jpg`}
        alt=""
        onLoad={() => setImageReady(true)}
      />
    </>
  )
}
