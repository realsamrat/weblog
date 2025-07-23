import Link from "next/link"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
  category: string
}

const categoryColorMap: { [key: string]: { bg: string; text: string } } = {
  AI: { bg: "bg-sky-100", text: "text-sky-800" },
  Security: { bg: "bg-rose-100", text: "text-rose-800" },
  Programming: { bg: "bg-emerald-100", text: "text-emerald-800" },
  Default: { bg: "bg-slate-100", text: "text-slate-800" },
}

export default function BlogPostCard({ title, excerpt, date, slug, category }: BlogPostCardProps) {
  const colors = categoryColorMap[category] || categoryColorMap.Default

  return (
    <article className="border-b border-gray-100 pb-8 mb-8 last:border-b-0">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-1 rounded ${colors.bg} ${colors.text}`}>{category}</span>
        <time className="text-xs text-gray-500">{date}</time>
      </div>
      <h2 className="font-serif text-xl font-semibold mb-3 leading-tight">
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
