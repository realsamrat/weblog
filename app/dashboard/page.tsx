import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"
import { PostsProvider } from "@/components/dashboard/posts-provider"
import { PostsList } from "@/components/dashboard/posts-list"

export default async function DashboardPostsPage() {
  const postsResult = await getAllPosts({ includeRelations: true })
  const posts = Array.isArray(postsResult) ? postsResult : []

  // Serialize the posts data to ensure no functions are included
  const serializedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    category: post.category ? {
      name: post.category.name
    } : null
  }))

  const categoryColorMap: { [key: string]: string } = {
    AI: "bg-blue-100 text-blue-800 border-blue-200",
    Security: "bg-red-100 text-red-800 border-red-200",
    Programming: "bg-green-100 text-green-800 border-green-200",
    General: "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-1">Manage and organize your blog content</p>
        </div>
        <Button asChild className="bg-gray-900 hover:bg-gray-800">
          <Link href="/dashboard/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>
      
      <PostsProvider initialPosts={serializedPosts}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <PostsList categoryColorMap={categoryColorMap} />
        </div>
      </PostsProvider>
    </div>
  )
}
