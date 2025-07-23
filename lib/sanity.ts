import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
interface PortableTextBlock {
  _type: string
  style?: string
  children?: Array<{
    text: string
    marks?: string[]
  }>
  code?: string
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export function portableTextToHtml(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return ''
  }
  
  return blocks.map(block => {
    if (block._type === 'block') {
      const style = block.style || 'normal'
      const children = block.children?.map((child: any) => {
        let text = child.text || ''
        
        if (child.marks?.includes('strong')) {
          text = `<strong>${text}</strong>`
        }
        if (child.marks?.includes('em')) {
          text = `<em>${text}</em>`
        }
        if (child.marks?.includes('code')) {
          text = `<code>${text}</code>`
        }
        
        return text
      }).join('') || ''
      
      switch (style) {
        case 'h1':
          return `<h1>${children}</h1>`
        case 'h2':
          return `<h2>${children}</h2>`
        case 'h3':
          return `<h3>${children}</h3>`
        case 'blockquote':
          return `<blockquote>${children}</blockquote>`
        default:
          return `<p>${children}</p>`
      }
    } else if (block._type === 'code') {
      return `<pre><code>${block.code || ''}</code></pre>`
    }
    
    return ''
  }).join('\n')
}

export function getPlainTextFromPortableText(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return ''
  }
  
  return blocks.map(block => {
    if (block._type === 'block') {
      return block.children?.map((child: any) => child.text || '').join('') || ''
    }
    return ''
  }).join(' ').trim()
}

export async function getPublishedPosts(limit?: number) {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && status == "PUBLISHED"] | order(publishedAt desc) [0...${limit || 10}] {
        _id,
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        status,
        featured,
        publishedAt,
        author->{
          _id,
          name,
          bio,
          avatar
        },
        categories[]->{
          _id,
          name,
          slug,
          description,
          color
        },
        tags[]->{
          _id,
          name,
          slug
        }
      }`
    )
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug && status == "PUBLISHED"][0] {
        _id,
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        status,
        featured,
        publishedAt,
        author->{
          _id,
          name,
          bio,
          avatar
        },
        categories[]->{
          _id,
          name,
          slug,
          description,
          color
        },
        tags[]->{
          _id,
          name,
          slug
        }
      }`,
      { slug }
    )
    return post
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function getFeaturedPosts() {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && status == "PUBLISHED" && featured == true] | order(publishedAt desc) [0...5] {
        _id,
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        status,
        featured,
        publishedAt,
        author->{
          _id,
          name,
          bio,
          avatar
        },
        categories[]->{
          _id,
          name,
          slug,
          description,
          color
        },
        tags[]->{
          _id,
          name,
          slug
        }
      }`
    )
    return posts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && status == "PUBLISHED" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        status,
        featured,
        publishedAt,
        author->{
          _id,
          name,
          bio,
          avatar
        },
        categories[]->{
          _id,
          name,
          slug,
          description,
          color
        },
        tags[]->{
          _id,
          name,
          slug
        }
      }`,
      { categorySlug }
    )
    return posts
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

export async function getAllCategories() {
  try {
    const categories = await client.fetch(
      `*[_type == "category"] | order(name asc) {
        _id,
        name,
        slug,
        description,
        color
      }`
    )
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
