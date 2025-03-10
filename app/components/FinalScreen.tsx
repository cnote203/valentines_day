"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function FinalScreen() {
  const [response, setResponse] = useState<string | null>(null)

  const handleResponse = (answer: "yes" | "no") => {
    setResponse(answer === "yes" ? "You've made me so happy ❤️" : " I'll drop your stuff off at 4 💔")
  }

  const cupids = [
    { id: 0, x: -150, y: -150 }, // Top-left
    { id: 1, x: 0, y: -150 }, // Top-middle
    { id: 2, x: 150, y: -150 }, // Top-right
    { id: 3, x: -150, y: 150 }, // Bottom-left

    { id: 5, x: 150, y: 150 }, // Bottom-right
  ]

  return (
    <div className="text-center relative min-h-[600px] flex flex-col items-center justify-center">
      {/* Dancing Cupids */}
      {cupids.map((cupid) => (
        <motion.div
          key={cupid.id}
          className="absolute"
          style={{
            top: cupid.y < 0 ? "10%" : "90%",
            left: `${cupid.x === 0 ? "50%" : cupid.x < 0 ? "10%" : "90%"}`,
            transform: `translate(${cupid.x === 0 ? "-50%" : cupid.x < 0 ? "-50%" : "-50%"}, -50%)`,
          }}
          animate={{
            x: [0, cupid.x === 0 ? 0 : cupid.x / 2, 0],
            y: [0, cupid.y / 2, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <div className="relative w-24 h-24">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cupid-b6HZAC3JUeledJaYkq3tLJ1Zlct6Gr.png"
              alt="Dancing Cupid"
              width={96}
              height={96}
              className="pointer-events-none"
            />
            <motion.div
              className="absolute -top-2 -right-2 text-2xl"
              animate={{
                y: [-4, 0, -4],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: cupid.id * 0.3,
              }}
            >
              ❤️
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <h1 className="text-2xl font-normal mb-8 text-black tracking-wide z-10">
        &lt;placeholder&gt;, Will you do me the honour this February 14th and be my Valentine?
      </h1>
      {response ? (
        <p className="text-xl mb-6 text-black tracking-wide z-10">{response}</p>
      ) : (
        <div className="space-x-4 z-10">
          <Button
            onClick={() => handleResponse("yes")}
            className="bg-green-500 hover:bg-green-600 text-white text-xs tracking-wide px-6 py-4"
          >
            Yes!
          </Button>
          <Button
            onClick={() => handleResponse("no")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs tracking-wide px-6 py-4"
          >
            No
          </Button>
        </div>
      )}
    </div>
  )
}

