"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const BASKET_WIDTH = 100
const BASKET_HEIGHT = 50
const HEART_SIZE_MIN = 20
const HEART_SIZE_MAX = 40
const GAME_DURATION = 30
const SCORE_TO_WIN = 500

interface Heart {
  x: number
  y: number
  size: number
  speed: number
  points: number
}

interface HeartCatcherProps {
  onLevelComplete: () => void
}

export default function HeartCatcher({ onLevelComplete }: HeartCatcherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)

  const gameStateRef = useRef({
    basketX: CANVAS_WIDTH / 2 - BASKET_WIDTH / 2,
    hearts: [] as Heart[],
    lastHeartTime: 0,
  })

  const handleLevelComplete = useCallback(() => {
    setGameOver(true)
    if (score >= SCORE_TO_WIN) {
      onLevelComplete()
    }
  }, [score, onLevelComplete])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = performance.now()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      gameStateRef.current.basketX = Math.max(0, Math.min(x - BASKET_WIDTH / 2, CANVAS_WIDTH - BASKET_WIDTH))
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // Update time left
      setTimeLeft((prev) => {
        const newTime = prev - deltaTime
        if (newTime <= 0) {
          handleLevelComplete()
          return 0
        }
        return newTime
      })

      // Generate new heart
      if (currentTime - gameStateRef.current.lastHeartTime > 500) {
        const size = Math.random() * (HEART_SIZE_MAX - HEART_SIZE_MIN) + HEART_SIZE_MIN
        const newHeart: Heart = {
          x: Math.random() * (CANVAS_WIDTH - size),
          y: -size,
          size,
          speed: Math.random() * 3 + 1,
          points: Math.random() < 0.2 ? 50 : 10, // 20% chance for bonus heart
        }
        gameStateRef.current.hearts.push(newHeart)
        gameStateRef.current.lastHeartTime = currentTime
      }

      // Update hearts
      gameStateRef.current.hearts = gameStateRef.current.hearts.filter((heart) => {
        heart.y += heart.speed

        // Check if caught
        if (
          heart.y + heart.size > CANVAS_HEIGHT - BASKET_HEIGHT &&
          heart.x + heart.size > gameStateRef.current.basketX &&
          heart.x < gameStateRef.current.basketX + BASKET_WIDTH
        ) {
          setScore((prev) => prev + heart.points)
          return false
        }

        return heart.y < CANVAS_HEIGHT
      })

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw basket
      ctx.fillStyle = "brown"
      ctx.fillRect(gameStateRef.current.basketX, CANVAS_HEIGHT - BASKET_HEIGHT, BASKET_WIDTH, BASKET_HEIGHT)

      // Draw hearts
      gameStateRef.current.hearts.forEach((heart) => {
        ctx.fillStyle = heart.points === 50 ? "gold" : "red"
        ctx.beginPath()
        ctx.moveTo(heart.x + heart.size / 2, heart.y + heart.size / 4)
        ctx.bezierCurveTo(
          heart.x + heart.size / 2,
          heart.y,
          heart.x + heart.size,
          heart.y,
          heart.x + heart.size,
          heart.y + heart.size / 4,
        )
        ctx.bezierCurveTo(
          heart.x + heart.size,
          heart.y + heart.size / 2,
          heart.x + heart.size / 2,
          heart.y + (heart.size * 3) / 4,
          heart.x + heart.size / 2,
          heart.y + heart.size,
        )
        ctx.bezierCurveTo(
          heart.x + heart.size / 2,
          heart.y + (heart.size * 3) / 4,
          heart.x,
          heart.y + heart.size / 2,
          heart.x,
          heart.y + heart.size / 4,
        )
        ctx.bezierCurveTo(
          heart.x,
          heart.y,
          heart.x + heart.size / 2,
          heart.y,
          heart.x + heart.size / 2,
          heart.y + heart.size / 4,
        )
        ctx.fill()
      })

      // Draw score and timer
      ctx.fillStyle = "black"
      ctx.font = "24px Arial"
      ctx.fillText(`Score: ${score}`, 10, 30)
      ctx.fillText(`Time: ${Math.ceil(timeLeft)}s`, CANVAS_WIDTH - 120, 30)

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop)
      }
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, gameOver, handleLevelComplete, score, timeLeft])

  const handleStart = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setTimeLeft(GAME_DURATION)
    gameStateRef.current = {
      basketX: CANVAS_WIDTH / 2 - BASKET_WIDTH / 2,
      hearts: [],
      lastHeartTime: 0,
    }
  }

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-pink-500 mx-auto bg-pink-100"
      />
      {!gameStarted || gameOver ? (
        <div className="mt-4">
          <Button onClick={handleStart} className="px-8 py-4 text-lg">
            {gameOver ? "Try Again" : "Start Game"}
          </Button>
          {gameOver && (
            <p className="text-xl mt-4 text-pink-800">
              {score >= SCORE_TO_WIN
                ? `Congratulations! You won with a score of ${score}!`
                : `Game Over! Your score: ${score}. Try to reach ${SCORE_TO_WIN} to win!`}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-lg text-pink-800">Move the mouse to control the basket and catch falling hearts!</p>
      )}
    </div>
  )
}

