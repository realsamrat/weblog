import { Suspense } from "react"
import dynamic from 'next/dynamic'
import PageWrapper from "@/components/page-wrapper"
import { notFound } from "next/navigation"
import { getPostBySlug as getSanityPost, urlFor } from "@/lib/sanity"
import { getPostBySlug as getPrismaPost } from "@/lib/posts"
import { Status } from "@prisma/client"
import { sanitizeHtml, legacyMarkdownToHtml, isHtmlContent } from "@/lib/markdown"
import { portableTextToHtml } from "@/lib/sanity"
import Link from "next/link"
import CategoryBadge from "@/components/category-badge"
import HeroTitleSection from "@/components/hero-title-section"
import { getCachedCategories, getCachedTagsWithCounts } from "@/lib/cached-data"

// Lazy load SocialShare component
const SocialShare = dynamic(() => import('@/components/ui/social-share').then(mod => ({ default: mod.SocialShare })), {
  loading: () => <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
})

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function BlogPostContent({ params }: PageProps) {
  const { slug } = await params
  
  // Parallel fetch initial data - removed publishedPosts to reduce payload
  const [sanityPost, sanityCategories] = await Promise.all([
    getSanityPost(slug),
    getCachedCategories()
  ])
  
  let post = sanityPost
  let useSanity = true
  let tagsWithCounts: any[] = []

  if (!post) {
    // Fallback to Prisma
    useSanity = false
    const prismaPost = await getPrismaPost(slug)
    
    if (!prismaPost || prismaPost.status === Status.DRAFT) {
      notFound()
    }
    
    post = prismaPost
    
    if (post.category) {
      const sanityCategory = sanityCategories.find((cat: any) => 
        cat.slug.current === post.category.slug || cat.name === post.category.name
      )
      if (sanityCategory) {
        post.category = {
          ...post.category,
          color: sanityCategory.color
        }
      }
    }
  } else {
    // Fetch tags in parallel if post has tags
    if (post.tags && post.tags.length > 0) {
      const tagIds = post.tags.map((tag: any) => tag._id)
      tagsWithCounts = await getCachedTagsWithCounts(tagIds)
    }
  }

  console.log('Post data:', JSON.stringify(post, null, 2))
  console.log('useSanity:', useSanity)
  console.log('post.tags:', post.tags)

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
    <PageWrapper noPadding>
      
      {/* Full-width Hero Header */}
      <div className="w-full bg-black dark:bg-[#a61818] mb-[70px] lg:mb-[120px] min-h-[456px] -mt-[60px] pt-[60px] blur-element">
        {/* Split Layout Container */}
        <div className="flex flex-col lg:flex-row">
            
            {/* Left Column - Featured Image (Full Bleed) - 43% */}
            <div className="w-full lg:flex-[43%] lg:min-h-[375px] relative">
              {(post.featuredImage?.asset || post.featuredImage?.url || post.imageUrl) ? (
                <figure className="w-full h-full lg:flex lg:flex-col">
                  <div className="aspect-[4/3] lg:aspect-auto lg:flex-grow overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={
                        post.featuredImage?.asset 
                          ? urlFor(post.featuredImage.asset).url()
                          : post.featuredImage?.url || post.imageUrl
                      }
                      alt={post.featuredImage?.alt || post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="hidden lg:flex items-center justify-end h-10 px-4 bg-white text-[11px] text-gray-600 uppercase tracking-wider font-mono gap-1">
                    <strong>Image Credits:</strong> {post.featuredImage?.caption || 'STOCK PHOTO / GETTY IMAGES'}
                  </figcaption>
                </figure>
              ) : (
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
              )}
            </div>

            {/* Right Column - Content - 57% */}
            <div className="w-full lg:flex-[57%] relative bg-black dark:bg-[#a61818]">
              {/* Outer extension div for bottom overlap - lighter accent color */}
              <div className="absolute bottom-0 left-0 w-full h-5 lg:h-10 bg-gray-700 dark:bg-[#e85555] z-0" role="presentation"></div>
              
              {/* Content container with max-width and specific spacing */}
              <div className="flex flex-col justify-around mx-6 lg:ml-8 lg:mr-6 xl:ml-[100px] max-w-none lg:max-w-[620px] min-h-[400px] lg:min-h-[620px] pt-6 lg:pt-16 pb-8 lg:pb-16 pr-6 lg:pr-6 gap-4 lg:gap-0 relative overflow-visible">
                {/* Inner extension div - creates the raised effect */}
                <div 
                  className="absolute bg-black dark:bg-[#a61818] -bottom-2.5 -left-6 h-[15px] z-10
                    w-[calc(100%+48px)]
                    lg:-bottom-[39px] lg:-left-8 lg:h-20 lg:w-[calc(100%+32px)]
                    xl:-bottom-10 xl:-left-[100px] xl:w-[calc(100%+106px)]" 
                  role="presentation"
                ></div>
                
                {/* Top Section - Category and Share */}
                <div className="flex items-start justify-between relative z-20 mb-4 sm:mb-8">
                  {/* Category */}
                  <div>
                    <CategoryBadge 
                      category={useSanity ? (post.categories?.[0] || { name: "General" }) : (post.category || { name: "General" })}
                      darkBackground={true}
                      className="rounded-md"
                    />
                  </div>
                  
                  {/* Social Share */}
                  <SocialShare 
                    url={`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/posts/${useSanity ? post.slug?.current : post.slug}`}
                    title={post.title}
                    className="flex-shrink-0"
                  />
                </div>

                {/* Middle Section - Title */}
                <HeroTitleSection title={post.title} />

                {/* Bottom Section - Author and Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm relative z-20">
                  <span className="font-semibold text-white">
                    {useSanity 
                      ? post.author?.name || 'Anonymous'
                      : post.author?.name || 'Anonymous'
                    }
                  </span>
                  <time className="font-mono text-gray-400 dark:text-white/80 text-xs sm:text-sm">
                    {(() => {
                      const date = new Date(useSanity ? post.publishedAt : post.publishedAt || new Date());
                      const timeStr = date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      });
                      const dateStr = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'Asia/Kolkata'
                      });
                      return `${timeStr} IST • ${dateStr}`;
                    })()}
                  </time>
                </div>
              </div>
              
              {/* Mobile credits */}
              {(post.featuredImage?.asset || post.featuredImage?.url || post.imageUrl) && (
                <div className="relative z-30 flex items-center px-6 py-3 bg-white dark:bg-gray-900 text-[11px] text-gray-600 dark:text-gray-400 uppercase tracking-wider font-mono gap-1 lg:hidden">
                  <strong>Image Credits:</strong> {post.featuredImage?.caption || 'STOCK PHOTO / GETTY IMAGES'}
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 flex-grow blur-element">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main content */}
          <article className="flex-1">

            <div 
              className="prose prose-base max-w-none text-black dark:text-white [&>*]:mb-4 [&>*:last-child]:mb-0
                [&_h1]:font-sf-pro-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:font-sf-pro-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:font-sf-pro-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                [&_h4]:font-sf-pro-display [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
                [&_h5]:font-sf-pro-display [&_h5]:text-sm [&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-2
                [&_h6]:font-sf-pro-display [&_h6]:text-xs [&_h6]:font-semibold [&_h6]:mt-4 [&_h6]:mb-2
                [&_p]:leading-[27px] [&_p]:text-black dark:[&_p]:text-gray-200 [&_p]:font-normal [&_p]:font-sf-pro-display [&_p]:text-[19px] [&_p]:tracking-[0.2px]
                [&_strong]:font-semibold
                [&_em]:italic
                [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-gray-800 dark:[&_code]:text-gray-200
                [&_code:has(iframe)]:bg-transparent [&_code:has(iframe)]:p-0 [&_code:has(iframe)]:block [&_code:has(iframe)]:w-full [&_code:has(iframe)]:font-sans [&_code:has(iframe)]:text-base
                [&_code:has(iframe)]:before:content-none [&_code:has(iframe)]:after:content-none
                [&_code_iframe]:my-4 [&_code_iframe]:block
                [&_div[data-language]]:my-6 [&_div[data-language]]:border-2 [&_div[data-language]]:border-black dark:[&_div[data-language]]:border-gray-700 [&_div[data-language]]:rounded-md [&_div[data-language]]:overflow-hidden [&_div[data-language]]:bg-white dark:[&_div[data-language]]:bg-gray-900
                [&_pre]:my-6 [&_pre]:border-2 [&_pre]:border-black dark:[&_pre]:border-gray-700 [&_pre]:rounded-md [&_pre]:overflow-hidden [&_pre]:bg-white dark:[&_pre]:bg-gray-900 [&_pre]:p-0 [&_pre]:relative
                [&_pre_code]:bg-white dark:[&_pre_code]:bg-gray-900 [&_pre_code]:text-black dark:[&_pre_code]:text-gray-200 [&_pre_code]:p-4 [&_pre_code]:block [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words [&_pre_code]:font-mono [&_pre_code]:text-sm [&_pre_code]:leading-relaxed [&_pre_code]:border-0 [&_pre_code]:rounded-none
                [&_pre]:before:content-[attr(data-language)] [&_pre]:before:absolute [&_pre]:before:top-0 [&_pre]:before:left-0 [&_pre]:before:right-0 [&_pre]:before:bg-gray-100 dark:[&_pre]:before:bg-gray-800 [&_pre]:before:px-4 [&_pre]:before:py-2 [&_pre]:before:text-xs [&_pre]:before:font-mono [&_pre]:before:text-gray-600 dark:[&_pre]:before:text-gray-400 [&_pre]:before:border-b [&_pre]:before:border-gray-200 dark:[&_pre]:before:border-gray-700 [&_pre]:before:uppercase [&_pre]:before:tracking-wide
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-gray-700 dark:[&_blockquote]:text-gray-300 [&_blockquote]:bg-gray-50 dark:[&_blockquote]:bg-gray-800 [&_blockquote]:rounded-r-md [&_blockquote]:flex [&_blockquote]:items-center [&_blockquote]:min-h-[3rem]
                [&_blockquote_*]:mt-0 [&_blockquote_*]:mb-0
                [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1
                [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1
                [&_li]:leading-relaxed [&_li]:text-black dark:[&_li]:text-gray-200
                [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-800 dark:[&_a:hover]:text-blue-300
                [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-6
                [&_iframe]:rounded-lg [&_iframe]:max-w-full [&_iframe]:my-6 [&_iframe]:before:content-[''] [&_iframe]:after:content-[''] [&_iframe]:before:hidden [&_iframe]:after:hidden
                [&_video]:rounded-lg [&_video]:max-w-full [&_video]:h-auto [&_video]:my-6"
              dangerouslySetInnerHTML={{ __html: contentHTML }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors border-b border-gray-300 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400"
              >
                ← Back to all posts
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-20">
              {/* Post metadata */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  This is <strong>{post.title}</strong> by {
                    useSanity 
                      ? post.author?.name || 'Anonymous'
                      : post.author?.name || 'Anonymous'
                  }, posted on <strong>
                    {new Date(useSanity ? post.publishedAt : post.publishedAt || new Date()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}
                  </strong>.
                </p>
              </div>

              {/* Tags */}
              {((useSanity && tagsWithCounts?.length > 0) || (!useSanity && post.tags?.length > 0)) && (
                <div className="mb-8">
                  <h4 className="font-serif text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {useSanity ? (
                      tagsWithCounts.map((tag: any) => (
                        <Link
                          key={tag._id}
                          href={`/tags/${tag.slug.current}`}
                          className="text-[13px] px-2 py-1 bg-[#FFF2E4] dark:bg-gray-800 text-[#5E5143] dark:text-gray-300 rounded border border-[#E5B98A] dark:border-gray-700 hover:bg-[#FFE8D1] dark:hover:bg-gray-700 hover:border-[#D4A574] dark:hover:border-gray-600 transition-colors"
                        >
                          {tag.name} <span className="text-[#5E5143]/70 ml-1">{tag.postCount}</span>
                        </Link>
                      ))
                    ) : (
                      post.tags.map((postTag: any) => (
                        <Link
                          key={postTag.tag.id}
                          href={`/tags/${postTag.tag.slug}`}
                          className="text-[13px] px-2 py-1 bg-[#FFF2E4] dark:bg-gray-800 text-[#5E5143] dark:text-gray-300 rounded border border-[#E5B98A] dark:border-gray-700 hover:bg-[#FFE8D1] dark:hover:bg-gray-700 hover:border-[#D4A574] dark:hover:border-gray-600 transition-colors"
                        >
                          {postTag.tag.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>
      </main>
    </PageWrapper>
  )
}

export default function BlogPost({ params }: PageProps) {
  return (
    <Suspense fallback={
      <PageWrapper>
        <main className="flex-grow py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12">
            <article className="flex-1 animate-pulse">
              <div className="mb-8">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              </div>
            </article>
            <aside className="w-80 flex-shrink-0">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </aside>
          </div>
        </main>
      </PageWrapper>
    }>
      <BlogPostContent params={params} />
    </Suspense>
  )
}
