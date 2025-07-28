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

function darkenColor(hex: string, amount: number = 0.15): string {
  const { r, g, b } = hexToRgb(hex)
  
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break
      case gNorm: h = (bNorm - rNorm) / d + 2; break
      case bNorm: h = (rNorm - gNorm) / d + 4; break
      default: h = 0
    }
    h /= 6
  }
  
  l = Math.max(0, l - amount)
  
  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b
    
    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }
  
  const { r: newR, g: newG, b: newB } = hslToRgb(h, s, l)
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

export function getCategoryStyles(color?: string, darkBackground: boolean = false) {
  if (!color) {
    const defaultColor = '#f1f5f9' // slate-100
    const darkerBorderColor = darkenColor(defaultColor, 0.08)
    const opacity = darkBackground ? 0.85 : 0.6
    return {
      backgroundColor: `rgba(241, 245, 249, ${opacity})`, // slate-100 with dynamic opacity
      borderColor: darkBackground ? 'rgba(241, 245, 249, 0.3)' : darkerBorderColor,
      borderWidth: '1px',
      borderStyle: 'solid',
      color: '#334155' // slate-700
    }
  }

  const textColor = getContrastColor(color)
  const darkerBorderColor = darkenColor(color, 0.08)
  
  const { r, g, b } = hexToRgb(color)
  const opacity = darkBackground ? 0.85 : 0.6
  const backgroundColorWithOpacity = `rgba(${r}, ${g}, ${b}, ${opacity})`

  return {
    backgroundColor: backgroundColorWithOpacity,
    borderColor: darkBackground ? `rgba(${r}, ${g}, ${b}, 0.3)` : darkerBorderColor,
    borderWidth: '1px',
    borderStyle: 'solid',
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
