'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface TitleBlurProps {
  children: React.ReactNode
  className?: string
}

export default function TitleBlur({ children, className }: TitleBlurProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  // When title starts to scroll out of view, increase blur
  const blur = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 10])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [1, 1, 0.3])
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        filter: useTransform(blur, (value) => `blur(${value}px)`),
        opacity
      }}
    >
      {children}
    </motion.div>
  )
}