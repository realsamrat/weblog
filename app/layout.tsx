import type React from "react"
import type { Metadata } from "next"
import { getFontVariables } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Weblog - AI, Programming & Security",
  description: "A personal technology blog focused on AI, programming, and security",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json'
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
