import PostForm from "@/components/dashboard/post-form"
import { getCategoriesForForm, getAuthorsForForm } from "@/lib/posts"
import { unstable_cache } from "next/cache"

// Cache categories and authors since they don't change often
const getCachedCategoriesForForm = unstable_cache(
  async () => getCategoriesForForm(),
  ['dashboard-categories-form'],
  { revalidate: 300 } // Cache for 5 minutes
)

const getCachedAuthorsForForm = unstable_cache(
  async () => getAuthorsForForm(),
  ['dashboard-authors-form'],
  { revalidate: 300 } // Cache for 5 minutes
)

export default async function NewPostPage() {
  // Fetch cached categories and authors in parallel for better performance
  const [categories, authors] = await Promise.all([
    getCachedCategoriesForForm(), // Only fetches id and name
    getCachedAuthorsForForm() // Only fetches id and name
  ])

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <PostForm categories={categories} authors={authors} />
    </div>
  )
}
