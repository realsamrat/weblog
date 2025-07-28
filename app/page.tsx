import { Suspense } from "react"
import dynamic from 'next/dynamic'
import PageWrapper from "@/components/page-wrapper"
import TechCrunchPostCard from "@/components/techcrunch-post-card"
import SidebarWrapper from "@/components/sidebar-wrapper"
import { getPublishedPosts, getFeaturedPosts, urlFor } from "@/lib/sanity"
import { getAllPosts, getFeaturedPost } from "@/lib/posts"
import { Status } from "@prisma/client"
import { getCachedCategories } from "@/lib/cached-data"

// Lazy load FeaturedPostCard
const FeaturedPostCard = dynamic(() => import('@/components/featured-post-card'), {
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-900 animate-pulse blur-element -mt-[60px] pt-[60px]"></div>
  )
})

async function HomeContent() {
  // Parallel fetch only essential data for initial render
  const [
    sanityPosts,
    sanityCategories,
    featuredPosts
  ] = await Promise.all([
    getPublishedPosts(10), // Reduced from 20 to 10
    getCachedCategories(),
    getFeaturedPosts()
  ])
  
  let allPublishedPosts = sanityPosts
  let featuredPost: any = null
  let useSanity = true
  
  if (allPublishedPosts.length === 0) {
    // Fallback to Prisma with parallel fetching
    useSanity = false
    const [prismaData, featuredData] = await Promise.all([
      getAllPosts({ status: Status.PUBLISHED }),
      getFeaturedPost()
    ])
    
    allPublishedPosts = prismaData
    featuredPost = featuredData
    
    if (featuredPost && featuredPost.category) {
      const sanityCategory = sanityCategories.find((cat: any) => 
        cat.slug.current === featuredPost.category.slug || cat.name === featuredPost.category.name
      )
      if (sanityCategory) {
        featuredPost.category = {
          ...featuredPost.category,
          color: sanityCategory.color
        }
      }
    }
    
    allPublishedPosts = allPublishedPosts.map((post: any) => {
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
      return post
    })
  } else {
    featuredPost = featuredPosts[0]
  }
  
  const otherPosts = featuredPost
    ? allPublishedPosts.filter((post: any) => post.slug !== featuredPost.slug)
    : allPublishedPosts

  return (
    <PageWrapper noPadding>
      
      {/* Full-width Featured Post Section */}
      {featuredPost ? (
        <FeaturedPostCard
          title={featuredPost.title}
          excerpt={featuredPost.excerpt || ""}
          date={useSanity 
            ? new Date(featuredPost.publishedAt).toISOString().split('T')[0]
            : featuredPost.publishedAt?.toISOString().split('T')[0] || ""
          }
          slug={featuredPost.slug.current || featuredPost.slug}
          category={useSanity 
            ? (featuredPost.categories?.[0] || { name: "General" })
            : (featuredPost.category || { name: "General" })
          }
          imageUrl={useSanity && featuredPost.featuredImage?.asset
            ? urlFor(featuredPost.featuredImage.asset).width(800).height(500).url()
            : featuredPost.featuredImage?.url || featuredPost.imageUrl
          }
          pullUp={true}
        />
      ) : (
        <div className="w-full bg-black h-[140px] blur-element -mt-[60px] pt-[60px]"></div>
      )}
      
      <main className="max-w-6xl mx-auto px-4 pt-6 flex-grow blur-element">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main content area */}
          <div className="flex-1">

            <h2 className="font-sf-pro-display text-4xl font-bold mb-6">Recent Posts</h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {otherPosts.map((post: any) => (
                <TechCrunchPostCard
                  key={post.slug.current || post.slug}
                  title={post.title}
                  date={useSanity
                    ? post.publishedAt
                    : post.publishedAt?.toISOString() || new Date().toISOString()
                  }
                  slug={post.slug.current || post.slug}
                  category={useSanity
                    ? (post.categories?.[0] || { name: "General" })
                    : (post.category || { name: "General" })
                  }
                  author={useSanity
                    ? post.author
                    : post.author
                  }
                  imageUrl={useSanity && post.featuredImage?.asset
                    ? urlFor(post.featuredImage.asset).width(360).height(240).url()
                    : post.featuredImage?.url || post.imageUrl
                  }
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Client Side */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-20">
              <SidebarWrapper />
            </div>
          </aside>
        </div>
      </main>
    </PageWrapper>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <PageWrapper noPadding>
        <div className="w-full bg-black h-[140px] blur-element -mt-[60px] pt-[60px]"></div>
        <main className="max-w-6xl mx-auto px-4 pt-6 flex-grow blur-element">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h2 className="font-sf-pro-display text-4xl font-bold mb-6">Recent Posts</h2>
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
            <aside className="w-80 flex-shrink-0">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </aside>
          </div>
        </main>
      </PageWrapper>
    }>
      <HomeContent />
    </Suspense>
  )
}
