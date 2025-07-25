'use client'

import { motion } from 'framer-motion'

interface StaggerListProps {
  children: React.ReactNode
  className?: string
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function StaggerList({ children, className }: StaggerListProps) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}