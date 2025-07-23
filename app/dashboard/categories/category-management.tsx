"use client"

import { useState, useEffect, useCallback, startTransition } from "react"
import { useActionState, useOptimistic, useTransition } from "react"
import { Category } from "@/lib/posts"
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditIcon, Trash2Icon, PlusCircleIcon } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// Component for the category form
function CategoryForm({ 
  initialCategory = null, 
  onCancel,
  onSubmit
}: { 
  initialCategory?: Category | null, 
  onCancel: () => void,
  onSubmit: (formData: FormData, isUpdate: boolean) => Promise<void>
}) {
  const initialState = { message: null, errors: {} }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<any>(null)

  const [name, setName] = useState(initialCategory?.name || "")
  const [slug, setSlug] = useState(initialCategory?.slug || "")

  // Generate slug from name
  const generateSlug = (nameStr: string) => {
    return nameStr
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    // Only auto-generate slug if it's a new category or if the slug was not pre-filled
    if (!initialCategory?.slug || (initialCategory && slug === generateSlug(initialCategory.name))) {
      setSlug(generateSlug(newName))
    }
  }

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true)
    setFormErrors(null)
    
    try {
      // Optimistically close the form and let the parent handle the data
      await onSubmit(formData, !!initialCategory)
      
      // Success - the parent will handle updating the UI
      onCancel()
    } catch (error: any) {
      // If we get validation errors, show them in the form
      if (error.errors) {
        setFormErrors(error.errors)
      } else {
        setFormErrors({
          _form: [error.message || "An error occurred. Please try again."]
        })
      }
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleFormAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={name} 
            onChange={handleNameChange} 
            required 
          />
          {formErrors?.name && <p className="text-xs text-red-500 mt-1">{formErrors.name[0]}</p>}
        </div>
        
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            name="slug" 
            value={slug} 
            onChange={(e) => setSlug(generateSlug(e.target.value))} 
            placeholder="auto-generated-from-name" 
            required 
          />
          {formErrors?.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug[0]}</p>}
        </div>

        {formErrors?._form && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {formErrors._form[0]}
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialCategory ? "Updating..." : "Creating..."}
              </span>
            ) : (
              initialCategory ? "Update Category" : "Create Category"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

// Component for each category row with delete functionality
function CategoryRow({ 
  category, 
  onEdit,
  onDelete
}: { 
  category: Category, 
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => Promise<{ success: boolean, message: string }>
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteMessage(null)
    
    try {
      const result = await onDelete(category)
      
      if (result.success) {
        // Close dialog on success - the parent component will update the UI
        setDeleteDialogOpen(false)
      } else {
        // Show error message but keep dialog open
        setDeleteMessage(result.message)
        setIsDeleting(false)
      }
    } catch (error: any) {
      setDeleteMessage(error.message || "Failed to delete category")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center">
            <div className={`h-4 w-4 rounded-sm mr-2 ${category.color || 'bg-slate-500'}`}></div>
            {category.name}
          </div>
        </TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell className="text-right space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <EditIcon className="mr-1 h-3 w-3" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="bg-transparent text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2Icon className="mr-1 h-3 w-3" /> Delete
          </Button>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{category.name}"?
              {deleteMessage && (
                <div className="text-red-600 mt-2 p-2 bg-red-50 rounded-md">
                  {deleteMessage}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Main client component for category management
export function CategoryManagement({ categories: initialCategories }: { categories: Category[] }) {
  const [optimisticCategories, setOptimisticCategories] = useOptimistic(
    initialCategories,
    (state, action: { type: 'add' | 'update' | 'delete', category: Category }) => {
      switch (action.type) {
        case 'add':
          return [...state, action.category];
        case 'update':
          return state.map(c => 
            c.id === action.category.id ? action.category : c
          );
        case 'delete':
          return state.filter(c => c.id !== action.category.id);
        default:
          return state;
      }
    }
  );
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [pendingActionCount, setPendingActionCount] = useState(0)
  const [isPending, startTransitionState] = useTransition()

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    // Reset the selected category after a short delay to avoid flickering
    setTimeout(() => setSelectedCategory(null), 300)
  }

  // Handle form submission (create or update)
  const handleFormSubmit = useCallback(async (formData: FormData, isUpdate: boolean) => {
    // Extract form data
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    
    // Increment pending count
    setPendingActionCount(count => count + 1)
    
    try {
      if (isUpdate && selectedCategory) {
        // Optimistic update - immediately update the UI
        const optimisticCategory = {
          ...selectedCategory,
          name,
          slug,
        }
        
        // Update optimistic state first, wrapped in startTransition
        startTransition(() => {
          setOptimisticCategories({ type: 'update', category: optimisticCategory })
        })
        
        // Then perform the actual server update
        const result = await updateCategoryAction(selectedCategory.id, { name, slug })
        
        if (result.errors) {
          throw result
        }
      } else {
        // Create a temporary optimistic category with a temporary ID
        const nextColorIndex = optimisticCategories.length % CATEGORY_COLORS.length
        const tempColor = CATEGORY_COLORS[nextColorIndex]
        
        const tempCategory: Category = {
          id: Date.now(), // Temporary ID that will be replaced
          name,
          slug,
          color: tempColor
        }
        
        // Update optimistic state first, wrapped in startTransition
        startTransition(() => {
          setOptimisticCategories({ type: 'add', category: tempCategory })
        })
        
        // Then perform the actual server create
        const result = await createCategoryAction({ name, slug })
        
        if (result.errors) {
          // If there are errors, revert the optimistic update
          startTransition(() => {
            setOptimisticCategories({ type: 'delete', category: tempCategory })
          })
          throw result
        }
      }
    } finally {
      // Decrement pending count whether successful or not
      setPendingActionCount(count => count - 1)
    }
  }, [setOptimisticCategories, selectedCategory, optimisticCategories.length])

  // Handle category deletion
  const handleCategoryDelete = useCallback(async (category: Category) => {
    setPendingActionCount(count => count + 1)
    
    try {
      // First, optimistically remove from UI
      startTransition(() => {
        setOptimisticCategories({ type: 'delete', category })
      })
      
      // Then perform the actual delete
      const result = await deleteCategoryAction(category.id)
      
      // If delete failed, revert the optimistic update
      if (!result.success) {
        startTransition(() => {
          setOptimisticCategories({ type: 'add', category })
        })
      }
      
      return result
    } catch (error) {
      // On error, revert optimistic update
      startTransition(() => {
        setOptimisticCategories({ type: 'add', category })
      })
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete category" 
      }
    } finally {
      setPendingActionCount(count => count - 1)
    }
  }, [setOptimisticCategories])

  // Update from server data when available, but only if we have no pending operations
  useEffect(() => {
    if (pendingActionCount === 0) {
      startTransition(() => {
        setOptimisticCategories(initialCategories)
      })
    }
  }, [initialCategories, pendingActionCount, setOptimisticCategories])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-3xl font-bold font-serif text-gray-900">
          Manage Categories
          {(pendingActionCount > 0 || isPending) && (
            <span className="inline-flex items-center ml-3 text-sm font-normal text-amber-600">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving changes...
            </span>
          )}
        </h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Categories</CardTitle>
          <CardDescription>
            Manage the categories for your blog posts. Categories help organize your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimisticCategories.map((category) => (
                <CategoryRow 
                  key={category.id} 
                  category={category} 
                  onEdit={handleEditCategory}
                  onDelete={handleCategoryDelete}
                />
              ))}
              {optimisticCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    No categories found. Create your first category to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory 
                ? "Update the details for this category." 
                : "Create a new category for your blog posts."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            initialCategory={selectedCategory} 
            onCancel={handleCloseDialog}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Import these colors from the db module to use in optimistic UI updates
// This needs to match the CATEGORY_COLORS in the db module
const CATEGORY_COLORS = [
  "bg-slate-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-indigo-500",
  "bg-green-500",
  "bg-red-500",
  "bg-blue-500",
];
