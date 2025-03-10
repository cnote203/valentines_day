"use client"

import { useEffect, useRef, useState } from "react"
import { drawLevel, isColliding, isAtTarget } from "../utils/gameUtils"

interface GameCanvasProps {
  level: number
  onLevelComplete: () => void
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PLAYER_SIZE = 20
const MOVE_DISTANCE = 5

export default function GameCanvas({ level, onLevelComplete }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Set starting position near the red arrow
  const [playerPos, setPlayerPos] = useState({ x: 40, y: 40 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const newPos = { ...playerPos }

      switch (e.key) {
        case "ArrowUp":
          newPos.y -= MOVE_DISTANCE
          break
        case "ArrowDown":
          newPos.y += MOVE_DISTANCE
          break
        case "ArrowLeft":
          newPos.x -= MOVE_DISTANCE
          break
        case "ArrowRight":
          newPos.x += MOVE_DISTANCE
          break
      }

      // Prevent moving outside canvas bounds
      newPos.x = Math.max(PLAYER_SIZE, Math.min(newPos.x, CANVAS_WIDTH - PLAYER_SIZE))
      newPos.y = Math.max(PLAYER_SIZE, Math.min(newPos.y, CANVAS_HEIGHT - PLAYER_SIZE))

      if (!isColliding(newPos, level)) {
        setPlayerPos(newPos)
      }

      if (isAtTarget(newPos)) {
        onLevelComplete()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    const gameLoop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      drawLevel(ctx, level)

      // Draw player
      ctx.fillStyle = "red"
      ctx.fillRect(playerPos.x, playerPos.y, PLAYER_SIZE, PLAYER_SIZE)

      requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [level, onLevelComplete, playerPos])

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-pink-500 mx-auto"
      />
      <p className="mt-4 text-lg text-pink-800">Guide the red square to the green target using arrow keys!</p>
    </div>
  )
}

