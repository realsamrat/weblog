"use server"

import { createPost, updatePost, deletePost, getPostBySlug, getAllCategories, getAllAuthors, generateSlug } from "@/lib/posts"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Define Status enum locally to match Prisma schema
enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

const PostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  status: z.nativeEnum(Status),
  featured: z.preprocess((val) => val === "on" || val === true, z.boolean().default(false)),
  category_id: z.coerce.number().int().positive().optional(),
  author_id: z.coerce.number().int().positive(),
  image_url: z.string().url().optional().or(z.literal("")),
})

export async function createPostAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string; errors?: any; success?: boolean }> {
  try {
    // Convert status to uppercase for enum validation
    const statusValue = formData.get("status") as string
    const normalizedStatus = statusValue === "published" ? "PUBLISHED" : "DRAFT"

    const validatedFields = PostSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug") || generateSlug(formData.get("title") as string),
      excerpt: formData.get("excerpt") || "",
      content: formData.get("content") || "",
      date: formData.get("date"),
      status: normalizedStatus,
      featured: formData.get("featured"),
      category_id: formData.get("category_id"),
      author_id: formData.get("author_id"),
      image_url: formData.get("image_url") || "",
    })

    if (!validatedFields.success) {
      console.error("Validation errors:", validatedFields.error.flatten().fieldErrors)
      return {
        message: "Invalid form data.",
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      }
    }

    const { date, category_id, author_id, image_url, ...data } = validatedFields.data

    await createPost({
      ...data,
      content: data.content || "",
      categoryId: category_id || undefined,
      authorId: author_id,
      imageUrl: image_url || undefined,
    })

    revalidatePath("/dashboard")
    revalidatePath("/")
  } catch (error) {
    console.error("Error creating post:", error)
    
    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes('connection') || error.message.includes('Connection')) {
        return {
          message: "Database connection error. Please check your internet connection and try again.",
          success: false,
        }
      }
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return {
          message: "Request timed out. Please try again.",
          success: false,
        }
      }
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return {
          message: "A post with this slug already exists. Please use a different title or slug.",
          success: false,
        }
      }
    }
    
    return {
      message: "Error creating post. Please try again.",
      success: false,
    }
  }

  redirect("/dashboard")
}

export async function updatePostAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string; errors?: any; success?: boolean }> {
  try {
    const id = parseInt(formData.get("id") as string)
    const stayOnPage = formData.get("stayOnPage") === "true"
    
    // Convert status to uppercase for enum validation
    const statusValue = formData.get("status") as string
    const normalizedStatus = statusValue === "published" ? "PUBLISHED" : "DRAFT"
    
    const validatedFields = PostSchema.safeParse({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: (formData.get("excerpt") as string) || "",
      content: (formData.get("content") as string) || "",
      date: formData.get("date") as string,
      status: normalizedStatus,
      featured: formData.get("featured"),
      category_id: formData.get("category_id") as string,
      author_id: formData.get("author_id") as string,
      image_url: (formData.get("image_url") as string) || "",
    })

    if (!validatedFields.success) {
      console.error("Validation errors:", validatedFields.error.flatten().fieldErrors)
      return {
        message: "Invalid form data.",
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      }
    }

    const { date, category_id, author_id, image_url, ...data } = validatedFields.data

    await updatePost(id, {
      ...data,
      content: data.content || "",
      categoryId: category_id || undefined,
      authorId: author_id || undefined,
      imageUrl: image_url || undefined,
    })

    revalidatePath("/dashboard")
    revalidatePath("/")
    revalidatePath(`/posts/${data.slug}`)
    
    if (stayOnPage) {
      return {
        message: "Post updated successfully!",
        success: true,
      }
    }
  } catch (error) {
    console.error("Error updating post:", error)
    
    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes('connection') || error.message.includes('Connection')) {
        return {
          message: "Database connection error. Please check your internet connection and try again.",
          success: false,
        }
      }
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return {
          message: "Request timed out. Please try again.",
          success: false,
        }
      }
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        return {
          message: "A post with this slug already exists. Please use a different slug.",
          success: false,
        }
      }
      if (error.message.includes('not found') || error.message.includes('Record to update not found')) {
        return {
          message: "Post not found. It may have been deleted by another user.",
          success: false,
        }
      }
    }
    
    return {
      message: "Error updating post. Please try again.",
      success: false,
    }
  }

  redirect("/dashboard")
}

export async function deletePostAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string; errors?: any }> {
  try {
    const id = parseInt(formData.get("id") as string)
    
    await deletePost(id)

    revalidatePath("/dashboard")
    revalidatePath("/")

    return {
      message: "Post deleted successfully.",
    }
  } catch (error) {
    console.error("Error deleting post:", error)
    return {
      message: "Error deleting post. Please try again.",
    }
  }
}

export async function simpleDeletePostAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const idValue = formData.get("id")
    if (!idValue) {
      return {
        success: false,
        message: "No post ID provided"
      }
    }
    
    const id = parseInt(idValue.toString())
    if (isNaN(id)) {
      return {
        success: false,
        message: "Invalid post ID"
      }
    }
    
    const result = await deletePost(id)
    
    // Only revalidate specific paths to improve performance
    revalidatePath("/dashboard")
    revalidatePath("/")
    
    return {
      success: true,
      message: `Post "${result.deletedPost.title}" deleted successfully`
    }
  } catch (error) {
    console.error("Error deleting post:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return {
          success: false,
          message: "Post not found. It may have already been deleted."
        }
      }
      return {
        success: false,
        message: error.message
      }
    }
    
    return {
      success: false,
      message: "Failed to delete post. Please try again."
    }
  }
}

export async function autoSavePostAction(
  id: number,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status: string;
    featured: boolean;
    categoryId?: number;
    authorId: number;
    imageUrl?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // Convert status to uppercase for enum validation
    const normalizedStatus = data.status === "published" ? "PUBLISHED" : "DRAFT"
    
    const validatedFields = PostSchema.safeParse({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || "",
      content: data.content || "",
      date: new Date().toISOString().split("T")[0], // Use current date for auto-save
      status: normalizedStatus,
      featured: data.featured,
      category_id: data.categoryId,
      author_id: data.authorId,
      image_url: data.imageUrl || "",
    })

    if (!validatedFields.success) {
      console.error("Auto-save validation errors:", validatedFields.error.flatten().fieldErrors)
      return {
        success: false,
        message: "Invalid data for auto-save.",
      }
    }

    const { date, category_id, author_id, image_url, ...postData } = validatedFields.data

    await updatePost(id, {
      ...postData,
      content: postData.content || "",
      categoryId: category_id || undefined,
      authorId: author_id || undefined,
      imageUrl: image_url || undefined,
    })

    // Don't revalidate paths for auto-save to avoid unnecessary re-renders
    
    return {
      success: true,
      message: "Auto-saved successfully",
    }
  } catch (error) {
    console.error("Error auto-saving post:", error)
    return {
      success: false,
      message: "Auto-save failed",
    }
  }
}
