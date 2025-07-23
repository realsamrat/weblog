import { Suspense } from "react"
import PostForm from "@/components/dashboard/post-form"
import { getPostForEdit, getCategoriesForForm, getAuthorsForForm } from "@/lib/posts"
import { notFound } from "next/navigation"
import { unstable_cache } from "next/cache"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

interface EditPostPageProps {
  params: Promise<{ slug: string }>
}

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

// Separate component for the form to enable streaming
async function EditPostForm({ slug }: { slug: string }): Promise<React.JSX.Element> {
  // Fetch optimized post data and cached categories/authors in parallel
  const [postResult, categoriesResult, authorsResult] = await Promise.all([
    getPostForEdit(slug), // Uses optimized query with select fields
    getCachedCategoriesForForm(), // Only fetches id and name
    getCachedAuthorsForForm() // Only fetches id and name
  ])

  if (!postResult) {
    notFound()
  }

  const post = postResult as any
  const categories = Array.isArray(categoriesResult) ? categoriesResult : []
  const authors = Array.isArray(authorsResult) ? authorsResult : []

  return <PostForm initialData={post} categories={categories} authors={authors} />
}

// Loading fallback component
function EditPostFormSkeleton() {
  return (
    <div className="flex gap-6">
      {/* Main Content Area */}
      <div className="flex-1 relative">
        <Card className="w-full">
          <CardContent className="space-y-6 pt-6">
            {/* Quick skeleton for immediate feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-96 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
          <div className="border-t border-gray-200"></div>
          <CardFooter className="pt-3">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <Suspense fallback={<EditPostFormSkeleton />}>
        <EditPostForm slug={slug} />
      </Suspense>
    </div>
  )
}
