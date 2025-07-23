import Navigation from "@/components/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug, getPublishedPosts } from "@/lib/sanity-utils"
import { PortableText } from '@portabletext/react'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  
  const post = await getPostBySlug(slug)
  if (!post || post.status === 'draft') {
    notFound()
  }
  
  const allPosts = await getPublishedPosts(100)

  // Find previous post
  const currentPostIndex = allPosts.findIndex((p) => p.slug.current === slug)
  const previousPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4">
        <div className="flex gap-12">
          {/* Main content */}
          <article className="flex-1 max-w-xl">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-teal-100 rounded text-teal-800">
                  {post.category?.name || 'General'}
                </span>
                <time className="text-xs text-gray-500">
                  {new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h1 className="font-serif text-3xl font-bold leading-tight mb-4">{post.title}</h1>
            </header>

            <div className="prose prose-sm max-w-none text-black [&>*]:mb-4 [&>*:last-child]:mb-0
                [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:leading-relaxed [&_p]:text-black
                [&_strong]:font-semibold
                [&_em]:italic
                [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
                [&_img]:rounded-md [&_img]:max-w-full [&_img]:h-auto [&_img]:my-6">
              <PortableText value={post.content} />
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-300 hover:border-gray-600"
              >
                ← Back to all posts
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              {/* Post metadata */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2">
                  This is <strong>{post.title}</strong> by {post.author?.name || 'Anonymous'}, posted on <strong>
                    {new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>.
                </p>
              </div>

              {/* Keywords */}
              {post.tags?.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors cursor-pointer"
                      >
                        {tag.name}
                        <span className="ml-1 text-gray-500">{Math.floor(Math.random() * 1000) + 100}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous post */}
              <div>
                {previousPost ? (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Previous:</strong>{" "}
                    <a href={`/posts/${previousPost.slug.current}`} className="text-blue-600 hover:text-blue-800 underline">
                      {previousPost.title}
                    </a>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Previous:</strong>{" "}
                    <span className="text-gray-400">This is the latest post</span>
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">© 2024 Weblog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
