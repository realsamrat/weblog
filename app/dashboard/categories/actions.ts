"use server"

import { revalidatePath } from "next/cache"

// For the simple file-based system, categories are read-only
// These actions are kept for interface compatibility but return appropriate messages

export async function createCategoryAction(
  formData: FormData | { name: string; slug: string }
): Promise<{ message?: string; errors?: any }> {
  return {
    message: "Categories are currently read-only in this simplified blog system.",
  }
}

export async function updateCategoryAction(
  id: number,
  formData: FormData | { name: string; slug: string }
): Promise<{ message?: string; errors?: any }> {
  return {
    message: "Categories are currently read-only in this simplified blog system.",
  }
}

export async function deleteCategoryAction(
  id: number
): Promise<{ success: boolean; message: string }> {
  return {
    success: false,
    message: "Categories are currently read-only in this simplified blog system.",
  }
}
