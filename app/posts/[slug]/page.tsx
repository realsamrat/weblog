import Navigation from "@/components/navigation"
import { notFound } from "next/navigation"
import { getPostBySlug as getSanityPost, getPublishedPosts } from "@/lib/sanity"
import { getPostBySlug as getPrismaPost, getAllPosts } from "@/lib/posts"
import { Status } from "@prisma/client"
import { sanitizeHtml, legacyMarkdownToHtml, isHtmlContent } from "@/lib/markdown"
import { portableTextToHtml } from "@/lib/sanity"
import Link from "next/link"
// Remove lexicalToHTML import as it's not available in this version

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  
  // Try Sanity first, fallback to Prisma
  let post = await getSanityPost(slug)
  let useSanity = true
  let allPosts: any[] = []
  
  
  if (!post) {
    // Fallback to Prisma
    useSanity = false
    const prismaPost = await getPrismaPost(slug)
    if (!prismaPost || prismaPost.status === Status.DRAFT) {
      notFound()
    }
    post = prismaPost
    allPosts = await getAllPosts({ 
      status: Status.PUBLISHED,
      includeRelations: false
    })
  } else {
    allPosts = await getPublishedPosts(100)
  }

  // Find previous post
  const currentPostIndex = allPosts.findIndex((p: any) => (p.slug?.current || p.slug) === slug)
  const previousPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null

  // Process content based on source
  let contentHTML = ''
  
  if (useSanity && Array.isArray(post.content)) {
    contentHTML = portableTextToHtml(post.content)
  } else if (post.content) {
    // Prisma content (HTML or Markdown)
    if (isHtmlContent(post.content)) {
      contentHTML = sanitizeHtml(post.content)
    } else {
      contentHTML = await legacyMarkdownToHtml(post.content)
    }
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
                <span className="text-xs px-2 py-1 bg-teal-100 rounded text-teal-800">
                  {useSanity 
                    ? post.categories?.[0]?.name || 'General'
                    : post.category?.name || 'General'
                  }
                </span>
                <time className="text-xs text-gray-500">
                  {new Date(useSanity ? post.publishedAt : post.publishedAt || new Date()).toLocaleDateString('en-US', {
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
                [&_img]:rounded-md [&_img]:max-w-full [&_img]:h-auto [&_img]:my-6"
              dangerouslySetInnerHTML={{ __html: contentHTML }}
            />

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
                  This is <strong>{post.title}</strong> by {
                    useSanity 
                      ? post.author?.name || 'Anonymous'
                      : post.author?.name || 'Anonymous'
                  }, posted on <strong>
                    {new Date(useSanity ? post.publishedAt : post.publishedAt || new Date()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>.
                </p>
              </div>

              {/* Tags */}
              {((useSanity && post.tags?.length > 0) || (!useSanity && post.tags?.length > 0)) && (
                <div className="mb-8">
                  <h4 className="font-serif text-sm font-semibold mb-2 text-gray-800">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {useSanity ? (
                      post.tags.map((tag: any) => (
                        <Link
                          key={tag._id}
                          href={`/tags/${tag.slug.current}`}
                          className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors"
                        >
                          {tag.name}
                        </Link>
                      ))
                    ) : (
                      post.tags.map((postTag: any) => (
                        <Link
                          key={postTag.tag.id}
                          href={`/tags/${postTag.tag.slug}`}
                          className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors"
                        >
                          {postTag.tag.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Previous post */}
              <div>
                {previousPost ? (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Previous:</strong>{" "}
                    <Link href={`/posts/${previousPost.slug?.current || previousPost.slug}`} className="text-blue-600 hover:text-blue-800 underline">
                      {previousPost.title}
                    </Link>
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
