import { NextResponse } from 'next/server'
import { getPopularPosts } from '@/lib/posts'
import { getPublishedPosts } from '@/lib/sanity'
import { getCachedSanityTags } from '@/lib/cached-data'

export async function GET() {
  try {
    const [prismaPopularPosts, sanityPosts, popularTags] = await Promise.all([
      getPopularPosts(7),
      getPublishedPosts(7),
      getCachedSanityTags()
    ])

    // Use Sanity posts if available, otherwise fallback to Prisma
    const popularPosts = sanityPosts.length > 0 
      ? sanityPosts.map((post: any) => ({
          title: post.title,
          slug: post.slug.current,
          date: new Date(post.publishedAt).toISOString().split('T')[0]
        }))
      : prismaPopularPosts

    return NextResponse.json({
      popularPosts,
      popularTags: popularTags.slice(0, 7)
    })
  } catch (error) {
    console.error('Error fetching sidebar data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sidebar data' },
      { status: 500 }
    )
  }
}