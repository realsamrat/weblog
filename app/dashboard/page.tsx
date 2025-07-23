import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"

export default async function DashboardPostsPage() {

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-1">Dashboard temporarily disabled - migrating to Sanity CMS</p>
        </div>
        <Button asChild className="bg-gray-900 hover:bg-gray-800">
          <Link href="/dashboard/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">Dashboard is being migrated to use Sanity CMS. Please use the Sanity Studio at /studio for content management.</p>
      </div>
    </div>
  )
}
