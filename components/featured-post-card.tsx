'use client'

import Link from "next/link"
import CategoryBadge from "./category-badge"
import AnimatedPostTitle from "./animated-post-title"

interface FeaturedPostCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
  category: {
    name: string
    color?: string
  } | string
  imageUrl?: string
  pullUp?: boolean
}

export default function FeaturedPostCard({ title, excerpt, date, slug, category, imageUrl, pullUp = false }: FeaturedPostCardProps) {

  return (
    <article className={`w-full bg-black dark:bg-[#0A0B0D] text-white blur-element border-b border-gray-800 dark:border-gray-900 ${pullUp ? '-mt-[60px] pt-[120px] pb-16' : 'pt-[76px] pb-16'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          {imageUrl && (
            <div className="w-full lg:w-1/2">
              <Link href={`/posts/${slug}`}>
                <div className="aspect-[16/10] overflow-hidden rounded-lg">
                  <img 
                    src={imageUrl} 
                    alt={title}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              </Link>
            </div>
          )}
          
          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm px-2 py-0.5 bg-[#d61f1f] rounded text-white font-mono font-bold">
                <img src="/zero_n_feat.svg" alt="" className="w-3.5 h-3.5" />
                <span className="w-px h-3.5 bg-white/40"></span>
                Featured
              </span>
              <CategoryBadge category={category} darkBackground={true} />
              <time className="text-base text-gray-400 font-mono">{date}</time>
            </div>
            <Link href={`/posts/${slug}`} className="hover:text-gray-300 transition-colors block mb-4">
              <AnimatedPostTitle 
                title={title} 
                className="font-sf-pro-display text-4xl lg:text-5xl font-bold leading-tight"
                as="h2"
              />
            </Link>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">{excerpt}</p>
            <Link
              href={`/posts/${slug}`}
              className="relative inline-flex items-center text-base font-sf-pro-display font-medium text-white hover:text-[#d61f1f] transition-colors group"
            >
              <span className="w-1.5 h-1.5 bg-[#d61f1f] rounded-full mr-2 transition-all duration-300 group-hover:opacity-0 group-hover:w-0 group-hover:mr-0"></span>
              <span className="transition-all duration-300">Read full story</span>
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#d61f1f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
