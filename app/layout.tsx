import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cupid's Adventure",
  description: "A Valentine's Day adventure game",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>{children}</body>
    </html>
  )
}



import './globals.css'