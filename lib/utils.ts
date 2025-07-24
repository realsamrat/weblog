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

export function getContrastColor(backgroundColor: string) {
  const { r, g, b } = hexToRgb(backgroundColor)
  const luminance = getLuminance(r, g, b)
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function generatePastelColor(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const hue = Math.abs(hash) % 360
  const saturation = 40 + (Math.abs(hash) % 20) // 40-60%
  const lightness = 70 + (Math.abs(hash) % 15) // 70-85%
  
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }
  
  return hslToHex(hue, saturation, lightness)
}

export function generateRandomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 40 + Math.floor(Math.random() * 20) // 40-60%
  const lightness = 70 + Math.floor(Math.random() * 15) // 70-85%
  
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }
  
  return hslToHex(hue, saturation, lightness)
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

export function enrichPostsWithSanityCategories(posts: any[], sanityCategories: any[]) {
  return posts.map(post => {
    if (post.category) {
      const sanityCategory = sanityCategories.find((cat: any) => 
        cat.slug.current === post.category.slug || cat.name === post.category.name
      )
      if (sanityCategory) {
        post.category = {
          ...post.category,
          color: sanityCategory.color
        }
      }
    }
    return post
  })
}
