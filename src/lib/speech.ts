export type VoiceStatus = 'ok' | 'no-turkish' | 'unsupported'

interface SpeakOptions {
  rate?: number
  pitch?: number
  /** İptal edilirse konuşma ve bekleme hemen biter. */
  signal?: AbortSignal
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

/** Metni seslendirir; konuşma bitince (ya da iptal edilince) çözülür. */
export async function speak(
  text: string,
  { rate = 0.8, pitch = 1.15, signal }: SpeakOptions = {},
): Promise<void> {
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
