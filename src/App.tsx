import { useMemo, useState } from 'react'
import { Scene } from './components/Scene'
import { alphabet } from './data/alphabet'
import { castByLetter } from './data/cast'
import { words } from './data/words'
import { getNewSyllables, getWords } from './features/curriculum/content'
import { IntroScreen } from './features/intro/IntroScreen'
import { StartScreen } from './features/intro/StartScreen'
import { TraceScreen } from './features/trace/TraceScreen'

type Step = 'intro' | 'trace'

function App() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState<Step>('intro')

  const letter = alphabet[index]
  const character = castByLetter[letter.lower] ?? 'chick'

  const { newSyllables, newWords } = useMemo(() => {
    const learned = alphabet.slice(0, index + 1)
    const previous = alphabet.slice(0, index)
    return {
      newSyllables: getNewSyllables(previous, learned),
      newWords: getWords(learned, words).filter((word) => word.includes(letter.lower)),
    }
  }, [index, letter.lower])

  function goToNextLetter() {
    setIndex(index + 1)
    setStep('intro')
  }

  return (
    <>
      <Scene />
      <main className="app">
        {!started && <StartScreen onStart={() => setStarted(true)} />}
        {started && step === 'intro' && (
          <IntroScreen
            key={`intro-${letter.lower}`}
            letter={letter}
            character={character}
            newSyllables={newSyllables}
            words={newWords}
            hasNext
            onNext={() => setStep('trace')}
          />
        )}
        {started && step === 'trace' && (
          <TraceScreen
            key={`trace-${letter.lower}`}
            letter={letter}
            character={character}
            hasNext={index < alphabet.length - 1}
            onNext={goToNextLetter}
          />
        )}
      </main>
    </>
  )
}

export default App
