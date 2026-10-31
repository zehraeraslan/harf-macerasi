import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const OUT = new URL('../public/', import.meta.url)

/** Civciv çizimi, 512x512 kutusunda. */
const chick = `
  <ellipse cx="206" cy="440" rx="40" ry="16" fill="#ff8a3d"/>
  <ellipse cx="306" cy="440" rx="40" ry="16" fill="#ff8a3d"/>
  <ellipse cx="108" cy="300" rx="34" ry="66" fill="#f4b93f" transform="rotate(14 108 300)"/>
  <ellipse cx="404" cy="300" rx="34" ry="66" fill="#f4b93f" transform="rotate(-14 404 300)"/>
  <circle cx="256" cy="268" r="168" fill="#ffc93c"/>
  <ellipse cx="256" cy="330" rx="98" ry="70" fill="#ffe27a"/>
  <path d="M236 108 Q240 66 256 102 Q272 62 280 108" fill="none" stroke="#ff8a3d" stroke-width="16" stroke-linecap="round"/>
  <circle cx="160" cy="298" r="26" fill="#ff4f81" opacity="0.4"/>
  <circle cx="352" cy="298" r="26" fill="#ff4f81" opacity="0.4"/>
  <circle cx="196" cy="240" r="22" fill="#3b2e5a"/>
  <circle cx="204" cy="231" r="7" fill="#fff"/>
  <circle cx="316" cy="240" r="22" fill="#3b2e5a"/>
  <circle cx="324" cy="231" r="7" fill="#fff"/>
  <path d="M222 276 L290 276 L256 326 Z" fill="#ff8a3d" stroke="#ff8a3d" stroke-width="10" stroke-linejoin="round"/>
`

function svg({ scale, rounded }) {
  const corner = rounded ? 'rx="112"' : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" ${corner} fill="#ff4f81"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -278)">${chick}</g>
</svg>`
}

await writeFile(new URL('favicon.svg', OUT), svg({ scale: 0.9, rounded: true }))

const jobs = [
  { file: 'pwa-192x192.png', size: 192, scale: 0.9, rounded: true },
  { file: 'pwa-512x512.png', size: 512, scale: 0.9, rounded: true },
  // Maskable: önemli kısım merkezdeki %80'lik güvenli alana sığmalı
  { file: 'pwa-maskable-512x512.png', size: 512, scale: 0.62, rounded: false },
  // iOS köşeleri kendisi yuvarlar, şeffaf alan siyah görünür; tam kare olmalı
  { file: 'apple-touch-icon.png', size: 180, scale: 0.8, rounded: false },
]

for (const job of jobs) {
  await sharp(Buffer.from(svg(job)), { density: 288 })
    .resize(job.size, job.size)
    .png()
    .toFile(fileURLToPath(new URL(job.file, OUT)))
  console.log('oluşturuldu:', job.file)
}
