import { client } from './sanity-client'
import { groq } from 'next-sanity'

export type SanityPost = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  content: unknown[]
  status: 'draft' | 'published'
  featured: boolean
  image?: {
    asset: {
      _ref: string
      url: string
    }
  }
  publishedAt?: string
  category?: {
    _id: string
    name: string
    slug: { current: string }
    color: string
  }
  author: {
    _id: string
    name: string
    slug: { current: string }
    email?: string
    bio?: string
    image?: {
      asset: {
        _ref: string
        url: string
      }
    }
  }
  tags?: Array<{
    _id: string
    name: string
    slug: { current: string }
  }>
}

export type SanityCategory = {
  _id: string
  name: string
  slug: { current: string }
  color: string
  description?: string
}

export type SanityAuthor = {
  _id: string
  name: string
  slug: { current: string }
  email?: string
  bio?: string
  image?: {
    asset: {
      _ref: string
      url: string
    }
  }
}

export type SanityTag = {
  _id: string
  name: string
  slug: { current: string }
  description?: string
}

const postFields = groq`
  _id,
  title,
  slug,
  excerpt,
  content,
  status,
  featured,
  image,
  publishedAt,
  category->{
    _id,
    name,
    slug,
    color
  },
  author->{
    _id,
    name,
    slug,
    email,
    bio,
    image
  },
  tags[]->{
    _id,
    name,
    slug
  }
`

export async function getPublishedPosts(limit: number = 20): Promise<SanityPost[]> {
  const query = groq`
    *[_type == "post" && status == "published"] | order(publishedAt desc)[0...${limit}] {
      ${postFields}
    }
  `
  
  try {
    const posts = await client.fetch(query)
    return posts || []
  } catch (error) {
    console.error('Error fetching published posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  const query = groq`
    *[_type == "post" && slug.current == $slug][0] {
      ${postFields}
    }
  `
  
  try {
    const post = await client.fetch(query, { slug })
    return post || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function getFeaturedPosts(limit: number = 5): Promise<SanityPost[]> {
  const query = groq`
    *[_type == "post" && status == "published" && featured == true] | order(publishedAt desc)[0...${limit}] {
      ${postFields}
    }
  `
  
  try {
    const posts = await client.fetch(query)
    return posts || []
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostsByCategory(categorySlug: string, limit: number = 10): Promise<SanityPost[]> {
  const query = groq`
    *[_type == "post" && status == "published" && category->slug.current == $categorySlug] | order(publishedAt desc)[0...${limit}] {
      ${postFields}
    }
  `
  
  try {
    const posts = await client.fetch(query, { categorySlug })
    return posts || []
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

export async function getAllCategories(): Promise<SanityCategory[]> {
  const query = groq`
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      color,
      description
    }
  `
  
  try {
    const categories = await client.fetch(query)
    return categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getAllAuthors(): Promise<SanityAuthor[]> {
  const query = groq`
    *[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      email,
      bio,
      image
    }
  `
  
  try {
    const authors = await client.fetch(query)
    return authors || []
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

export async function getAllTags(): Promise<SanityTag[]> {
  const query = groq`
    *[_type == "tag"] | order(name asc) {
      _id,
      name,
      slug,
      description
    }
  `
  
  try {
    const tags = await client.fetch(query)
    return tags || []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function getPopularPosts(limit: number = 7): Promise<{ title: string; slug: string; date: string }[]> {
  const query = groq`
    *[_type == "post" && status == "published"] | order(publishedAt desc)[0...${limit}] {
      ${postFields}
    }
  `
  
  try {
    const posts = await client.fetch(query)
    return (posts || []).map((post: SanityPost) => ({
      title: post.title,
      slug: post.slug.current,
      date: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : ''
    }))
  } catch (error) {
    console.error('Error fetching popular posts:', error)
    return []
  }
}

export async function getPopularKeywords(limit: number = 7): Promise<{ name: string; count: number }[]> {
  const query = groq`
    *[_type == "tag"] | order(name asc)[0...${limit}] {
      _id,
      name,
      slug,
      description
    }
  `
  
  try {
    const tags = await client.fetch(query)
    return (tags || []).map((tag: SanityTag) => ({
      name: tag.name,
      count: Math.floor(Math.random() * 1000) + 100 // Mock count for now
    }))
  } catch (error) {
    console.error('Error fetching popular keywords:', error)
    return []
  }
}
