import Link from "next/link"

interface FeaturedPostCardProps {
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

export default function FeaturedPostCard({ title, excerpt, date, slug, category }: FeaturedPostCardProps) {
  const colors = categoryColorMap[category] || categoryColorMap.Default

  return (
    <article className="mb-12 pb-8 border-2 border-gray-200 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm px-3 py-1 bg-yellow-100 rounded text-yellow-800 font-semibold">Featured</span>
        <span className={`text-xs px-2 py-1 rounded ${colors.bg} ${colors.text}`}>{category}</span>
        <time className="text-xs text-gray-500">{date}</time>
      </div>
      <h2 className="font-serif text-3xl font-bold mb-4 leading-tight">
        <Link href={`/posts/${slug}`} className="hover:text-gray-600 transition-colors">
          {title}
        </Link>
      </h2>
      <p className="text-base text-black leading-relaxed mb-4">{excerpt}</p>
      <Link
        href={`/posts/${slug}`}
        className="text-sm text-gray-900 hover:text-gray-600 transition-colors border-b-2 border-gray-400 hover:border-gray-600 pb-px"
      >
        Read full story →
      </Link>
    </article>
  )
}
