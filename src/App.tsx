import { useCallback, useMemo, useState } from 'react'
import { Scene } from './components/Scene'
import type { CharacterKind } from './components/characters/types'
import { alphabet } from './data/alphabet'
import { castByLetter } from './data/cast'
import { pickSticker, stickers } from './data/stickers'
import type { Sticker } from './data/stickers'
import { words } from './data/words'
import { AlbumScreen } from './features/album/AlbumScreen'
import {
  MAX_SYLLABLES,
  getNewSyllables,
  getWords,
  pickWords,
  spreadPick,
} from './features/curriculum/content'
import { FinishScreen } from './features/finish/FinishScreen'
import { Gallery } from './features/gallery/Gallery'
import { BalloonGame } from './features/games/balloons/BalloonGame'
import type { GameResult } from './features/games/balloons/BalloonGame'
import { buildPool, buildRounds } from './features/games/balloons/rounds'
import type { Round } from './features/games/balloons/rounds'
import { MemoryGame } from './features/games/memory/MemoryGame'
import { dealCards, pickLetters } from './features/games/memory/memory'
import type { Card } from './features/games/memory/memory'
import { PaintGame } from './features/games/paint/PaintGame'
import { PaintMenu } from './features/games/paint/PaintMenu'
import { buildPaintSetup } from './features/games/paint/paint'
import type { PaintSetup } from './features/games/paint/paint'
import { pictures } from './features/games/paint/pictures'
import { RACE_LENGTH } from './features/games/race/race'
import { RaceGame } from './features/games/race/RaceGame'
import { IntroScreen } from './features/intro/IntroScreen'
import { StartScreen } from './features/intro/StartScreen'
import { MapScreen } from './features/map/MapScreen'
import { ParkScreen } from './features/park/ParkScreen'
import type { GameId } from './features/park/ParkScreen'
import { ResultScreen } from './features/result/ResultScreen'
import { TraceScreen } from './features/trace/TraceScreen'
import {
  completedCount,
  emptyProgress,
  loadProgress,
  saveProgress,
  withStars,
  withSticker,
} from './lib/progress'
import { loadMicEnabled, saveMicEnabled } from './lib/settings'

type After = 'map' | 'park' | 'finish'

type Screen =
  | { name: 'start' }
  | { name: 'map' }
  | { name: 'park' }
  | { name: 'album' }
  | { name: 'lesson'; index: number; step: 'intro' | 'trace' }
  | { name: 'bonus'; index: number; rounds: Round[] }
  | { name: 'balloons'; rounds: Round[] }
  | { name: 'race'; rounds: Round[] }
  | { name: 'paintMenu' }
  | { name: 'paint'; setup: PaintSetup }
  | { name: 'memory'; cards: Card[] }
  | { name: 'result'; stars: number; character: CharacterKind; after: After; sticker?: Sticker }
  | { name: 'finish' }

const ORDER = alphabet.map((letter) => letter.lower)
const STICKER_IDS = stickers.map((sticker) => sticker.id)
const BONUS_ROUNDS = 4
const GAME_ROUNDS = 6
const MEMORY_PAIRS = 6
/** Oyunlarda çıkartma kazanmak için gereken en az yıldız */
const STICKER_MIN_STARS = 2

/** Geliştirme sırasında /?gallery adresi tüm harfleri ve karakterleri gösterir. */
const showGallery =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('gallery')

function characterFor(index: number): CharacterKind {
  return castByLetter[alphabet[index].lower] ?? 'chick'
}

function screenAfter(after: After): Screen {
  if (after === 'finish') return { name: 'finish' }
  return after === 'park' ? { name: 'park' } : { name: 'map' }
}

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })
  const [progress, setProgress] = useState(() => loadProgress(ORDER, STICKER_IDS))
  const [micEnabled, setMicEnabled] = useState(loadMicEnabled)

  const changeMic = useCallback((enabled: boolean) => {
    setMicEnabled(enabled)
    saveMicEnabled(enabled)
  }, [])

  const handleMicProblem = useCallback(() => changeMic(false), [changeMic])

  const learned = useMemo(() => alphabet.slice(0, completedCount(progress, ORDER)), [progress])
  const pool = useMemo(() => buildPool(learned, words), [learned])

  const lesson = screen.name === 'lesson' ? screen : null
  const lessonIndex = lesson?.index ?? 0
  const letter = alphabet[lessonIndex]

  const { newSyllables, newWords } = useMemo(() => {
    const known = alphabet.slice(0, lessonIndex + 1)
    const previous = alphabet.slice(0, lessonIndex)
    return {
      newSyllables: spreadPick(getNewSyllables(previous, known), MAX_SYLLABLES),
      newWords: pickWords(getWords(known, words).filter((word) => word.includes(letter.lower))),
    }
  }, [lessonIndex, letter.lower])

  function save(next: typeof progress) {
    setProgress(next)
    saveProgress(next)
  }

  function completeLesson(index: number, stars: number) {
    const next = withStars(progress, alphabet[index].lower, stars)
    save(next)
    const all = completedCount(next, ORDER) === alphabet.length
    setScreen({
      name: 'result',
      stars,
      character: characterFor(index),
      after: all ? 'finish' : 'map',
    })
  }

  function finishTrace(index: number) {
    const known = alphabet.slice(0, index + 1)
    const rounds = buildRounds(buildPool(known, words), BONUS_ROUNDS, Math.random)
    if (rounds.length === 0) completeLesson(index, 2)
    else setScreen({ name: 'bonus', index, rounds })
  }

  /** Oyun bitince yıldız gösterir; yeterince başarılıysa yeni bir çıkartma verir. */
  function giveReward(stars: number, character: CharacterKind) {
    let sticker: Sticker | undefined
    if (stars >= STICKER_MIN_STARS) {
      const picked = pickSticker(progress.stickers, Math.random)
      if (picked) {
        save(withSticker(progress, picked.id))
        sticker = picked
      }
    }
    setScreen({ name: 'result', stars, character, after: 'park', sticker })
  }

  function openGame(game: GameId) {
    if (game === 'balloons') {
      const rounds = buildRounds(pool, GAME_ROUNDS, Math.random)
      if (rounds.length > 0) setScreen({ name: 'balloons', rounds })
    } else if (game === 'race') {
      const rounds = buildRounds(pool, RACE_LENGTH, Math.random, 3)
      if (rounds.length > 0) setScreen({ name: 'race', rounds })
    } else if (game === 'paint') {
      setScreen({ name: 'paintMenu' })
    } else {
      const cards = dealCards(pickLetters(learned, MEMORY_PAIRS, Math.random), Math.random)
      setScreen({ name: 'memory', cards })
    }
  }

  function startPaint(pictureId: string) {
    const picture = pictures.find((item) => item.id === pictureId)
    if (!picture) return
    const setup = buildPaintSetup(picture, pool, Math.random)
    if (setup) setScreen({ name: 'paint', setup })
  }

  function finishBalloons({ firstTry, total }: GameResult) {
    const ratio = firstTry / total
    giveReward(ratio >= 0.85 ? 3 : ratio >= 0.5 ? 2 : 1, 'chick')
  }

  function resetProgress() {
    if (!window.confirm('Tüm ilerleme ve çıkartmalar silinsin mi?')) return
    save(emptyProgress)
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
            onOpenPark={() => setScreen({ name: 'park' })}
            onReset={resetProgress}
          />
        )}

        {screen.name === 'park' && (
          <ParkScreen
            learnedCount={learned.length}
            stickerCount={progress.stickers.length}
            totalStickers={stickers.length}
            onPlay={openGame}
            onAlbum={() => setScreen({ name: 'album' })}
            onBack={() => setScreen({ name: 'map' })}
          />
        )}

        {screen.name === 'album' && (
          <AlbumScreen owned={progress.stickers} onBack={() => setScreen({ name: 'park' })} />
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

        {screen.name === 'balloons' && (
          <BalloonGame
            rounds={screen.rounds}
            character="chick"
            onFinish={finishBalloons}
            onExit={() => setScreen({ name: 'park' })}
          />
        )}

        {screen.name === 'race' && (
          <RaceGame
            rounds={screen.rounds}
            player="chick"
            rival="cat"
            onFinish={(stars) => giveReward(stars, 'chick')}
            onExit={() => setScreen({ name: 'park' })}
          />
        )}

        {screen.name === 'paintMenu' && (
          <PaintMenu pool={pool} onPick={startPaint} onBack={() => setScreen({ name: 'park' })} />
        )}

        {screen.name === 'paint' && (
          <PaintGame
            setup={screen.setup}
            character="bunny"
            onFinish={(stars) => giveReward(stars, 'bunny')}
            onExit={() => setScreen({ name: 'paintMenu' })}
          />
        )}

        {screen.name === 'memory' && (
          <MemoryGame
            cards={screen.cards}
            character="girl"
            onFinish={(stars) => giveReward(stars, 'girl')}
            onExit={() => setScreen({ name: 'park' })}
          />
        )}

        {screen.name === 'result' && (
          <ResultScreen
            stars={screen.stars}
            character={screen.character}
            sticker={screen.sticker}
            onContinue={() => setScreen(screenAfter(screen.after))}
          />
        )}

        {screen.name === 'finish' && <FinishScreen onRestart={() => setScreen({ name: 'map' })} />}
      </main>
    </>
  )
}

export default App
