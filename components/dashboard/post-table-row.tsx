"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditIcon, EyeIcon, Calendar } from "lucide-react"
import { Status } from "@prisma/client"
import { DeletePostButton } from "./delete-post-button"

interface PostTableRowProps {
  post: {
    id: number
    title: string
    slug: string
    excerpt?: string | null
    status: Status
    publishedAt?: Date | null
    createdAt: Date
    category?: { name: string } | null
  }
  index: number
  categoryColorMap: { [key: string]: string }
}

export function PostTableRow({ post, index, categoryColorMap }: PostTableRowProps) {
  const router = useRouter()

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj)
  }

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return
    }
    router.push(`/dashboard/edit/${post.slug}`)
  }

  return (
    <TableRow 
      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${
        index === 0 ? '' : ''
      }`}
      onClick={handleRowClick}
    >
      <TableCell className="py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 leading-tight">
            {post.title}
          </span>
          {post.excerpt && (
            <span className="text-sm text-gray-500 mt-1 line-clamp-1">
              {post.excerpt}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`text-xs font-medium border ${
            categoryColorMap[post.category?.name || "General"] || 
            categoryColorMap.General
          }`}
        >
          {post.category?.name || "General"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            post.status === Status.PUBLISHED ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          <span className={`text-sm font-medium ${
            post.status === Status.PUBLISHED ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {post.status === Status.PUBLISHED ? 'Published' : 'Draft'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-sm">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {post.status === Status.PUBLISHED && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <Link href={`/posts/${post.slug}`} target="_blank">
                <EyeIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-700"
          >
            <Link href={`/dashboard/edit/${post.slug}`}>
              <EditIcon className="h-4 w-4" />
            </Link>
          </Button>
          <DeletePostButton postId={post.id} postTitle={post.title} />
        </div>
      </TableCell>
    </TableRow>
  )
} 