'use client'

import Link from "next/link"
import { getCategoryStyles } from "@/lib/utils"
import { motion } from "framer-motion"

interface TechCrunchPostCardProps {
  title: string
  date: string
  slug: string
  category: {
    name: string
    color?: string
  } | string
  author?: {
    name: string
  } | string
  imageUrl?: string
}

// Helper function to format relative time
function getRelativeTime(date: string): string {
  const now = new Date()
  const postDate = new Date(date)
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60))
    if (diffInMinutes === 0) {
      return 'Just now'
    }
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }
}

export default function TechCrunchPostCard({ 
  title, 
  date, 
  slug, 
  category,
  author,
  imageUrl 
}: TechCrunchPostCardProps) {
  const categoryName = typeof category === 'string' ? category : category.name
  const categoryColor = typeof category === 'string' ? undefined : category.color
  const authorName = typeof author === 'string' ? author : author?.name || 'Staff'
  const relativeTime = getRelativeTime(date)
  
  // Get category styles
  const styles = getCategoryStyles(categoryColor)

  return (
    <motion.article 
      className="py-5 first:pt-0 last:pb-0 blur-element"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/posts/${slug}`} className="flex gap-4 sm:gap-5 md:gap-6 group">
        {/* Thumbnail Image */}
        <div className="flex-shrink-0 w-[120px] sm:w-[160px] md:w-[200px] h-[80px] sm:h-[107px] md:h-[135px] overflow-hidden rounded-md my-2 sm:my-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center py-2">
          {/* Category */}
          <div className="mb-2">
            <span 
              className="inline-block text-[11px] px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider"
              style={styles}
            >
              {categoryName}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="font-sf-pro-display text-[18px] sm:text-[20px] md:text-[22px] font-bold leading-[1.2] mb-2 text-black group-hover:underline underline-offset-2 transition-colors">
            {title}
          </h2>
          
          {/* Author and Time */}
          <div className="flex items-center text-[13px] text-gray-600">
            <span className="font-medium text-gray-900">{authorName}</span>
            <span className="mx-1.5 text-gray-400">-</span>
            <time className="text-gray-500">{relativeTime}</time>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}