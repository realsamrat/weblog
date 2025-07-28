'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load sidebar components
const PopularTags = dynamic(() => import('@/components/popular-tags'), {
  loading: () => <SidebarSkeleton type="tags" />,
  ssr: false
})

const PopularPostsList = dynamic(() => import('@/components/popular-posts-list'), {
  loading: () => <SidebarSkeleton type="posts" />,
  ssr: false
})

interface SidebarData {
  popularPosts: Array<{
    title: string
    slug: string
    date: string
  }>
  popularTags: Array<{
    _id: string
    name: string
    slug: { current: string }
    postCount: number
  }>
}

function SidebarSkeleton({ type }: { type: 'tags' | 'posts' }) {
  if (type === 'tags') {
    return (
      <div className="mb-10 blur-element animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-3"></div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="blur-element animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-3"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
        ))}
      </div>
    </div>
  )
}

export default function SidebarWrapper() {
  const [data, setData] = useState<SidebarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/sidebar')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (error) {
    return null // Gracefully hide sidebar on error
  }

  if (loading || !data) {
    return (
      <>
        <SidebarSkeleton type="tags" />
        <SidebarSkeleton type="posts" />
      </>
    )
  }

  return (
    <>
      <PopularTags tags={data.popularTags} />
      <PopularPostsList posts={data.popularPosts} />
    </>
  )
}