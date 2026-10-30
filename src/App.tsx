import { useMemo, useState } from 'react'
import { Scene } from './components/Scene'
import { alphabet } from './data/alphabet'
import { castByLetter } from './data/cast'
import { words } from './data/words'
import { getNewSyllables, getWords } from './features/curriculum/content'
import { IntroScreen } from './features/intro/IntroScreen'
import { StartScreen } from './features/intro/StartScreen'

function App() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)

  const letter = alphabet[index]

  const { newSyllables, newWords } = useMemo(() => {
    const learned = alphabet.slice(0, index + 1)
    const previous = alphabet.slice(0, index)
    return {
      newSyllables: getNewSyllables(previous, learned),
      newWords: getWords(learned, words).filter((word) => word.includes(letter.lower)),
    }
  }, [index, letter.lower])

  return (
    <>
      <Scene />
      <main className="app">
        {started ? (
          <IntroScreen
            key={letter.lower}
            letter={letter}
            character={castByLetter[letter.lower] ?? 'chick'}
            newSyllables={newSyllables}
            words={newWords}
            hasNext={index < alphabet.length - 1}
            onNext={() => setIndex(index + 1)}
          />
        ) : (
          <StartScreen onStart={() => setStarted(true)} />
        )}
      </main>
    </>
  )
}

export default App
