'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ScrollFadeProps {
  children: React.ReactNode
  className?: string
}

export default function ScrollFade({ children, className }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 20%"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.7])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [10, 0, 0, -10])
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  )
}