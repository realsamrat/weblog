import { getAllCategories } from "@/lib/posts"
import { CategoryManagement } from "./category-management"

// Set up server-side revalidation
export const dynamic = 'force-static';
export const revalidate = 60; // Revalidate every 60 seconds

// Server component for the Categories page
export default async function CategoriesPage() {
  const categories = await getAllCategories()
  
  return <CategoryManagement categories={categories} />
}
