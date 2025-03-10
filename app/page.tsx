"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import MainMenu from "./components/MainMenu"
import FindTheQueen from "./components/FindTheQueen"
import AvatarGame from "./components/AvatarGame"
import Connections from "./components/Connections"
import FinalScreen from "./components/FinalScreen"

const TOTAL_LEVELS = 3

export default function ValentinesGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [scaleFactor, setScaleFactor] = useState(1)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleLevelComplete = useCallback(() => {
    setCurrentLevel((prev) => {
      if (prev < TOTAL_LEVELS) {
        return prev + 1
      } else {
        setGameCompleted(true)
        return prev
      }
    })
  }, [])

  const handleSkipLevel = useCallback(() => {
    setCurrentLevel((prev) => {
      if (prev < TOTAL_LEVELS) {
        return prev + 1
      } else {
        setGameCompleted(true)
        return prev
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameStarted(false)
    setCurrentLevel(1)
    setGameCompleted(false)
  }, [])

  useEffect(() => {
    const calculateScale = () => {
      if (gameContainerRef.current) {
        const containerWidth = gameContainerRef.current.offsetWidth
        const containerHeight = gameContainerRef.current.offsetHeight
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const scaleX = windowWidth / containerWidth
        const scaleY = windowHeight / containerHeight
        const newScale = Math.min(scaleX, scaleY, 1) * 0.8 // 80% of the calculated scale
        setScaleFactor(newScale)
      }
    }

    calculateScale()
    window.addEventListener("resize", calculateScale)
    return () => window.removeEventListener("resize", calculateScale)
  }, [])

  if (!gameStarted) {
    return <MainMenu onStart={handleStart} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100 overflow-hidden">
      <div
        ref={gameContainerRef}
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: "center center",
        }}
      >
        {!gameCompleted ? (
          <div className="text-center">
            <h1 className="text-2xl font-normal mb-6 text-pink-600 tracking-wide">Cupid's Adventure</h1>
            <p className="mb-6 text-pink-800 text-sm tracking-wide">
              Level {currentLevel} of {TOTAL_LEVELS}
            </p>
            {currentLevel === 1 && <FindTheQueen onLevelComplete={handleLevelComplete} level={1} />}
            {currentLevel === 2 && <AvatarGame onLevelComplete={handleLevelComplete} level={2} />}
            {currentLevel === 3 && <Connections onLevelComplete={handleLevelComplete} level={3} />}
            <div className="mt-6 space-x-4">
              <Button onClick={handleSkipLevel} className="px-4 py-2 text-xs tracking-wide">
                Skip Level
              </Button>
              <Button onClick={resetGame} className="px-4 py-2 text-xs tracking-wide">
                Restart Game
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FinalScreen />
            <Button onClick={resetGame} className="mt-6 px-4 py-2 text-xs tracking-wide">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

