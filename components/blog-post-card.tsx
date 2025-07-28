import Link from "next/link"
import CategoryBadge from "./category-badge"

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

  return (
    <article className="border-b border-gray-100 dark:border-gray-800 pb-8 mb-8 last:border-b-0">
      <div className="flex items-center gap-2 mb-2">
        <CategoryBadge category={category} />
        <time className="text-xs text-gray-500 dark:text-gray-400 font-mono">{date}</time>
      </div>
      <h2 className="font-sf-pro-display text-xl font-semibold mb-3 leading-tight">
        <Link href={`/posts/${slug}`} className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {title}
        </Link>
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{excerpt}</p>
      <Link
        href={`/posts/${slug}`}
        className="relative text-xs text-gray-900 dark:text-gray-100 hover:text-[#d61f1f] dark:hover:text-[#d61f1f] transition-colors group inline-block"
      >
        Read more →
        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#d61f1f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </Link>
    </article>
  )
}
