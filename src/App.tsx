import { useState } from 'react'
import { alphabet } from './data/alphabet'
import { words } from './data/words'
import { getNewSyllables, getWords } from './features/curriculum/content'
import { IntroScreen } from './features/intro/IntroScreen'

function App() {
  const [index, setIndex] = useState(0)

  const letter = alphabet[index]
  const learned = alphabet.slice(0, index + 1)
  const previous = alphabet.slice(0, index)

  const newSyllables = getNewSyllables(previous, learned)
  const newWords = getWords(learned, words).filter((word) => word.includes(letter.lower))

  return (
    <main className="app">
      <IntroScreen
        key={letter.lower}
        letter={letter}
        newSyllables={newSyllables}
        words={newWords}
        hasNext={index < alphabet.length - 1}
        onNext={() => setIndex(index + 1)}
      />
    </main>
  )
}

export default App
