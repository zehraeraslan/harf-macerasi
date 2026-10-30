const COLORS = ['#ff4f81', '#ffc93c', '#3ec1f3', '#7b5cfa', '#3ddc97', '#ff8a3d']

/** Rastgelelik yerine sıraya bağlı sabit değerler: her render'da aynı sonucu verir. */
const pieces = Array.from({ length: 44 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (((i * 13) % 10) / 10) * 0.9,
  duration: 2.4 + (((i * 7) % 10) / 10) * 1.8,
  color: COLORS[i % COLORS.length],
  size: 8 + (i % 4) * 3,
  rotate: (i * 53) % 360,
}))

export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="confetti__piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.6,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            rotate: `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
