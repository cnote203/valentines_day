"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import LevelCompleteModal from "./LevelCompleteModal"
import {
  loadImage,
  isColliding,
  generateFireball,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  APPA_WIDTH,
  APPA_HEIGHT,
  FIREBALL_WIDTH,
  FIREBALL_HEIGHT,
  GAME_DURATION,
  type Fireball,
} from "../utils/gameUtils"

interface AvatarGameProps {
  onLevelComplete: () => void
  level: number
}

export default function AvatarGame({ onLevelComplete, level }: AvatarGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [isLevelCompleted, setIsLevelCompleted] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const gameStateRef = useRef({
    appaPos: {
      x: 50,
      y: CANVAS_HEIGHT / 2 - APPA_HEIGHT / 2,
    },
    fireballs: [] as Fireball[],
    appaImage: null as HTMLImageElement | null,
    fireballImage: null as HTMLImageElement | null,
    lastFireballTime: 0,
    timeElapsed: 0,
    keysPressed: {} as { [key: string]: boolean },
  })

  const handleLevelComplete = useCallback(() => {
    setIsLevelCompleted(true)
    setGameOver(true)
    setShowCompleteModal(true)
  }, [])

  const handleNextLevel = useCallback(() => {
    setShowCompleteModal(false)
    onLevelComplete()
  }, [onLevelComplete])

  useEffect(() => {
    if (isLevelCompleted && timeLeft <= 0) {
      handleLevelComplete()
    }
  }, [isLevelCompleted, timeLeft, handleLevelComplete])

  useEffect(() => {
    // Load all images
    Promise.all([
      loadImage("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Appa-ujKL3woTypzMwhgSFrPZK8iCo6Tj1w.png"),
      loadImage("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fireball-9S01heFCvZjXZwyZMmJpIOu9vC5QYh.png"),
      loadImage("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uIOdJluYSqhfz8qZe5Jadp0eLFkxa0.png"),
    ]).then(([appaImg, fireballImg, bgImg]) => {
      gameStateRef.current.appaImage = appaImg
      gameStateRef.current.fireballImage = fireballImg
      setBackgroundImage(bgImg)
    })

    // Prevent arrow key scrolling and handle key events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault()
        gameStateRef.current.keysPressed[e.code] = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        gameStateRef.current.keysPressed[e.code] = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = performance.now()

    const updateAppaPosition = () => {
      const moveDistance = 10
      const newPos = { ...gameStateRef.current.appaPos }

      if (gameStateRef.current.keysPressed["ArrowUp"]) {
        newPos.y = Math.max(0, newPos.y - moveDistance)
      }
      if (gameStateRef.current.keysPressed["ArrowDown"]) {
        newPos.y = Math.min(CANVAS_HEIGHT - APPA_HEIGHT, newPos.y + moveDistance)
      }

      gameStateRef.current.appaPos = newPos
    }

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      gameStateRef.current.timeElapsed += deltaTime

      // Update time left
      setTimeLeft((prev) => {
        const newTime = prev - deltaTime
        if (newTime <= 0) {
          setIsLevelCompleted(true)
          return 0
        }
        return newTime
      })

      // Update Appa's position
      updateAppaPosition()

      // Generate new fireball
      if (currentTime - gameStateRef.current.lastFireballTime > 500) {
        gameStateRef.current.fireballs.push(generateFireball(gameStateRef.current.timeElapsed))
        gameStateRef.current.lastFireballTime = currentTime
      }

      // Update fireballs
      gameStateRef.current.fireballs = gameStateRef.current.fireballs
        .filter((fireball) => fireball.x + FIREBALL_WIDTH > 0)
        .map((fireball) => ({
          ...fireball,
          x: fireball.x - fireball.speed,
        }))

      // Check collisions
      if (gameStateRef.current.fireballs.some((fireball) => isColliding(gameStateRef.current.appaPos, fireball))) {
        setGameOver(true)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw background
      if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }

      // Draw Appa
      if (gameStateRef.current.appaImage) {
        ctx.drawImage(
          gameStateRef.current.appaImage,
          gameStateRef.current.appaPos.x,
          gameStateRef.current.appaPos.y,
          APPA_WIDTH,
          APPA_HEIGHT,
        )
      }

      // Draw fireballs
      if (gameStateRef.current.fireballImage) {
        gameStateRef.current.fireballs.forEach((fireball) => {
          ctx.drawImage(gameStateRef.current.fireballImage, fireball.x, fireball.y, FIREBALL_WIDTH, FIREBALL_HEIGHT)
        })
      }

      // Draw timer
      ctx.fillStyle = "white"
      ctx.font = "24px 'Press Start 2P'"
      ctx.fillText(`Time: ${Math.ceil(timeLeft)}s`, 10, 30)

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop)
      }
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, gameOver, timeLeft, backgroundImage])

  const handleStart = () => {
    setGameStarted(true)
    setGameOver(false)
    setIsLevelCompleted(false)
    setShowCompleteModal(false)
    setTimeLeft(GAME_DURATION)
    gameStateRef.current = {
      ...gameStateRef.current,
      appaPos: {
        x: 50,
        y: CANVAS_HEIGHT / 2 - APPA_HEIGHT / 2,
      },
      fireballs: [],
      lastFireballTime: 0,
      timeElapsed: 0,
      keysPressed: {},
    }
  }

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-pink-500 mx-auto"
      />
      {!gameStarted || gameOver ? (
        <div className="mt-4">
          <Button onClick={handleStart} className="px-8 py-4 text-lg">
            {gameOver ? "Try Again" : "Start Game"}
          </Button>
          {gameOver && timeLeft > 0 && !isLevelCompleted && (
            <p className="text-xl mt-4 text-red-500">Game Over! Appa got hit by a fireball!</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-lg text-pink-800">Use Up/Down arrow keys to help Appa dodge the fireballs!</p>
      )}
      {showCompleteModal && <LevelCompleteModal levelNumber={level} onNext={handleNextLevel} />}
    </div>
  )
}

