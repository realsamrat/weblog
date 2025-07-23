import Navigation from "@/components/navigation"
import BlogPostCard from "@/components/blog-post-card"
import FeaturedPostCard from "@/components/featured-post-card"
import PopularKeywords from "@/components/popular-keywords"
import PopularPostsList from "@/components/popular-posts-list"
import { getAllPosts, getFeaturedPost, getPopularPosts, getPopularKeywords } from "@/lib/posts"
import { Status } from "@prisma/client"

export default async function Home() {
  const allPublishedPosts = await getAllPosts({ status: Status.PUBLISHED })
  const featuredPostData = await getFeaturedPost()
  const otherPosts = featuredPostData
    ? allPublishedPosts.filter((post) => post.slug !== featuredPostData.slug)
    : allPublishedPosts

  const popularPostsData = await getPopularPosts(7)
  const popularKeywordsData = await getPopularKeywords(7)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main content area */}
          <div className="w-full md:w-2/3">
            {featuredPostData && (
              <FeaturedPostCard
                title={featuredPostData.title}
                excerpt={featuredPostData.excerpt || ""}
                date={featuredPostData.publishedAt?.toISOString().split('T')[0] || ""}
                slug={featuredPostData.slug}
                category={featuredPostData.category?.name || "General"}
              />
            )}

            <h2 className="font-serif text-2xl font-semibold mb-6 mt-10 pt-8 border-t border-gray-300">Recent Posts</h2>
            <div className="space-y-0">
              {otherPosts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  date={post.publishedAt?.toISOString().split('T')[0] || ""}
                  slug={post.slug}
                  category={post.category?.name || "General"}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-1/3 md:sticky md:top-8 h-fit">
            <PopularKeywords keywords={popularKeywordsData} />
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
