"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PostTableRow } from "./post-table-row"
import { usePosts } from "./posts-provider"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"
import Link from "next/link"

interface PostsListProps {
  categoryColorMap: { [key: string]: string }
}

export function PostsList({ categoryColorMap }: PostsListProps) {
  const { posts } = usePosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <PlusCircleIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first blog post</p>
        <Button asChild className="bg-gray-900 hover:bg-gray-800">
          <Link href="/dashboard/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Create Post
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-100 bg-gray-50/50">
          <TableHead className="font-semibold text-gray-900 py-4">Title</TableHead>
          <TableHead className="font-semibold text-gray-900">Category</TableHead>
          <TableHead className="font-semibold text-gray-900">Status</TableHead>
          <TableHead className="font-semibold text-gray-900">Date</TableHead>
          <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post, index) => (
          <PostTableRow
            key={post.id}
            post={post}
            index={index}
            categoryColorMap={categoryColorMap}
          />
        ))}
      </TableBody>
    </Table>
  )
} 