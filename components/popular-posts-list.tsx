import Link from "next/link"
import { LinkIcon } from "lucide-react"

interface PopularPostItem {
  title: string
  slug: string
  date: string
}

interface PopularPostsListProps {
  posts: PopularPostItem[]
}

export default function PopularPostsList({ posts }: PopularPostsListProps) {
  return (
    <div>
      <h3 className="font-serif text-lg font-semibold mb-3">Popular Posts</h3>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors group flex items-start gap-2"
            >
              <LinkIcon className="w-3.5 h-3.5 mt-1 flex-shrink-0 opacity-70" />
              <div>
                <span className="group-hover:underline">{post.title}</span>
                <time className="block text-xs text-gray-500 mt-0.5">{post.date}</time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
