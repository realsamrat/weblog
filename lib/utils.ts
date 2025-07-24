import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substr(0, 2), 16)
  const g = parseInt(cleanHex.substr(2, 2), 16)
  const b = parseInt(cleanHex.substr(4, 2), 16)
  return { r, g, b }
}

function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastColor(backgroundColor: string) {
  const { r, g, b } = hexToRgb(backgroundColor)
  const luminance = getLuminance(r, g, b)
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function getCategoryStyles(color?: string) {
  if (!color) {
    return {
      backgroundColor: '#f1f5f9', // slate-100
      color: '#334155' // slate-700
    }
  }

  const textColor = getContrastColor(color)

  return {
    backgroundColor: color,
    color: textColor
  }
}
