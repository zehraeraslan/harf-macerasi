export type VoiceStatus = 'ok' | 'no-turkish' | 'unsupported'

interface SpeakOptions {
  rate?: number
  pitch?: number
  /** İptal edilirse konuşma ve bekleme hemen biter. */
  signal?: AbortSignal
  /** Ses kaydı için metin. public/audio/<anahtar>.mp3 varsa o çalınır, yoksa cihaz sesi kullanılır. */
  clip?: string
}

const TURKISH_CHARS: Record<string, string> = {
  ç: 'c_',
  ğ: 'g_',
  ı: 'i_',
  ö: 'o_',
  ş: 's_',
  ü: 'u_',
}

/** Metinden ses dosyası adını üretir: "Pıtır" -> "pi_ti_r". Farklı harfler asla çakışmaz. */
export function clipKey(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (char) => TURKISH_CHARS[char])
    .replace(/[^a-z0-9_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

let manifestPromise: Promise<Set<string>> | undefined

/** public/audio/manifest.json: mevcut ses dosyalarının anahtar listesi. Yoksa boş sayılır. */
function loadManifest(): Promise<Set<string>> {
  manifestPromise ??= fetch(`${import.meta.env.BASE_URL}audio/manifest.json`)
    .then((response) => (response.ok ? (response.json() as Promise<string[]>) : []))
    .then((list) => new Set(list))
    .catch(() => new Set<string>())
  return manifestPromise
}

function playClip(key: string, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/${key}.mp3`)
    audio.onended = () => resolve()
    audio.onerror = () => resolve()
    signal?.addEventListener(
      'abort',
      () => {
        audio.pause()
        resolve()
      },
      { once: true },
    )
    void audio.play().catch(() => resolve())
  })
}

let voicePromise: Promise<SpeechSynthesisVoice | undefined> | undefined

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function findTurkishVoice(): SpeechSynthesisVoice | undefined {
  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('tr'))
}

/** Sesler tarayıcıda geç yüklenebilir; en fazla 1,5 saniye bekler. */
function loadVoice(): Promise<SpeechSynthesisVoice | undefined> {
  voicePromise ??= new Promise((resolve) => {
    const found = findTurkishVoice()
    if (found) {
      resolve(found)
      return
    }
    const synth = window.speechSynthesis
    const finish = () => {
      synth.removeEventListener('voiceschanged', finish)
      clearTimeout(timer)
      resolve(findTurkishVoice())
    }
    const timer = setTimeout(finish, 1500)
    synth.addEventListener('voiceschanged', finish)
  })
  return voicePromise
}

export async function getVoiceStatus(): Promise<VoiceStatus> {
  if (!isSpeechSupported()) return 'unsupported'
  return (await loadVoice()) ? 'ok' : 'no-turkish'
}

export function pause(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

/** Önce ses kaydını dener, yoksa cihaz sesiyle okur. Bitince (ya da iptal edilince) çözülür. */
export async function speak(
  text: string,
  { rate = 0.8, pitch = 1.15, signal, clip }: SpeakOptions = {},
): Promise<void> {
  if (clip) {
    const manifest = await loadManifest()
    const key = clipKey(clip)
    if (!signal?.aborted && manifest.has(key)) {
      await playClip(key, signal)
      return
    }
  }

  if (!isSpeechSupported()) {
    await pause(900, signal)
    return
  }
  const voice = await loadVoice()
  if (signal?.aborted) return

  await new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tr-TR'
    if (voice) utterance.voice = voice
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    signal?.addEventListener('abort', () => resolve(), { once: true })
    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}

/** Safari gibi tarayıcılarda sesin ilk çalışması bir dokunuşun içinde başlamalı. */
export function unlockSpeech(): void {
  if (!isSpeechSupported()) return
  const silent = new SpeechSynthesisUtterance(' ')
  silent.volume = 0
  window.speechSynthesis.speak(silent)
}
