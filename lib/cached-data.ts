import { unstable_cache } from 'next/cache'
import { getAllCategories as getSanityCategories, getAllSanityTags, getTagsWithCounts } from './sanity'
import { getAllCategories as getPrismaCategories, getAllTags as getPrismaTags } from './posts'

// Cache categories for 1 hour
export const getCachedCategories = unstable_cache(
  async () => {
    const categories = await getSanityCategories()
    return categories
  },
  ['all-categories'],
  {
    revalidate: 3600, // 1 hour
    tags: ['categories']
  }
)

// Cache Sanity tags for 1 hour
export const getCachedSanityTags = unstable_cache(
  async () => {
    const tags = await getAllSanityTags()
    return tags
  },
  ['all-sanity-tags'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tags']
  }
)

// Cache Prisma categories for 1 hour
export const getCachedPrismaCategories = unstable_cache(
  async () => {
    const categories = await getPrismaCategories()
    return categories
  },
  ['all-prisma-categories'],
  {
    revalidate: 3600, // 1 hour
    tags: ['prisma-categories']
  }
)

// Cache Prisma tags for 1 hour
export const getCachedPrismaTags = unstable_cache(
  async () => {
    const tags = await getPrismaTags()
    return tags
  },
  ['all-prisma-tags'],
  {
    revalidate: 3600, // 1 hour
    tags: ['prisma-tags']
  }
)

// Cache tags with counts for 30 minutes
export const getCachedTagsWithCounts = unstable_cache(
  async (tagIds: string[]) => {
    const tagsWithCounts = await getTagsWithCounts(tagIds)
    return tagsWithCounts
  },
  ['tags-with-counts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['tags-counts']
  }
)