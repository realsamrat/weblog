import type React from "react"
import type { Metadata } from "next"
import { getFontVariables } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Weblog - AI, Programming & Security",
  description: "A personal technology blog focused on AI, programming, and security",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={getFontVariables()} suppressHydrationWarning={true}>
      <body className="font-helvetica bg-white text-gray-900 antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
