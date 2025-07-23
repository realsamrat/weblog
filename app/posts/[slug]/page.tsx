import Navigation from "@/components/navigation"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts, type Post } from "@/lib/posts"
import { Status } from "@prisma/client"
import { sanitizeHtml, legacyMarkdownToHtml, isHtmlContent } from "@/lib/markdown"


interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch both post and all posts in parallel to improve performance
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts({ 
      status: Status.PUBLISHED,
      includeRelations: false // Only get basic data for the list
    })
  ]) as [Post | null, Post[]]

  // Type guard to ensure we have the right types
  if (!post || post.status === Status.DRAFT) {
    notFound()
  }

  // Find previous post efficiently
  const currentPostIndex = allPosts.findIndex((p: Post) => p.slug === slug)
  const previousPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null

  // Handle content - render HTML directly or convert legacy markdown
  let processedContent: string
  
  if (isHtmlContent(post.content)) {
    // Content is already HTML, sanitize and use directly
    processedContent = sanitizeHtml(post.content)
  } else {
    // Legacy markdown content, convert to HTML
    processedContent = await legacyMarkdownToHtml(post.content)
  }



  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4">
        <div className="flex gap-12">
          {/* Main content */}
          <article className="flex-1 max-w-xl">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-teal-100 rounded text-teal-800">{post.category?.name || 'General'}</span>
                <time className="text-xs text-gray-500">
                  {post.publishedAt?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h1 className="font-serif text-3xl font-bold leading-tight mb-4">{post.title}</h1>
            </header>

            <div 
              className="prose prose-sm max-w-none text-black [&>*]:mb-4 [&>*:last-child]:mb-0
                [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:leading-relaxed [&_p]:text-black
                [&_strong]:font-semibold
                [&_em]:italic
                [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-gray-800
                [&_div[data-language]]:my-6 [&_div[data-language]]:border-2 [&_div[data-language]]:border-black [&_div[data-language]]:rounded-md [&_div[data-language]]:overflow-hidden [&_div[data-language]]:bg-white
                [&_pre]:my-6 [&_pre]:border-2 [&_pre]:border-black [&_pre]:rounded-md [&_pre]:overflow-hidden [&_pre]:bg-white [&_pre]:p-0 [&_pre]:relative
                [&_pre_code]:bg-white [&_pre_code]:text-black [&_pre_code]:p-4 [&_pre_code]:block [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words [&_pre_code]:font-mono [&_pre_code]:text-sm [&_pre_code]:leading-relaxed [&_pre_code]:border-0 [&_pre_code]:rounded-none
                [&_pre]:before:content-[attr(data-language)] [&_pre]:before:absolute [&_pre]:before:top-0 [&_pre]:before:left-0 [&_pre]:before:right-0 [&_pre]:before:bg-gray-100 [&_pre]:before:px-4 [&_pre]:before:py-2 [&_pre]:before:text-xs [&_pre]:before:font-mono [&_pre]:before:text-gray-600 [&_pre]:before:border-b [&_pre]:before:border-gray-200 [&_pre]:before:uppercase [&_pre]:before:tracking-wide
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:bg-gray-50 [&_blockquote]:rounded-r-md [&_blockquote]:flex [&_blockquote]:items-center [&_blockquote]:min-h-[3rem]
                [&_blockquote_*]:mt-0 [&_blockquote_*]:mb-0
                [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1
                [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1
                [&_li]:leading-relaxed [&_li]:text-black
                [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
                [&_img]:rounded-md [&_img]:max-w-full [&_img]:h-auto [&_img]:my-6
                [&_[data-type='INFO']]:bg-blue-50 [&_[data-type='INFO']]:border-blue-200 [&_[data-type='INFO']]:border-l-4 [&_[data-type='INFO']]:p-4 [&_[data-type='INFO']]:my-6 [&_[data-type='INFO']]:rounded-r-md [&_[data-type='INFO']]:text-blue-900 [&_[data-type='INFO']]:text-sm [&_[data-type='INFO']]:leading-relaxed
                [&_[data-type='TIP']]:bg-yellow-50 [&_[data-type='TIP']]:border-yellow-200 [&_[data-type='TIP']]:border-l-4 [&_[data-type='TIP']]:p-4 [&_[data-type='TIP']]:my-6 [&_[data-type='TIP']]:rounded-r-md [&_[data-type='TIP']]:text-yellow-900 [&_[data-type='TIP']]:text-sm [&_[data-type='TIP']]:leading-relaxed
                [&_[data-type='WARNING']]:bg-red-50 [&_[data-type='WARNING']]:border-red-200 [&_[data-type='WARNING']]:border-l-4 [&_[data-type='WARNING']]:p-4 [&_[data-type='WARNING']]:my-6 [&_[data-type='WARNING']]:rounded-r-md [&_[data-type='WARNING']]:text-red-900 [&_[data-type='WARNING']]:text-sm [&_[data-type='WARNING']]:leading-relaxed
                [&_[data-type='SUCCESS']]:bg-green-50 [&_[data-type='SUCCESS']]:border-green-200 [&_[data-type='SUCCESS']]:border-l-4 [&_[data-type='SUCCESS']]:p-4 [&_[data-type='SUCCESS']]:my-6 [&_[data-type='SUCCESS']]:rounded-r-md [&_[data-type='SUCCESS']]:text-green-900 [&_[data-type='SUCCESS']]:text-sm [&_[data-type='SUCCESS']]:leading-relaxed
                [&_[data-type='code-preview']]:my-6 [&_[data-type='code-preview']]:border-2 [&_[data-type='code-preview']]:border-gray-200 [&_[data-type='code-preview']]:rounded-md [&_[data-type='code-preview']]:overflow-hidden [&_[data-type='code-preview']]:bg-white
                [&_[data-type='js-embed']]:my-6 [&_[data-type='js-embed']]:border-2 [&_[data-type='js-embed']]:border-gray-200 [&_[data-type='js-embed']]:rounded-md [&_[data-type='js-embed']]:overflow-hidden [&_[data-type='js-embed']]:bg-white"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-300 hover:border-gray-600"
              >
                ← Back to all posts
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              {/* Post metadata */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2">
                  This is <strong>{post.title}</strong> by {post.author.name}, posted on <strong>
                    {post.publishedAt?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>.
                </p>
              </div>

              {/* Keywords */}
              {post.tags.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((postTag) => (
                      <span
                        key={postTag.tag.id}
                        className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors cursor-pointer"
                      >
                        {postTag.tag.name}
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
                    <a href={`/posts/${previousPost.slug}`} className="text-blue-600 hover:text-blue-800 underline">
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
