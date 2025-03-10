export const CANVAS_WIDTH = 700
export const CANVAS_HEIGHT = 525
export const APPA_WIDTH = 120
export const APPA_HEIGHT = 60
export const APPA_HITBOX_REDUCTION = 0.4 // Increased from 0.3
export const FIREBALL_WIDTH = 80 // Reduced from 90
export const FIREBALL_HEIGHT = 40 // Reduced from 45
export const GAME_DURATION = 30

export interface Position {
  x: number
  y: number
}

export interface Fireball extends Position {
  speed: number
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function isColliding(appaPos: Position, fireball: Fireball): boolean {
  // Calculate the reduced hitbox dimensions
  const hitboxWidth = APPA_WIDTH * (1 - APPA_HITBOX_REDUCTION)
  const hitboxHeight = APPA_HEIGHT * (1 - APPA_HITBOX_REDUCTION)

  // Calculate the offset to center the hitbox
  const offsetX = (APPA_WIDTH - hitboxWidth) / 2
  const offsetY = (APPA_HEIGHT - hitboxHeight) / 2

  // Check collision with the reduced hitbox
  return (
    appaPos.x + offsetX < fireball.x + FIREBALL_WIDTH &&
    appaPos.x + offsetX + hitboxWidth > fireball.x &&
    appaPos.y + offsetY < fireball.y + FIREBALL_HEIGHT &&
    appaPos.y + offsetY + hitboxHeight > fireball.y
  )
}

export function generateFireball(timeElapsed: number): Fireball {
  const baseSpeed = 7
  const speedIncrease = Math.min(timeElapsed / 5, 15)
  const speed = baseSpeed + speedIncrease

  return {
    x: CANVAS_WIDTH,
    y: Math.random() * (CANVAS_HEIGHT - FIREBALL_HEIGHT),
    speed,
  }
}

export const drawLevel = (ctx: CanvasRenderingContext2D, level: number) => {
  // Draw level-specific elements (e.g., walls, target)
  ctx.fillStyle = "black"
  if (level === 1) {
    // Example level 1 design
    ctx.fillRect(100, 100, 50, 300)
    ctx.fillRect(300, 100, 50, 300)
    ctx.fillRect(500, 100, 50, 300)
  } else if (level === 2) {
    // Example level 2 design
    ctx.fillRect(50, 50, 600, 50)
    ctx.fillRect(50, 450, 600, 50)
  } else if (level === 3) {
    ctx.fillRect(50, 50, 50, 500)
    ctx.fillRect(600, 50, 50, 500)
    ctx.fillRect(50, 50, 600, 50)
    ctx.fillRect(50, 500, 600, 50)
  }

  // Draw target
  ctx.fillStyle = "green"
  ctx.fillRect(650, 275, 50, 50)
}

export const isAtTarget = (playerPos: Position): boolean => {
  const targetX = 650
  const targetY = 275
  const targetSize = 50
  const playerSize = 20

  return (
    playerPos.x > targetX &&
    playerPos.x + playerSize < targetX + targetSize &&
    playerPos.y > targetY &&
    playerPos.y + playerSize < targetY + targetSize
  )
}

