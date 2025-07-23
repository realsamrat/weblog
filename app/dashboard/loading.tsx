import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircleIcon } from "lucide-react"

export default function DashboardLoading() {
  // Create an array of 5 items for skeleton rows
  const skeletonRows = Array(5).fill(null)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 w-full">
        <Skeleton className="h-10 w-64" />
        <Button disabled>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Post
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Title</TableHead>
              <TableHead className="w-1/6">Category</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Date</TableHead>
              <TableHead className="text-right w-1/6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Skeleton className="h-8 w-16 inline-block mr-2" />
                  <Skeleton className="h-8 w-20 inline-block" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
