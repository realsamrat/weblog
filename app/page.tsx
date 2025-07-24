import Navigation from "@/components/navigation"
import BlogPostCard from "@/components/blog-post-card"
import FeaturedPostCard from "@/components/featured-post-card"
import PopularTags from "@/components/popular-tags"
import PopularPostsList from "@/components/popular-posts-list"
import { getPublishedPosts, getFeaturedPosts, getAllSanityTags } from "@/lib/sanity"
import { getAllPosts, getFeaturedPost, getPopularPosts } from "@/lib/posts"
import { Status } from "@prisma/client"

export default async function Home() {
  // Try Sanity first, fallback to Prisma
  let allPublishedPosts = await getPublishedPosts(20)
  let featuredPost = null
  let useSanity = true
  
  if (allPublishedPosts.length === 0) {
    // Fallback to Prisma
    useSanity = false
    const prismaData = await getAllPosts({ status: Status.PUBLISHED })
    allPublishedPosts = prismaData
    const featuredData = await getFeaturedPost()
    featuredPost = featuredData
  } else {
    const featuredPosts = await getFeaturedPosts()
    featuredPost = featuredPosts[0]
  }
  
  const otherPosts = featuredPost
    ? allPublishedPosts.filter((post: any) => post.slug !== featuredPost.slug)
    : allPublishedPosts

  // For now, using existing data for popular posts and tags
  const popularPostsData = await getPopularPosts(7)
  const popularTagsData = await getAllSanityTags()

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main content area */}
          <div className="w-full md:w-2/3">
            {featuredPost && (
              <FeaturedPostCard
                title={featuredPost.title}
                excerpt={featuredPost.excerpt || ""}
                date={useSanity 
                  ? new Date(featuredPost.publishedAt).toISOString().split('T')[0]
                  : featuredPost.publishedAt?.toISOString().split('T')[0] || ""
                }
                slug={featuredPost.slug.current || featuredPost.slug}
                category={useSanity 
                  ? featuredPost.categories?.[0]?.name || "General"
                  : featuredPost.category?.name || "General"
                }
              />
            )}

            <h2 className="font-serif text-2xl font-semibold mb-6 mt-10 pt-8 border-t border-gray-300">Recent Posts</h2>
            <div className="space-y-0">
              {otherPosts.map((post: any) => (
                <BlogPostCard
                  key={post.slug.current || post.slug}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  date={useSanity
                    ? new Date(post.publishedAt).toISOString().split('T')[0]
                    : post.publishedAt?.toISOString().split('T')[0] || ""
                  }
                  slug={post.slug.current || post.slug}
                  category={useSanity
                    ? post.categories?.[0]?.name || "General"
                    : post.category?.name || "General"
                  }
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-1/3 md:sticky md:top-8 h-fit">
            <PopularTags tags={popularTagsData.slice(0, 7)} />
            <PopularPostsList posts={popularPostsData} />
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">© 2024 Weblog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
