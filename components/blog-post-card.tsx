import Link from "next/link"
import { getCategoryStyles } from "@/lib/utils"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
  category: {
    name: string
    color?: string
  } | string
}

export default function BlogPostCard({ title, excerpt, date, slug, category }: BlogPostCardProps) {
  const categoryName = typeof category === 'string' ? category : category.name
  const categoryColor = typeof category === 'string' ? undefined : category.color
  const styles = getCategoryStyles(categoryColor)

  return (
    <article className="border-b border-gray-100 pb-8 mb-8 last:border-b-0">
      <div className="flex items-center gap-2 mb-2">
        <span 
          className="text-xs px-2 py-1 rounded font-mono uppercase"
          style={styles}
        >
          {categoryName}
        </span>
        <time className="text-xs text-gray-500 font-mono">{date}</time>
      </div>
      <h2 className="font-sf-pro-display text-xl font-semibold mb-3 leading-tight">
        <Link href={`/posts/${slug}`} className="hover:text-gray-600 transition-colors">
          {title}
        </Link>
      </h2>
      <p className="text-sm text-black leading-relaxed mb-3">{excerpt}</p>
      <Link
        href={`/posts/${slug}`}
        className="text-xs text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-600"
      >
        Read more →
      </Link>
    </article>
  )
}
