import PageWrapper from "@/components/page-wrapper"
import BlogPostCard from "@/components/blog-post-card"
import TechCrunchPostCard from "@/components/techcrunch-post-card"
import FeaturedPostCard from "@/components/featured-post-card"
import PopularTags from "@/components/popular-tags"
import PopularPostsList from "@/components/popular-posts-list"
import StaggerList from "@/components/motion/stagger-list"
import { getPublishedPosts, getFeaturedPosts, getAllSanityTags, getAllCategories, urlFor } from "@/lib/sanity"
import { getAllPosts, getFeaturedPost, getPopularPosts } from "@/lib/posts"
import { Status } from "@prisma/client"

export default async function Home() {
  // Try Sanity first, fallback to Prisma
  let allPublishedPosts = await getPublishedPosts(20)
  let featuredPost: any = null
  let useSanity = true
  
  const sanityCategories = await getAllCategories()
  
  if (allPublishedPosts.length === 0) {
    // Fallback to Prisma
    useSanity = false
    const prismaData = await getAllPosts({ status: Status.PUBLISHED })
    allPublishedPosts = prismaData
    const featuredData = await getFeaturedPost()
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
            <StaggerList className="divide-y divide-gray-200">
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
            </StaggerList>
          </div>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-20">
              <PopularTags tags={popularTagsData.slice(0, 7)} />
              <PopularPostsList posts={popularPostsData} />
            </div>
          </aside>
        </div>
      </main>
    </PageWrapper>
  )
}
