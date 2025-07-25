'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

interface HeroAnimationProps {
  children: React.ReactNode
  className?: string
  imageUrl?: string
  alt?: string
}

export function HeroImage({ imageUrl, alt, className }: { imageUrl: string; alt: string; className?: string }) {
  return (
    <img 
      src={imageUrl} 
      alt={alt}
      className="w-full h-full"
      style={{ objectFit: 'cover' }}
      decoding="async"
      fetchPriority="high"
    />
  )
}

export function HeroContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function HeroTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={className}>
      {children}
    </h1>
  )
}