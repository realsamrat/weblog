import { JetBrains_Mono, Crimson_Text } from 'next/font/google'

// Current Google Fonts
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

export const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
})

// Note: Helvetica is loaded via CSS @font-face in globals.css
// This avoids Next.js path resolution issues with local fonts

// Font utility functions
export const getFontVariables = () => {
  return `${jetbrainsMono.variable} ${crimsonText.variable}`
}

// Font class helpers
export const fontClasses = {
  sans: 'font-helvetica',  // Uses Helvetica via CSS @font-face
  serif: 'font-serif',     // Crimson Text for headings
  mono: 'font-mono',       // JetBrains Mono for code
  helvetica: 'font-helvetica', // Explicit Helvetica class
} as const

// Type for font classes
export type FontClass = keyof typeof fontClasses 