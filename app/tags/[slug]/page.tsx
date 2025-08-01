import { Suspense } from "react"
import PageWrapper from "@/components/page-wrapper"
import { notFound } from "next/navigation"
import { getPostsByTag, getAllSanityTags } from "@/lib/sanity"
import { formatDistanceToNow } from "date-fns"
import { getCategoryStyles } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface TagPageProps {
  params: Promise<{
    slug: string
  }>
}

async function TagPageContent({ params }: TagPageProps) {
  const { slug } = await params
  
  const posts = await getPostsByTag(slug)
  
  if (!posts || posts.length === 0) {
    notFound()
  }

  const tagName = posts[0]?.tags?.find((tag: any) => tag.slug.current === slug)?.name || slug

  return (
    <PageWrapper>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tag Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏷️</span>
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              {tagName}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with &ldquo;{tagName}&rdquo;
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          {posts.map((post: any) => (
            <article key={post._id} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="flex gap-6">
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="flex-shrink-0 w-32 h-24 relative">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <Link 
                      href={`/posts/${post.slug.current}`}
                      className="text-xl font-serif font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </div>
                  
                  {/* Post Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {post.author && (
                      <span>By {post.author.name}</span>
                    )}
                    {post.publishedAt && (
                      <span className="font-mono">
                        {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  {/* Post Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.map((category: any) => {
                        const styles = getCategoryStyles(category.color)
                        return (
                          <span
                            key={category._id}
                            className="text-xs px-2 py-0.5 rounded font-mono uppercase"
                            style={styles}
                          >
                            {category.name}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  
                  {/* Other Tags */}
                  {post.tags && post.tags.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags
                        .filter((tag: any) => tag.slug.current !== slug)
                        .map((tag: any) => (
                          <Link
                            key={tag._id}
                            href={`/tags/${tag.slug.current}`}
                            className="text-[13px] px-2 py-0.5 bg-[#FFF2E4] text-[#5E5143] rounded border border-[#E5B98A] hover:bg-[#FFE8D1] hover:border-[#D4A574] transition-colors"
                          >
                            {tag.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to all posts
          </Link>
        </div>
      </main>
    </PageWrapper>
  )
}

export default function TagPage({ params }: TagPageProps) {
  return (
    <Suspense fallback={
      <PageWrapper>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-12 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏷️</span>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
          </div>
          <div className="space-y-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </main>
      </PageWrapper>
    }>
      <TagPageContent params={params} />
    </Suspense>
  )
}

export async function generateStaticParams() {
  try {
    const tags = await getAllSanityTags()
    return tags.map((tag: any) => ({
      slug: tag.slug.current,
    }))
  } catch (error) {
    console.error('Error generating static params for tags:', error)
    return []
  }
}
