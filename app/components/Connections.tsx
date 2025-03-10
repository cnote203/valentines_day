"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ConnectionsProps {
  onLevelComplete: () => void
  level: number
}

interface Word {
  id: number
  text: string
  category: string
}

const initialWords: Word[] = [
  { id: 1, text: "HADDOCK", category: "CHARACTERS FROM TINTIN" },
  { id: 2, text: "SNOWY", category: "CHARACTERS FROM TINTIN" },
  { id: 3, text: "THOMSON", category: "CHARACTERS FROM TINTIN" },
  { id: 4, text: "THOMPSON", category: "CHARACTERS FROM TINTIN" },
  { id: 5, text: "PAIN", category: "COUNTRIES MINUS FIRST LETTER" },
  { id: 6, text: "INLAND", category: "COUNTRIES MINUS FIRST LETTER" },
  { id: 7, text: "RAN", category: "COUNTRIES MINUS FIRST LETTER" },
  { id: 8, text: "HAD", category: "COUNTRIES MINUS FIRST LETTER" },
  { id: 9, text: "PAIR", category: "FRUIT HOMOPHONES" },
  { id: 10, text: "BURY", category: "FRUIT HOMOPHONES" },
  { id: 11, text: "PLUMB", category: "FRUIT HOMOPHONES" },
  { id: 12, text: "CURRENT", category: "FRUIT HOMOPHONES" },
  { id: 13, text: "BODY", category: "QUALITIES OF THICK HAIR" },
  { id: 14, text: "BOUNCE", category: "QUALITIES OF THICK HAIR" },
  { id: 15, text: "LIFT", category: "QUALITIES OF THICK HAIR" },
  { id: 16, text: "VOLUME", category: "QUALITIES OF THICK HAIR" },
]

const categoryColors: { [key: string]: string } = {
  "CHARACTERS FROM TINTIN": "bg-yellow-400",
  "COUNTRIES MINUS FIRST LETTER": "bg-purple-400",
  "FRUIT HOMOPHONES": "bg-blue-400",
  "QUALITIES OF THICK HAIR": "bg-green-400",
}

const shuffleArray = (array: Word[]): Word[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Connections({ onLevelComplete, level }: ConnectionsProps) {
  const [words, setWords] = useState<Word[]>([])
  const [selectedWords, setSelectedWords] = useState<Word[]>([])
  const [foundCategories, setFoundCategories] = useState<string[]>([])
  const [message, setMessage] = useState<string>("")
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setWords(shuffleArray(initialWords))
  }, [])

  const handleWordClick = (word: Word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w.id !== word.id))
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleSubmit = () => {
    if (selectedWords.length !== 4) {
      setMessage("Please select 4 words")
      return
    }

    const category = selectedWords[0].category
    const allSameCategory = selectedWords.every((word) => word.category === category)

    if (allSameCategory) {
      setFoundCategories([...foundCategories, category])
      setWords(words.filter((word) => !selectedWords.includes(word)))
      setMessage(`Correct! You found the ${category} category.`)
      setSelectedWords([])

      if (foundCategories.length === 3) {
        setMessage("Congratulations! You've found all categories. Claim your prize!")
      }
    } else {
      setMessage("Incorrect. Try again!")
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const getWordColor = (word: Word) => {
    if (foundCategories.includes(word.category)) {
      return categoryColors[word.category]
    }
    if (selectedWords.includes(word)) {
      return "bg-gray-300"
    }
    return "bg-gray-200"
  }

  const groupedWords = foundCategories.map((category) => initialWords.filter((word) => word.category === category))

  const remainingWords = words.filter((word) => !foundCategories.includes(word.category))

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Connections</h2>
      <p className="mb-4">Find groups of four words that share a common theme.</p>
      <div className="w-full mb-4">
        <AnimatePresence>
          {groupedWords.map((group, index) => (
            <motion.div
              key={group[0].category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`grid grid-cols-4 gap-2 mb-2 p-2 rounded ${categoryColors[group[0].category]}`}
            >
              {group.map((word) => (
                <div key={word.id} className="p-2 bg-white rounded text-center text-xs sm:text-sm">
                  {word.text}
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.div className="grid grid-cols-4 gap-2" animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}>
          {remainingWords.map((word) => (
            <motion.button
              key={word.id}
              onClick={() => handleWordClick(word)}
              className={`p-2 rounded ${getWordColor(word)} transition-colors duration-200 text-xs sm:text-sm`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {word.text}
            </motion.button>
          ))}
        </motion.div>
      </div>
      <Button onClick={handleSubmit} className="mb-2">
        Submit
      </Button>
      {message && <p className="text-center">{message}</p>}
      {foundCategories.length === 4 && (
        <Button onClick={onLevelComplete} className="mt-4 px-8 py-4 text-lg bg-pink-500 hover:bg-pink-600 text-white">
          Claim Your Prize!
        </Button>
      )}
    </div>
  )
}

