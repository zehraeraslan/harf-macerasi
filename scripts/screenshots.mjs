import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, devices } from 'playwright'

/** Geliştirme sunucusu çalışıyor olmalı: npm run dev */
const BASE = process.env.APP_URL ?? 'http://localhost:5173'
const OUT = fileURLToPath(new URL('../docs/screenshots/', import.meta.url))

/** Örnek ilerleme: oyunlar açık, 6 harf tamamlanmış, birkaç çıkartma toplanmış. */
const PROGRESS = {
  version: 1,
  stars: { a: 3, n: 3, e: 2, t: 3, i: 2, l: 3 },
  stickers: [
    'unicorn',
    'rocket',
    'whale',
    'strawberry',
    'rainbow',
    'turtle',
    'butterfly',
    'balloon',
  ],
}

const DESKTOP = { viewport: { width: 1280, height: 900 } }
const PHONE = devices['iPhone 14']

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const failures = []

async function capture(name, options, run) {
  const context = await browser.newContext({ locale: 'tr-TR', ...options })
  await context.addInitScript((progress) => {
    localStorage.setItem('harf-macerasi:progress', JSON.stringify(progress))
  }, PROGRESS)
  const page = await context.newPage()
  try {
    await run(page)
    console.log('✓', name)
  } catch (error) {
    failures.push(name)
    console.log('✗', name, '-', String(error.message).split('\n')[0])
  } finally {
    await context.close()
  }
}

async function shot(page, name, wait = 900, fullPage = false) {
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 88, fullPage })
}

async function toMap(page) {
  await page.goto(BASE)
  await page.getByRole('button', { name: 'Başlayalım!' }).click()
}

async function toPark(page) {
  await toMap(page)
  await page.getByRole('button', { name: /Oyun Parkı/ }).click()
}

async function openGame(page, name) {
  await toPark(page)
  await page.getByRole('button', { name }).click()
}

/** Harfin bir vuruşunun yolunu fareyle, belirtilen oranda izler. */
async function drawStroke(page, index, fraction) {
  const points = await page.evaluate(
    ({ index, fraction }) => {
      const path = document.querySelectorAll('.trace__dash')[index]
      const m = path.getScreenCTM()
      const total = path.getTotalLength()
      return Array.from({ length: 41 }, (_, i) => {
        const p = path.getPointAtLength((total * fraction * i) / 40)
        return { x: p.x * m.a + p.y * m.c + m.e, y: p.x * m.b + p.y * m.d + m.f }
      })
    },
    { index, fraction },
  )
  await page.mouse.move(points[0].x, points[0].y)
  await page.mouse.down()
  for (const point of points) await page.mouse.move(point.x, point.y, { steps: 2 })
  await page.mouse.up()
}

await capture('01-baslangic', DESKTOP, async (page) => {
  await page.goto(BASE)
  await shot(page, '01-baslangic')
})

await capture('02-harita', DESKTOP, async (page) => {
  await toMap(page)
  await shot(page, '02-harita')
})

await capture('03-tanisma', DESKTOP, async (page) => {
  await toMap(page)
  await page.getByRole('button', { name: /^N n/ }).click()
  await shot(page, '03-tanisma', 2500)
})

await capture('04-yazma', DESKTOP, async (page) => {
  await toMap(page)
  await page.getByRole('button', { name: /^N n/ }).click()
  await page.getByRole('button', { name: /Yazalım/ }).click()
  await page.waitForTimeout(800)
  await drawStroke(page, 0, 1)
  await drawStroke(page, 1, 0.7)
  await shot(page, '04-yazma')
})

await capture('05-park', DESKTOP, async (page) => {
  await toPark(page)
  await shot(page, '05-park')
})

await capture('06-balon', DESKTOP, async (page) => {
  await openGame(page, /Balon Patlat/)
  await shot(page, '06-balon', 1800)
})

await capture('07-yaris', DESKTOP, async (page) => {
  await openGame(page, /Yol Yarışı/)
  await shot(page, '07-yaris', 1800)
})

await capture('08-boyama', DESKTOP, async (page) => {
  await openGame(page, /Boyama/)
  await page.getByText('Ev', { exact: true }).click()
  await page.waitForTimeout(500)
  const pots = page.locator('.pot')
  const label = (await pots.first().innerText()).trim()
  await pots.first().click()
  const regions = page.locator(`.region[aria-label="${label}"]`)
  const count = await regions.count()
  for (let i = 0; i < count; i++) await regions.nth(i).dispatchEvent('click')
  await shot(page, '08-boyama')
})

await capture('09-hafiza', DESKTOP, async (page) => {
  await openGame(page, /Hafıza/)
  await shot(page, '09-hafiza', 1800)
})

await capture('10-album', DESKTOP, async (page) => {
  await toPark(page)
  await page.getByRole('button', { name: /Çıkartma Albümü/ }).click()
  await shot(page, '10-album')
})

await capture('11-ebeveyn', DESKTOP, async (page) => {
  await page.goto(BASE)
  await page.getByRole('button', { name: /Ebeveynler için/ }).click()
  await shot(page, '11-ebeveyn')
})

// Geliştirici galerisi sadece `npm run dev` ile açık olur
await capture('12-karakterler', DESKTOP, async (page) => {
  await page.goto(`${BASE}/?gallery`)
  await page.getByText('Harf galerisi').waitFor({ timeout: 4000 })
  await shot(page, '12-karakterler', 800, true)
})

await capture('13-mobil-harita', PHONE, async (page) => {
  await toMap(page)
  await shot(page, '13-mobil-harita')
})

await capture('14-mobil-yazma', PHONE, async (page) => {
  await toMap(page)
  await page.getByRole('button', { name: /^N n/ }).click()
  await page.getByRole('button', { name: /Yazalım/ }).click()
  await shot(page, '14-mobil-yazma', 1200)
})

await browser.close()

if (failures.length > 0) {
  console.log(`\n${failures.length} görüntü alınamadı: ${failures.join(', ')}`)
  process.exitCode = 1
} else {
  console.log('\nHepsi tamam: docs/screenshots')
}
