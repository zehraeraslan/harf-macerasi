import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Character } from '../../components/characters/Character'
import { errorHint, isListeningSupported, listen, requestMicAccess } from '../../lib/listen'
import type { ListenOutcome } from '../../lib/listen'
import { getVoiceStatus, unlockSpeech } from '../../lib/speech'
import type { VoiceStatus } from '../../lib/speech'

type TestState =
  | { phase: 'idle' }
  | { phase: 'preparing' }
  | { phase: 'speak' }
  | { phase: 'done'; message: string }

function describe(outcome: ListenOutcome): string {
  switch (outcome.status) {
    case 'nomatch':
    case 'matched':
      return `Duydum: “${outcome.heard[0] ?? ''}”. Mikrofon çalışıyor!`
    case 'sound':
      return 'Sesini duydum ama yazıya çeviremedim. Biraz daha net ve yüksek söyle.'
    case 'silence':
      return 'Hiçbir şey duymadım. Doğru mikrofon seçili mi? Sesini biraz yükselt.'
    case 'denied':
    case 'error':
      return errorHint(outcome.error)
    default:
      return 'Bu tarayıcı mikrofonla okumayı desteklemiyor.'
  }
}

interface StartScreenProps {
  micEnabled: boolean
  onMicChange: (enabled: boolean) => void
  onStart: () => void
}

export function StartScreen({ micEnabled, onMicChange, onStart }: StartScreenProps) {
  const [voice, setVoice] = useState<VoiceStatus>('ok')
  const [note, setNote] = useState('')
  const [test, setTest] = useState<TestState>({ phase: 'idle' })
  const micSupported = isListeningSupported()
  const micActive = micEnabled && micSupported

  useEffect(() => {
    void getVoiceStatus().then(setVoice)
  }, [])

  async function handleStart() {
    unlockSpeech()
    if (micActive) {
      const access = await requestMicAccess()
      if (access === 'denied') {
        onMicChange(false)
        setNote(
          'Mikrofon izni verilmedi, mikrofon kapatıldı. Tarayıcı ayarlarından izin verip tekrar açabilirsin.',
        )
        return
      }
    }
    onStart()
  }

  async function handleTest() {
    unlockSpeech()
    setTest({ phase: 'preparing' })
    const access = await requestMicAccess()
    if (access === 'denied') {
      setTest({ phase: 'done', message: errorHint('not-allowed') })
      return
    }
    const outcome = await listen({
      timeoutMs: 5000,
      accept: () => false,
      onReady: () => setTest({ phase: 'speak' }),
    })
    setTest({ phase: 'done', message: describe(outcome) })
  }

  return (
    <section className="intro">
      <Character kind="chick" mood="happy" size={180} />
      <h1 className="title">Harf Macerası</h1>
      <p className="subtitle">Harfleri birlikte öğrenelim!</p>
      <Button onClick={() => void handleStart()}>Başlayalım!</Button>

      <div className="parent">
        <label className="mic-toggle">
          <input
            type="checkbox"
            checked={micActive}
            disabled={!micSupported}
            onChange={(event) => {
              onMicChange(event.target.checked)
              setTest({ phase: 'idle' })
            }}
          />
          <span>🎤 Mikrofonla okuma (ebeveyn onayı)</span>
        </label>
        <p className="notice">
          {micSupported
            ? 'Açıkken ses, tarayıcının konuşma tanıma servisine internet üzerinden gönderilebilir. Uygulama sesi kaydetmez.'
            : 'Bu tarayıcı mikrofonla okumayı desteklemiyor. Chrome ya da Safari dene.'}
        </p>

        {micActive && (
          <>
            <Button variant="ghost" onClick={() => void handleTest()}>
              🎤 Mikrofonu dene
            </Button>
            {test.phase === 'preparing' && <p className="notice">Hazırlanıyor…</p>}
            {test.phase === 'speak' && (
              <p className="notice notice--live">🎤 Şimdi bir şey söyle! (örneğin “ana”)</p>
            )}
            {test.phase === 'done' && <p className="notice">{test.message}</p>}
          </>
        )}
        {note && <p className="notice">{note}</p>}
      </div>

      {voice === 'unsupported' && (
        <p className="notice">Bu tarayıcı sesli okumayı desteklemiyor. Chrome veya Safari dene.</p>
      )}
      {voice === 'no-turkish' && (
        <p className="notice">
          Bu cihazda Türkçe ses bulunamadı, okunuşlar doğru olmayabilir. Cihaz ayarlarından Türkçe
          ses ekleyebilirsin.
        </p>
      )}
    </section>
  )
}
