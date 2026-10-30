import './scene.css'

/** Sayfanın arkasında duran sabit manzara: gökyüzü, tepeler, yol, ev, ağaçlar. */
export function Scene() {
  return (
    <svg
      className="scene"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8e3ff" />
          <stop offset="1" stopColor="#fff8ec" />
        </linearGradient>
      </defs>
      <rect width="1200" height="700" fill="url(#sky)" />

      <circle cx="1040" cy="110" r="78" fill="#ffc93c" opacity="0.35" />
      <circle cx="1040" cy="110" r="56" fill="#ffc93c" />

      <g className="cloud cloud--slow" fill="#fff">
        <ellipse cx="220" cy="120" rx="64" ry="26" />
        <ellipse cx="262" cy="104" rx="42" ry="24" />
        <ellipse cx="180" cy="108" rx="36" ry="20" />
      </g>
      <g className="cloud cloud--fast" fill="#fff">
        <ellipse cx="700" cy="70" rx="52" ry="20" />
        <ellipse cx="736" cy="58" rx="34" ry="18" />
        <ellipse cx="668" cy="60" rx="28" ry="15" />
      </g>

      <path d="M0 470 Q200 400 420 450 T820 440 T1200 430 V700 H0 Z" fill="#9be7b8" />

      <g>
        <rect x="112" y="400" width="124" height="82" fill="#fff" />
        <polygon points="96,402 174,340 252,402" fill="#ff4f81" />
        <rect x="200" y="350" width="16" height="32" fill="#c4325f" />
        <rect x="156" y="436" width="30" height="46" rx="4" fill="#7b5cfa" />
        <rect x="196" y="420" width="28" height="26" rx="3" fill="#3ec1f3" />
      </g>

      <g>
        <rect x="922" y="392" width="16" height="52" fill="#a8652f" />
        <circle cx="930" cy="372" r="40" fill="#2fb56f" />
        <circle cx="908" cy="394" r="26" fill="#2fb56f" />
        <circle cx="954" cy="394" r="26" fill="#2fb56f" />
        <rect x="1036" y="412" width="14" height="46" fill="#a8652f" />
        <circle cx="1043" cy="394" r="32" fill="#3ddc97" />
      </g>

      <path d="M0 560 Q260 480 560 540 T1200 520 V700 H0 Z" fill="#3ddc97" />

      <path
        d="M560 700 C590 640 700 620 690 580 C680 545 600 540 630 500 L664 506 C640 540 724 545 744 585 C764 630 704 660 744 700 Z"
        fill="#ffe3a3"
      />

      <g>
        <rect x="52" y="500" width="16" height="60" fill="#a8652f" />
        <circle cx="60" cy="480" r="44" fill="#2fb56f" />
        <circle cx="36" cy="504" r="28" fill="#2fb56f" />
        <circle cx="86" cy="504" r="28" fill="#2fb56f" />
      </g>
    </svg>
  )
}
