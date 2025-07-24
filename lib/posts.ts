import { prisma } from './db'
import { Prisma, Status } from '@prisma/client'

// Simple in-memory cache for development
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds for posts
const STATIC_CACHE_TTL = 300000 // 5 minutes for categories/authors (they change less frequently)

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function getCachedStatic<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < STATIC_CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Type definitions that match Prisma models
export type Post = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  status: Status
  featured: boolean
  imageUrl: string | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  categoryId: number | null
  authorId: number
  category: {
    id: number
    name: string
    slug: string
    color: string
  } | null
  author: {
    id: number
    name: string
  }
  tags: {
    tag: {
      id: number
      name: string
      slug: string
    }
  }[]
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  color: string
  createdAt: Date
  updatedAt: Date
}

export type Author = {
  id: number
  name: string
  email: string | null
  bio: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export type Tag = {
  id: number
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface PopularPostInfo {
  title: string
  slug: string
  date: string
}

// Post functions
export async function getPostBySlug(slug: string) {
  const cacheKey = `post-${slug}`
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (post) {
    setCache(cacheKey, post)
  }
  return post
}

export async function getAllPosts(options?: {
  status?: Status
  limit?: number
  offset?: number
  includeRelations?: boolean
}) {
  const cacheKey = `posts-${JSON.stringify(options)}`
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const where: Prisma.PostWhereInput = {}
  
  if (options?.status) {
    where.status = options.status
  }

  const include = options?.includeRelations !== false ? {
    category: true,
    author: true,
    tags: {
      include: {
        tag: true
      }
    }
  } : undefined

  const posts = await prisma.post.findMany({
    where,
    include,
    orderBy: {
      publishedAt: 'desc'
    },
    skip: options?.offset,
    take: options?.limit
  })

  setCache(cacheKey, posts)
  return posts
}

export async function getFeaturedPost() {
  const cacheKey = 'featured-post'
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const post = await prisma.post.findFirst({
    where: {
      featured: true,
      status: Status.PUBLISHED
    },
    include: {
      category: true,
      author: true,
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })

  setCache(cacheKey, post)
  return post
}

export async function getPopularPosts(limit = 7): Promise<PopularPostInfo[]> {
  const cacheKey = `popular-posts-${limit}`
  const cached = getCached<PopularPostInfo[]>(cacheKey)
  if (cached) {
    return cached
  }

  const posts = await prisma.post.findMany({
    where: {
      status: Status.PUBLISHED
    },
    select: {
      title: true,
      slug: true,
      publishedAt: true
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })

  const result = posts.map((post: any) => ({
    title: post.title,
    slug: post.slug,
    date: post.publishedAt?.toISOString().split('T')[0] || ''
  }))

  setCache(cacheKey, result)
  return result
}


export async function createPost(data: {
  title: string
  slug: string
  excerpt?: string
  content: string
  status?: Status
  featured?: boolean
  imageUrl?: string
  categoryId?: number
  authorId: number
  tagIds?: number[]
}) {
  const { tagIds, ...postData } = data
  
  const post = await prisma.post.create({
    data: {
      ...postData,
      publishedAt: data.status === Status.PUBLISHED ? new Date() : null,
      tags: tagIds ? {
        create: tagIds.map(tagId => ({
          tagId
        }))
      } : undefined
    },
    include: {
      category: true,
      author: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  return post
}

export async function updatePost(id: number, data: {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  status?: Status
  featured?: boolean
  imageUrl?: string
  categoryId?: number
  authorId?: number
  tagIds?: number[]
}) {
  const { tagIds, ...postData } = data

  // If status is being changed to PUBLISHED and post wasn't published before
  const currentPost = await prisma.post.findUnique({ where: { id } })
  if (data.status === Status.PUBLISHED && currentPost?.status !== Status.PUBLISHED) {
    (postData as any).publishedAt = new Date()
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...postData,
      tags: tagIds ? {
        deleteMany: {},
        create: tagIds.map(tagId => ({
          tagId
        }))
      } : undefined
    },
    include: {
      category: true,
      author: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  return post
}

export async function deletePost(id: number) {
  try {
    // Leverage CASCADE delete - no need to manually delete PostTag relationships
    // No need to check if post exists first - let Prisma handle the error
    const deletedPost = await prisma.post.delete({
      where: { id },
      select: { 
        id: true, 
        slug: true,
        title: true 
      }
    })

    // Only clear specific cache entries instead of entire cache
    cache.delete('posts-{"includeRelations":true}')
    cache.delete('posts-{"status":"PUBLISHED","includeRelations":true}')
    cache.delete('posts-{"status":"DRAFT","includeRelations":true}')
    cache.delete(`post-${deletedPost.slug}`)
    cache.delete(`post-edit-${deletedPost.slug}`)
    cache.delete('featured-post')
    
    // Clear popular posts cache as well
    const popularPostsKeys = Array.from(cache.keys()).filter(key => key.startsWith('popular-posts-'))
    popularPostsKeys.forEach(key => cache.delete(key))
    
    return { 
      success: true, 
      deletedPost: {
        id: deletedPost.id,
        title: deletedPost.title,
        slug: deletedPost.slug
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      throw new Error(`Post with ID ${id} not found`)
    }
    throw error
  }
}

// Category functions
export async function getAllCategories(bypassCache = false): Promise<Category[]> {
  if (!bypassCache) {
    const cacheKey = 'all-categories'
    const cached = getCachedStatic<Category[]>(cacheKey)
    if (cached) {
      return cached
    }
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  if (!bypassCache) {
    setCache('all-categories', categories)
  }
  return categories
}

export async function getCategoryById(id: number) {
  return await prisma.category.findUnique({
    where: { id }
  })
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug }
  })
}

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  color?: string
}) {
  return await prisma.category.create({
    data
  })
}

export async function updateCategory(id: number, data: {
  name?: string
  slug?: string
  description?: string
  color?: string
}) {
  return await prisma.category.update({
    where: { id },
    data
  })
}

export async function deleteCategory(id: number) {
  return await prisma.category.delete({
    where: { id }
  })
}

// Author functions
export async function getAllAuthors(): Promise<Author[]> {
  const cacheKey = 'all-authors'
  const cached = getCachedStatic<Author[]>(cacheKey)
  if (cached) {
    return cached
  }

  const authors = await prisma.author.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  setCache(cacheKey, authors)
  return authors
}

export async function getAuthorById(id: number) {
  return await prisma.author.findUnique({
    where: { id }
  })
}

export async function createAuthor(data: {
  name: string
  email?: string
  bio?: string
  avatar?: string
}) {
  return await prisma.author.create({
    data
  })
}

export async function updateAuthor(id: number, data: {
  name?: string
  email?: string
  bio?: string
  avatar?: string
}) {
  return await prisma.author.update({
    where: { id },
    data
  })
}

export async function deleteAuthor(id: number) {
  return await prisma.author.delete({
    where: { id }
  })
}

// Tag functions
export async function getAllTags() {
  return await prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getTagById(id: number) {
  return await prisma.tag.findUnique({
    where: { id }
  })
}

export async function getTagBySlug(slug: string) {
  return await prisma.tag.findUnique({
    where: { slug }
  })
}

export async function createTag(data: {
  name: string
  slug: string
}) {
  return await prisma.tag.create({
    data
  })
}

export async function updateTag(id: number, data: {
  name?: string
  slug?: string
}) {
  return await prisma.tag.update({
    where: { id },
    data
  })
}

export async function deleteTag(id: number) {
  return await prisma.tag.delete({
    where: { id }
  })
}

// Utility function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Optimized functions for edit/new post forms - only fetch necessary fields
export async function getPostForEdit(slug: string) {
  const cacheKey = `post-edit-${slug}`
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      status: true,
      featured: true,
      imageUrl: true,
      publishedAt: true,
      categoryId: true,
      authorId: true,
      updatedAt: true,
      // Only get category and author IDs and names - no descriptions, bios, etc.
      category: {
        select: {
          id: true,
          name: true
        }
      },
      author: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (post) {
    setCache(cacheKey, post)
  }
  return post
}

export async function getCategoriesForForm(): Promise<Pick<Category, 'id' | 'name'>[]> {
  const cacheKey = 'categories-form'
  const cached = getCachedStatic<Pick<Category, 'id' | 'name'>[]>(cacheKey)
  if (cached) {
    return cached
  }

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  setCache(cacheKey, categories)
  return categories
}

export async function getAuthorsForForm(): Promise<Pick<Author, 'id' | 'name'>[]> {
  const cacheKey = 'authors-form'
  const cached = getCachedStatic<Pick<Author, 'id' | 'name'>[]>(cacheKey)
  if (cached) {
    return cached
  }

  const authors = await prisma.author.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  setCache(cacheKey, authors)
  return authors
}
