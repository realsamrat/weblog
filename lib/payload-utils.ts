import type { Payload } from 'payload'

let cachedPayload: Payload | null = null

export async function getPayloadClient(): Promise<Payload | null> {
  if (cachedPayload) {
    return cachedPayload
  }

  try {
    if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
      console.warn('Payload CMS: Missing required environment variables')
      return null
    }

    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    
    cachedPayload = await getPayload({ 
      config: config.default 
    })
    
    return cachedPayload
  } catch (error) {
    console.error('Failed to initialize Payload:', error)
    return null
  }
}

export async function getPublishedPosts(limit?: number) {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      console.warn('Payload client not available, returning empty array')
      return []
    }
    
    const posts = await payload.find({
      collection: 'payload_posts',
      where: {
        status: {
          equals: 'PUBLISHED',
        },
      },
      sort: '-publishedAt',
      limit: limit || 10,
      depth: 2,
    })
    
    return posts.docs
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return null
    }
    
    const posts = await payload.find({
      collection: 'payload_posts',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'PUBLISHED',
        },
      },
      depth: 2,
      limit: 1,
    })
    
    return posts.docs[0] || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function getFeaturedPosts() {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return []
    }
    
    const posts = await payload.find({
      collection: 'payload_posts',
      where: {
        and: [
          {
            status: {
              equals: 'PUBLISHED',
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
      sort: '-publishedAt',
      limit: 5,
      depth: 2,
    })
    
    return posts.docs
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return []
    }
    
    // First get the category
    const categories = await payload.find({
      collection: 'payload_categories',
      where: {
        slug: {
          equals: categorySlug,
        },
      },
      limit: 1,
    })
    
    if (!categories.docs[0]) return []
    
    const posts = await payload.find({
      collection: 'payload_posts',
      where: {
        and: [
          {
            status: {
              equals: 'PUBLISHED',
            },
          },
          {
            categories: {
              contains: categories.docs[0].id,
            },
          },
        ],
      },
      sort: '-publishedAt',
      depth: 2,
    })
    
    return posts.docs
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

export async function getAllCategories() {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return []
    }
    
    const categories = await payload.find({
      collection: 'payload_categories',
      limit: 100,
    })
    
    return categories.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}