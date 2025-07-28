'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-white" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-white" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}