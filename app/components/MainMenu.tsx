"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MainMenuProps {
  onStart: () => void
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center relative p-4">
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="mb-10"
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixel-heart-2779422_1280-Q4PY8sNKG8NPMKPB31K2hoHi3Gysph.png"
          alt="Pixel Heart"
          width={100}
          height={100}
          className="w-24 h-24 object-contain"
        />
      </motion.div>

      <h1 className="text-3xl font-normal text-pink-600 mb-8 tracking-wide">Cupid's Adventure</h1>

      <p className="text-center max-w-md mb-10 text-pink-800 text-sm leading-relaxed">
        Welcome, Traveller, to Cupid's adventure. What lies ahead are mini games that you must conquer in search
        of a great prize. Are you ready?
      </p>

      <Button onClick={onStart} className="px-8 py-6 text-sm bg-pink-500 hover:bg-pink-600 text-white tracking-wide">
        I'm ready
      </Button>

      <div className="absolute bottom-4 right-4 text-pink-600 text-xs">Made by Chris Accad</div>
    </div>
  )
}

