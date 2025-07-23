"use client"

import { createContext, useContext, useState, useOptimistic, ReactNode, startTransition } from "react"
import { Status } from "@prisma/client"

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  status: Status
  publishedAt?: Date | null
  createdAt: Date
  category?: { name: string } | null
}

interface PostsContextType {
  posts: Post[]
  deletePostOptimistic: (postId: number) => void
  addPostBack: (post: { id: number; title: string }) => void
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

interface PostsProviderProps {
  children: ReactNode
  initialPosts: Post[]
}

type PostAction = 
  | { type: 'DELETE'; postId: number }
  | { type: 'RESTORE'; post: { id: number; title: string } }

export function PostsProvider({ children, initialPosts }: PostsProviderProps) {
  const [posts, optimisticUpdatePosts] = useOptimistic(
    initialPosts,
    (state: Post[], action: PostAction) => {
      switch (action.type) {
        case 'DELETE':
          return state.filter(post => post.id !== action.postId)
        case 'RESTORE':
          // Find the original post from initialPosts to restore it properly
          const originalPost = initialPosts.find(p => p.id === action.post.id)
          if (originalPost && !state.find(p => p.id === action.post.id)) {
            // Insert the post back in its original position
            const newState = [...state]
            const originalIndex = initialPosts.findIndex(p => p.id === action.post.id)
            newState.splice(originalIndex, 0, originalPost)
            return newState
          }
          return state
        default:
          return state
      }
    }
  )

  const deletePostOptimistic = (postId: number) => {
    startTransition(() => {
      optimisticUpdatePosts({ type: 'DELETE', postId })
    })
  }

  const addPostBack = (post: { id: number; title: string }) => {
    startTransition(() => {
      optimisticUpdatePosts({ type: 'RESTORE', post })
    })
  }

  return (
    <PostsContext.Provider value={{
      posts,
      deletePostOptimistic,
      addPostBack
    }}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider')
  }
  return context
} 