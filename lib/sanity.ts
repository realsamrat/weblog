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
  language?: string
  filename?: string
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
        case 'h4':
          return `<h4>${children}</h4>`
        case 'h5':
          return `<h5>${children}</h5>`
        case 'h6':
          return `<h6>${children}</h6>`
        case 'blockquote':
          return `<blockquote>${children}</blockquote>`
        default:
          return `<p>${children}</p>`
      }
    } else if (block._type === 'code') {
      return `<pre><code>${block.code || ''}</code></pre>`
    } else if (block._type === 'image') {
      const imageBlock = block as any
      if (imageBlock.asset) {
        const imageUrl = urlFor(imageBlock.asset).url()
        const alt = imageBlock.alt || ''
        const caption = imageBlock.caption || ''
        
        let html = `<img src="${imageUrl}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 1rem auto;" />`
        
        if (caption) {
          html = `<figure style="margin: 1rem 0; text-align: center;">
            ${html}
            <figcaption style="margin-top: 0.5rem; font-style: italic; color: #666; font-size: 0.9em;">${caption}</figcaption>
          </figure>`
        }
        
        return html
      }
    } else if (block._type === 'codeBlock') {
      const codeBlock = block as any
      const language = codeBlock.language || 'plaintext'
      const code = codeBlock.code || ''
      const filename = codeBlock.filename || ''
      
      let html = `<pre><code class="language-${language}">${code}</code></pre>`
      
      if (filename) {
        html = `<div class="code-block-container">
          <div class="code-block-header">${filename}</div>
          ${html}
        </div>`
      }
      
      return html
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
        },
        keywords
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
        },
        keywords
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
        },
        keywords
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
        },
        keywords
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

export function extractKeywordsFromContent(content: any[]): string[] {
  if (!content || !Array.isArray(content)) {
    return []
  }
  
  const text = getPlainTextFromPortableText(content)
  
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'way', 'she', 'use', 'your', 'said', 'each', 'make', 'most', 'over', 'such', 'very', 'what', 'with', 'have', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'will', 'when', 'come', 'here', 'just', 'like', 'long', 'many', 'than', 'them', 'well', 'were'])
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
  
  const wordCount: Record<string, number> = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  const keywords = Object.entries(wordCount)
    .filter(([, count]) => count >= 2) // Must appear at least twice
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8) // Limit to 8 keywords
    .map(([word]) => word)
  
  return keywords
}
