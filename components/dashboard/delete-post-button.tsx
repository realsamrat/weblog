"use client"

import { Button } from "@/components/ui/button"
import { Trash2Icon, Loader2 } from "lucide-react"
import { simpleDeletePostAction } from "@/app/dashboard/actions"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { usePosts } from "./posts-provider"

interface DeletePostButtonProps {
  postId: number
  postTitle: string
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { deletePostOptimistic, addPostBack } = usePosts()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    
    // Optimistic update - remove from UI immediately
    const postToRestore = { id: postId, title: postTitle }
    deletePostOptimistic(postId)
    
    // Show immediate feedback
    toast({
      title: "Deleting...",
      description: `Removing "${postTitle}"`,
      variant: "default",
    })
    
    try {
      const formData = new FormData()
      formData.append('id', postId.toString())
      
      const result = await simpleDeletePostAction(formData)
      
      if (result.success) {
        // Success - show confirmation
        toast({
          title: "Success",
          description: result.message,
          variant: "default",
        })
      } else {
        // Failed - restore the post in UI and show error
        addPostBack(postToRestore)
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      // Failed - restore the post in UI and show error
      addPostBack(postToRestore)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the post.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2Icon className="h-4 w-4" />
      )}
    </Button>
  )
} 