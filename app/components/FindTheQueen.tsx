"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import LevelCompleteModal from "./LevelCompleteModal"

interface FindTheQueenProps {
  onLevelComplete: () => void
  level: number
}

interface CardPosition {
  x: number
  y: number
}

export default function FindTheQueen({ onLevelComplete, level }: FindTheQueenProps) {
  const [cards, setCards] = useState(["Q", "A", "A"])
  const [isShuffling, setIsShuffling] = useState(false)
  const [stage, setStage] = useState(1)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [positions, setPositions] = useState<CardPosition[]>([
    { x: -220, y: 0 },
    { x: 0, y: 0 },
    { x: 220, y: 0 },
  ])
  const [showBack, setShowBack] = useState(false) // Boolean to toggle between front and back images
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const shuffleRef = useRef<NodeJS.Timeout[]>([])

  const getShuffleSpeed = () => {
    switch (stage) {
      case 1:
        return 1000
      case 2:
        return 700
      case 3:
        return 400
      default:
        return 1000
    }
  }

  const createShuffleAnimation = () => {
    const moves = 15
    const speed = getShuffleSpeed()

    // Show the back of the cards
    setShowBack(true)
    console.log("Cards switched to back side")

    // Start shuffling after cards are switched
    setTimeout(() => {
      for (let i = 0; i < moves; i++) {
        shuffleRef.current.push(
          setTimeout(() => {
            setPositions((prev) => {
              const newPositions = [...prev]
              // Randomly select two adjacent cards to swap
              const idx1 = Math.floor(Math.random() * 2)
              const idx2 = idx1 + 1

              // Swap positions laterally
              const temp = newPositions[idx1]
              newPositions[idx1] = newPositions[idx2]
              newPositions[idx2] = temp

              // Update cards array to match position changes
              const newCards = [...cards]
              ;[newCards[idx1], newCards[idx2]] = [newCards[idx2], newCards[idx1]]
              setCards(newCards)

              return newPositions
            })
          }, i * speed),
        )
      }

      shuffleRef.current.push(
        setTimeout(() => {
          setIsShuffling(false)
          console.log("Shuffling complete")
        }, moves * speed),
      )
    }, 500)
  }

  const startShuffle = () => {
    console.log("Start shuffle")
    setIsShuffling(true)
    setSelectedCard(null)
    setShowResult(false)
    createShuffleAnimation()
  }

  const handleCardClick = (index: number) => {
    if (isShuffling) return

    // Show the front of the selected card
    setSelectedCard(index)
    setShowResult(true)
    console.log(`Card ${index} clicked`)

    if (cards[index] === "Q") {
      if (stage < 3) {
        setTimeout(() => {
          setStage((prevStage) => prevStage + 1)
          setSelectedCard(null)
          setShowResult(false)
          setPositions([
            { x: -220, y: 0 },
            { x: 0, y: 0 },
            { x: 220, y: 0 },
          ])
          setShowBack(false)
        }, 2000)
      } else {
        setTimeout(() => {
          setShowCompleteModal(true)
        }, 1000)
      }
    } else {
      // If wrong card, allow another selection after a short delay
      setTimeout(() => {
        setSelectedCard(null)
        setShowResult(false)
      }, 1000)
    }
  }

  useEffect(() => {
    // Clean up timeouts
    return () => {
      shuffleRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Find the Queen - Stage {stage}</h2>
      <div className="relative h-[350px] w-[525px] mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 w-[200px] h-[300px] cursor-pointer transition-all duration-500"
            style={{
              transform: `
                translate(-50%, -50%)
                translateX(${positions[index].x}px)
                translateY(${positions[index].y}px)
              `,
            }}
            onClick={() => handleCardClick(index)}
          >
            <div className="relative w-full h-full">
              {showBack && selectedCard !== index ? (
                // Back of card
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-back2-yIUhhEvr0mFZPi82VJiaafXjivznSO.png"
                  alt="Card Back"
                  className="w-full h-full object-contain"
                />
              ) : (
                // Front of card (Queen or Ace)
                <img
                  src={
                    card === "Q"
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-diamonds-12-QRrNlOzsFZPhtc1XjHkUIIT1vvwOv4.png"
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-clubs-1-hq6OJKLGQyhQN3ENAgZZcHeu4jXrU5.png"
                  }
                  alt={card === "Q" ? "Queen of Diamonds" : "Ace of Clubs"}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {!isShuffling && !showBack && (
        <Button onClick={startShuffle} className="mt-4 px-8 py-4 text-lg">
          {stage === 1 ? "Ready" : "Shuffle"}
        </Button>
      )}
      {showResult && (
        <p className="text-xl mt-4">
          {cards[selectedCard!] === "Q"
            ? stage < 3
              ? "Correct! Next stage..."
              : "You won!"
            : "Wrong card. Try again!"}
        </p>
      )}
      {showCompleteModal && <LevelCompleteModal levelNumber={level} onNext={onLevelComplete} />}
    </div>
  )
}

