import { getAllCategories } from "@/lib/posts"
import { CategoryManagement } from "./category-management"

// Server component for the Categories page
export default async function CategoriesPage() {
  const categories = await getAllCategories()
  
  return <CategoryManagement categories={categories} />
}
