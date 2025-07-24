import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryStyles(color?: string) {
  if (!color) {
    return {
      backgroundColor: '#f1f5f9', // slate-100
      color: '#334155' // slate-700
    }
  }
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  const rgb = hexToRgb(color)
  if (!rgb) {
    return getCategoryStyles() // fallback
  }
  
  const bgColor = `rgb(${Math.min(rgb.r + 200, 255)}, ${Math.min(rgb.g + 200, 255)}, ${Math.min(rgb.b + 200, 255)})`
  const textColor = color
  
  return {
    backgroundColor: bgColor,
    color: textColor
  }
}
