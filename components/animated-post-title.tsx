'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface AnimatedPostTitleProps {
  title: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function AnimatedPostTitle({ title, className = '', as: Tag = 'h1' }: AnimatedPostTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const [isReady, setIsReady] = useState(false)

  // Wait for fonts to load
  const waitForFonts = async () => {
    if (typeof window === 'undefined') return true
    
    try {
      await document.fonts.ready
      // Wait a bit more to ensure layout is stable
      await new Promise(resolve => setTimeout(resolve, 100))
      return true
    } catch (error) {
      console.warn('Font loading check failed:', error)
      await new Promise(resolve => setTimeout(resolve, 200))
      return true
    }
  }

  useGSAP(() => {
    if (!containerRef.current || !title) return

    const initAnimation = async () => {
      await waitForFonts()
      
      if (!containerRef.current) return
      
      // Create a temporary element to measure line breaks
      const measurer = document.createElement(Tag)
      measurer.className = containerRef.current.className
      measurer.style.cssText = window.getComputedStyle(containerRef.current).cssText
      measurer.style.position = 'absolute'
      measurer.style.visibility = 'hidden'
      measurer.style.height = 'auto'
      measurer.style.width = containerRef.current.offsetWidth + 'px'
      measurer.innerHTML = title
      document.body.appendChild(measurer)
      
      // Get line height
      const lineHeight = parseFloat(window.getComputedStyle(measurer).lineHeight)
      
      // Split text into words
      const words = title.split(' ')
      const lines: string[] = []
      let currentLine = ''
      
      // Build lines based on natural wrapping
      words.forEach((word, index) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        measurer.innerHTML = testLine
        
        // Check if this exceeds one line
        if (measurer.offsetHeight > lineHeight * 1.5 && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
        
        // Add last line
        if (index === words.length - 1) {
          lines.push(currentLine)
        }
      })
      
      document.body.removeChild(measurer)
      
      // Create HTML structure with masked lines
      const html = lines.map((line, index) => `
        <span class="line-mask" style="display: block; overflow: hidden; position: relative;">
          <span class="line-inner" data-line="${index}" style="display: block; transform: translateY(100%);">
            ${line}
          </span>
        </span>
      `).join('')
      
      containerRef.current.innerHTML = html
      
      // Get all line elements
      const lineElements = containerRef.current.querySelectorAll('.line-inner')
      
      // Show container
      setIsReady(true)
      
      // Animate each line
      gsap.to(lineElements, {
        y: '0%',
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.1
      })
    }

    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      initAnimation()
    }, 10)

    return () => {
      clearTimeout(timer)
    }
  }, { dependencies: [title, Tag], scope: containerRef })

  return (
    <Tag 
      ref={containerRef}
      className={`${className} text-left`}
      style={{ 
        opacity: isReady ? 1 : 0,
        transition: 'opacity 0.2s',
        textAlign: 'left',
        lineHeight: 1.1
      }}
      aria-label={title}
    >
      {title}
    </Tag>
  )
}