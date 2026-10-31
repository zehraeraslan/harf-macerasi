interface AlternativeLike {
  transcript: string
}
interface ResultLike {
  readonly length: number
  readonly [index: number]: AlternativeLike
}
interface ResultEventLike {
  readonly results: { readonly length: number; readonly [index: number]: ResultLike }
}
interface RecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onsoundstart: (() => void) | null
  onspeechstart: (() => void) | null
  onresult: ((event: ResultEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionConstructor = new () => RecognitionLike
type SpeechWindow = Window & {
  SpeechRecognition?: RecognitionConstructor
  webkitSpeechRecognition?: RecognitionConstructor
}

export type ListenOutcome =
  | { status: 'matched'; heard: string[] }
  | { status: 'nomatch'; heard: string[] }
  /** Ses algılandı ama yazıya çevrilemedi (kısa sesler için sık görülür). */
  | { status: 'sound' }
  | { status: 'silence' }
  | { status: 'denied'; error: string }
  | { status: 'error'; error: string }
  | { status: 'unsupported' }

interface ListenOptions {
  /** Mikrofon hazır olduktan sonra en fazla ne kadar dinlenir. */
  timeoutMs: number
  signal?: AbortSignal
  /** Duyulan alternatifler hedefle eşleşiyor mu? Eşleşirse dinleme hemen biter. */
  accept: (heard: string[]) => boolean
  /** Mikrofon gerçekten dinlemeye başlayınca çağrılır. */
  onReady?: () => void
}

function getConstructor(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  const speechWindow = window as SpeechWindow
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

export function isListeningSupported(): boolean {
  return getConstructor() !== undefined
}

/**
 * Mikrofon iiznini bir dokunuşun içinde önceden ister ve hemen bırakır.
 * Böylece ders sırasında izin penceresi çıkmaz, Safari de ses oturumunu açık tutar.
 */
export async function requestMicAccess(): Promise<'granted' | 'denied' | 'unavailable'> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return 'unavailable'
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
    return 'granted'
  } catch (error) {
    const name = error instanceof DOMException ? error.name : ''
    return name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'unavailable'
  }
}

/** Hata kodunu ebeveynin anlayacağı bir cümleye çevirir. */
export function errorHint(code: string): string {
  switch (code) {
    case 'not-allowed':
      return 'Mikrofon izni verilmedi. Adres çubuğundaki izin simgesinden mikrofona izin ver.'
    case 'service-not-allowed':
      return 'Konuşma tanıma servisi kapalı. Safari için: Sistem Ayarları > Klavye > Dikte açık olmalı. Chrome için mikrofon iznini kontrol et.'
    case 'audio-capture':
      return 'Mikrofon bulunamadı. Bir mikrofon bağlı mı?'
    case 'network':
      return 'İnternet gerekli: konuşma tanıma çevrimiçi çalışır.'
    default:
      return `Bilinmeyen bir hata oldu (${code || 'kod yok'}).`
  }
}

/** Mikrofonu açar ve konuşulanı dinler. Uygulama sesi kaydetmez, saklamaz. */
export function listen({
  timeoutMs,
  signal,
  accept,
  onReady,
}: ListenOptions): Promise<ListenOutcome> {
  const Recognition = getConstructor()
  if (!Recognition) return Promise.resolve({ status: 'unsupported' })

  return new Promise((resolve) => {
    const recognition = new Recognition()
    let heard: string[] = []
    let soundHeard = false
    let denied = false
    let failed = false
    let lastError = ''
    let settled = false
    let armed = false
    let deadline = Infinity
    let stopTimer: ReturnType<typeof setTimeout> | undefined
    let hardTimer: ReturnType<typeof setTimeout> | undefined

    function finish(outcome: ListenOutcome) {
      if (settled) return
      settled = true
      clearTimeout(startGuard)
      clearTimeout(stopTimer)
      clearTimeout(hardTimer)
      signal?.removeEventListener('abort', onAbort)
      recognition.onstart = null
      recognition.onsoundstart = null
      recognition.onspeechstart = null
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        // zaten durmuş olabilir
      }
      resolve(outcome)
    }

    function conclude() {
      if (denied) finish({ status: 'denied', error: lastError })
      else if (failed) finish({ status: 'error', error: lastError })
      else if (heard.length > 0) finish({ status: 'nomatch', heard })
      else if (soundHeard) finish({ status: 'sound' })
      else finish({ status: 'silence' })
    }

    function onAbort() {
      finish({ status: 'silence' })
    }

    /** Mikrofon hazır: süre şimdi başlar. Sadece bir kez çalışır. */
    function arm() {
      if (armed || settled) return
      armed = true
      clearTimeout(startGuard)
      deadline = Date.now() + timeoutMs
      onReady?.()
      stopTimer = setTimeout(() => {
        try {
          recognition.stop()
        } catch {
          // zaten durmuş olabilir
        }
        // Bazı tarayıcılar end olayını geç gönderir; takılmayalım.
        hardTimer = setTimeout(conclude, 1500)
      }, timeoutMs)
    }

    recognition.lang = 'tr-TR'
    // Sürekli dinleme: kısa seslerde motor erken pes etmesin
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 5

    recognition.onstart = arm
    recognition.onsoundstart = () => {
      soundHeard = true
    }
    recognition.onspeechstart = () => {
      soundHeard = true
    }

    recognition.onresult = (event) => {
      const alternatives: string[] = []
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        for (let j = 0; j < result.length; j++) alternatives.push(result[j].transcript)
      }
      heard = alternatives
      if (accept(alternatives)) finish({ status: 'matched', heard })
    }

    recognition.onerror = (event) => {
      lastError = event.error
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') denied = true
      else if (event.error !== 'no-speech' && event.error !== 'aborted') failed = true
    }

    recognition.onend = () => {
      // Tarayıcı sessizlik yüzünden erken kapattıysa ve süre varsa yeniden başlat
      const canRetry = heard.length === 0 && !denied && !failed && deadline - Date.now() > 800
      if (canRetry) {
        try {
          recognition.start()
          return
        } catch {
          // yeniden başlatılamadı, sonuçlandır
        }
      }
      conclude()
    }

    // "start" olayı hiç gelmezse süre yine de işlesin
    const startGuard = setTimeout(arm, 2500)
    signal?.addEventListener('abort', onAbort, { once: true })

    try {
      recognition.start()
    } catch {
      finish({ status: 'error', error: 'start-failed' })
    }
  })
}
