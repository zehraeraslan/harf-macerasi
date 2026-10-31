import { useCallback, useMemo, useState } from 'react'
import { Scene } from './components/Scene'
import type { CharacterKind } from './components/characters/types'
import { alphabet } from './data/alphabet'
import { castByLetter } from './data/cast'
import { words } from './data/words'
import {
  MAX_SYLLABLES,
  getNewSyllables,
  getWords,
  pickWords,
  spreadPick,
} from './features/curriculum/content'
import { FinishScreen } from './features/finish/FinishScreen'
import { BalloonGame } from './features/games/balloons/BalloonGame'
import type { GameResult } from './features/games/balloons/BalloonGame'
import { buildPool, buildRounds } from './features/games/balloons/rounds'
import type { Round } from './features/games/balloons/rounds'
import { Gallery } from './features/gallery/Gallery'
import { IntroScreen } from './features/intro/IntroScreen'
import { StartScreen } from './features/intro/StartScreen'
import { MapScreen } from './features/map/MapScreen'
import { ResultScreen } from './features/result/ResultScreen'
import { TraceScreen } from './features/trace/TraceScreen'
import {
  completedCount,
  emptyProgress,
  loadProgress,
  saveProgress,
  withStars,
} from './lib/progress'
import { loadMicEnabled, saveMicEnabled } from './lib/settings'

type Screen =
  | { name: 'start' }
  | { name: 'map' }
  | { name: 'lesson'; index: number; step: 'intro' | 'trace' }
  | { name: 'bonus'; index: number; rounds: Round[] }
  | { name: 'game'; rounds: Round[] }
  | { name: 'result'; stars: number; character: CharacterKind; after: 'map' | 'finish' }
  | { name: 'finish' }

const ORDER = alphabet.map((letter) => letter.lower)
const BONUS_ROUNDS = 4
const GAME_ROUNDS = 6

/** Geliştirme sırasında /?gallery adresi tüm harfleri ve karakterleri gösterir. */
const showGallery =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('gallery')

function characterFor(index: number): CharacterKind {
  return castByLetter[alphabet[index].lower] ?? 'chick'
}

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })
  const [progress, setProgress] = useState(() => loadProgress(ORDER))
  const [micEnabled, setMicEnabled] = useState(loadMicEnabled)

  const changeMic = useCallback((enabled: boolean) => {
    setMicEnabled(enabled)
    saveMicEnabled(enabled)
  }, [])

  const handleMicProblem = useCallback(() => changeMic(false), [changeMic])

  const lesson = screen.name === 'lesson' ? screen : null
  const lessonIndex = lesson?.index ?? 0
  const letter = alphabet[lessonIndex]

  const { newSyllables, newWords } = useMemo(() => {
    const learned = alphabet.slice(0, lessonIndex + 1)
    const previous = alphabet.slice(0, lessonIndex)
    return {
      newSyllables: spreadPick(getNewSyllables(previous, learned), MAX_SYLLABLES),
      newWords: pickWords(getWords(learned, words).filter((word) => word.includes(letter.lower))),
    }
  }, [lessonIndex, letter.lower])

  function completeLesson(index: number, stars: number) {
    const next = withStars(progress, alphabet[index].lower, stars)
    setProgress(next)
    saveProgress(next)
    const all = completedCount(next, ORDER) === alphabet.length
    setScreen({
      name: 'result',
      stars,
      character: characterFor(index),
      after: all ? 'finish' : 'map',
    })
  }

  function finishTrace(index: number) {
    const learned = alphabet.slice(0, index + 1)
    const rounds = buildRounds(buildPool(learned, words), BONUS_ROUNDS, Math.random)
    if (rounds.length === 0) completeLesson(index, 2)
    else setScreen({ name: 'bonus', index, rounds })
  }

  function openGame() {
    const learned = alphabet.slice(0, completedCount(progress, ORDER))
    const rounds = buildRounds(buildPool(learned, words), GAME_ROUNDS, Math.random)
    if (rounds.length > 0) setScreen({ name: 'game', rounds })
  }

  function finishGame({ firstTry, total }: GameResult) {
    const ratio = firstTry / total
    const stars = ratio >= 0.85 ? 3 : ratio >= 0.5 ? 2 : 1
    setScreen({ name: 'result', stars, character: 'chick', after: 'map' })
  }

  function resetProgress() {
    if (!window.confirm('Tüm ilerleme silinsin mi?')) return
    setProgress(emptyProgress)
    saveProgress(emptyProgress)
  }

  if (showGallery) return <Gallery />

  return (
    <>
      <Scene />
      <main className="app">
        {screen.name === 'start' && (
          <StartScreen
            micEnabled={micEnabled}
            onMicChange={changeMic}
            onStart={() => setScreen({ name: 'map' })}
          />
        )}

        {screen.name === 'map' && (
          <MapScreen
            progress={progress}
            onOpenLetter={(index) => setScreen({ name: 'lesson', index, step: 'intro' })}
            onOpenGame={openGame}
            onReset={resetProgress}
          />
        )}

        {lesson?.step === 'intro' && (
          <IntroScreen
            key={`intro-${letter.lower}`}
            letter={letter}
            character={characterFor(lessonIndex)}
            newSyllables={newSyllables}
            words={newWords}
            micEnabled={micEnabled}
            onMicProblem={handleMicProblem}
            onNext={() => setScreen({ name: 'lesson', index: lessonIndex, step: 'trace' })}
          />
        )}

        {lesson?.step === 'trace' && (
          <TraceScreen
            key={`trace-${letter.lower}`}
            letter={letter}
            character={characterFor(lessonIndex)}
            hasNext
            onNext={() => finishTrace(lessonIndex)}
          />
        )}

        {screen.name === 'bonus' && (
          <BalloonGame
            key={`bonus-${screen.index}`}
            rounds={screen.rounds}
            character={characterFor(screen.index)}
            onFinish={({ firstTry, total }) =>
              completeLesson(screen.index, firstTry / total >= 0.75 ? 3 : 2)
            }
            onExit={() => completeLesson(screen.index, 2)}
          />
        )}

        {screen.name === 'game' && (
          <BalloonGame
            rounds={screen.rounds}
            character="chick"
            onFinish={finishGame}
            onExit={() => setScreen({ name: 'map' })}
          />
        )}

        {screen.name === 'result' && (
          <ResultScreen
            stars={screen.stars}
            character={screen.character}
            onContinue={() =>
              setScreen(screen.after === 'finish' ? { name: 'finish' } : { name: 'map' })
            }
          />
        )}

        {screen.name === 'finish' && <FinishScreen onRestart={() => setScreen({ name: 'map' })} />}
      </main>
    </>
  )
}

export default App
