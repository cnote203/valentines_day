"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface LevelCompleteModalProps {
  levelNumber: number
  onNext: () => void
}

export default function LevelCompleteModal({ levelNumber, onNext }: LevelCompleteModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="bg-pink-100 p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
        >
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl text-pink-600 mb-4">Level {levelNumber} Complete!</h2>
            <p className="mb-6 text-pink-800">Congratulations! Are you ready for the next challenge?</p>
            <Button onClick={onNext} className="px-8 py-4 text-sm bg-pink-500 hover:bg-pink-600 text-white">
              Let's Go!
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

