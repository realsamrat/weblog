import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { extractKeywordsFromContent } from '../../../lib/sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const post = await client.fetch(
      `*[_type == "post" && _id == $postId][0] { content }`,
      { postId }
    )
    
    if (post && post.content) {
      const keywords = extractKeywordsFromContent(post.content)
      await client.patch(postId).set({ keywords }).commit()
      return NextResponse.json({ success: true, keywords })
    }
    
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  } catch (error) {
    console.error('Error generating keywords:', error)
    return NextResponse.json({ error: 'Failed to generate keywords' }, { status: 500 })
  }
}
