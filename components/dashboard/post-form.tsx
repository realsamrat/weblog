"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react"
import type { Post, Category, Author } from "@/lib/posts"
import { createPostAction, updatePostAction, autoSavePostAction } from "@/app/dashboard/actions"
import { sanitizeHtml, legacyMarkdownToHtml, isHtmlContent } from "@/lib/markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Save, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useDashboard } from "./dashboard-provider"
import dynamic from "next/dynamic"

// Lazy load the heavy RichTextEditor component
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor").then(mod => ({ default: mod.RichTextEditor })), {
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center border rounded-md bg-gray-50"><Loader2 className="h-6 w-6 animate-spin" /></div>
})

// Minimal types for form usage - only need id and name
type CategoryForForm = Pick<Category, 'id' | 'name'>
type AuthorForForm = Pick<Author, 'id' | 'name'>

interface PostFormProps {
  initialData?: Post | null
  categories: CategoryForForm[]
  authors: AuthorForForm[]
}

export default function PostForm({ initialData = null, categories, authors }: PostFormProps) {
  const { toast } = useToast()
  const dashboardContext = useDashboard()
  const { setPageTitle, setHeaderActions, isReady } = dashboardContext
  const [isSaving, setIsSaving] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const [isClient, setIsClient] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [authorId, setAuthorId] = useState<string>("")
  const [date, setDate] = useState("")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [status, setStatus] = useState<"published" | "draft">("draft")
  const [excerpt, setExcerpt] = useState("")
  const [featured, setFeatured] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  // Auto-save and network state
  const [isOnline, setIsOnline] = useState(true)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastAutoSaveContent, setLastAutoSaveContent] = useState<string>("")
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(false)
  const justSavedRef = useRef(false)

  // Client-side only effect to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Network status detection - only on client
  useEffect(() => {
    if (!isClient) return

    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Connection restored",
        description: "You're back online!",
        variant: "default",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Connection lost",
        description: "You're offline. Changes will be saved when connection is restored.",
        variant: "destructive",
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [toast, isClient])

  // Load initial data
  useEffect(() => {
    async function loadContent() {
      if (initialData && initialData.id) {
        // Populate form with existing data for editing
        const initialCategoryId = initialData.categoryId?.toString() || (categories.length > 0 ? categories[0].id.toString() : "")
        const initialAuthorId = initialData.authorId?.toString() || (authors.length > 0 ? authors[0].id.toString() : "")
        
        setTitle(initialData.title || "")
        setSlug(initialData.slug || "")
        setCategoryId(initialCategoryId)
        setAuthorId(initialAuthorId)
        setDate(initialData.publishedAt?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0])
        setSelectedTagIds([]) // Tags will need to be handled separately
        
        // Handle content - store HTML directly
        const rawContent = initialData.content || ""
        
        if (isHtmlContent(rawContent)) {
          // Content is already HTML, use directly
          const sanitizedContent = sanitizeHtml(rawContent)
          setHtmlContent(sanitizedContent)
          setContent(sanitizedContent)
        } else {
          // Legacy markdown content, convert to HTML once
          const htmlFromMarkdown = await legacyMarkdownToHtml(rawContent)
          setHtmlContent(htmlFromMarkdown)
          setContent(htmlFromMarkdown)
        }
        
        setStatus(initialData.status === "PUBLISHED" ? "published" : "draft")
        setExcerpt(initialData.excerpt || "")
        setFeatured(initialData.featured || false)
        setImageUrl(initialData.imageUrl || "")
        
        setLastSaved(initialData.updatedAt || new Date())
        initialLoadRef.current = true
      } else {
        // Reset form for new post
        const defaultCategoryId = categories.length > 0 ? categories[0].id.toString() : ""
        const defaultAuthorId = authors.length > 0 ? authors[0].id.toString() : ""
        
        setTitle("")
        setSlug("")
        setCategoryId(defaultCategoryId)
        setAuthorId(defaultAuthorId)
        setDate(new Date().toISOString().split("T")[0])
        setSelectedTagIds([])
        setContent("")
        setHtmlContent("")
        setStatus("draft")
        setExcerpt("")
        setFeatured(false)
        setImageUrl("")
        initialLoadRef.current = true
      }
    }
    
    loadContent()
  }, [initialData, categories, authors])

  // Smart auto-save functionality
  const performAutoSave = useCallback(async () => {
    // Enhanced validation for auto-save - works for both new and existing posts
    if (!isOnline || !hasUnsavedChanges) return
    if (!authorId || !categoryId || !title.trim()) return
    
    // Skip auto-save if manual save is in progress
    if (isSaving) return

    // Skip if auto-save is already in progress
    if (autoSaveStatus === 'saving') return

    // Skip auto-save for new posts (no ID yet) - only auto-save existing posts
    if (!initialData?.id) {
      console.log('Skipping auto-save for new post - no ID yet')
      return
    }

    // Skip if content hasn't actually changed since last auto-save
    const currentContent = JSON.stringify({ title, slug, content, excerpt, status, featured, categoryId, authorId, imageUrl })
    if (currentContent === lastAutoSaveContent) {
      setHasUnsavedChanges(false)
      return
    }

    setAutoSaveStatus('saving')
    
    try {
      // Validate required fields before sending
      const parsedCategoryId = parseInt(categoryId)
      const parsedAuthorId = parseInt(authorId)
      
      if (isNaN(parsedCategoryId) || isNaN(parsedAuthorId)) {
        console.warn('Invalid category or author ID for auto-save')
        setAutoSaveStatus('error')
        setTimeout(() => setAutoSaveStatus('idle'), 5000)
        return
      }

      // Add timeout for auto-save to prevent hanging
      const autoSavePromise = autoSavePostAction(initialData.id, {
        title: title.trim(),
        slug: slug.trim(),
        content,
        excerpt: excerpt.trim(),
        status: 'draft', // Always save as draft for auto-save
        featured,
        categoryId: parsedCategoryId,
        authorId: parsedAuthorId,
        imageUrl: imageUrl?.trim() || undefined,
      })

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Auto-save timeout')), 10000)
      )

      const result = await Promise.race([autoSavePromise, timeoutPromise])

      if (result.success) {
        setAutoSaveStatus('saved')
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        setLastAutoSaveContent(currentContent)
        
        setTimeout(() => setAutoSaveStatus('idle'), 3000)
      } else {
        console.warn('Auto-save failed:', result.message)
        setAutoSaveStatus('error')
        setTimeout(() => setAutoSaveStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('Auto-save error:', error)
      setAutoSaveStatus('error')
      setTimeout(() => setAutoSaveStatus('idle'), 5000)
    }
  }, [initialData?.id, isOnline, hasUnsavedChanges, isSaving, autoSaveStatus, lastAutoSaveContent, title, slug, content, excerpt, status, featured, categoryId, authorId, imageUrl])

  // Smart auto-save when content changes
  useEffect(() => {
    if (!initialLoadRef.current) return

    // Don't mark as unsaved if we just saved successfully
    if (isSaving || justSavedRef.current) return

    setHasUnsavedChanges(true)
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Auto-save if we have the required fields (works for both new and existing posts)
    if (authorId && categoryId && title.trim()) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave()
      }, 5000) // Auto-save after 5 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [title, slug, content, excerpt, status, featured, categoryId, authorId, imageUrl, performAutoSave, initialData?.id, isSaving])

  // Clear form errors when form data changes
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      setFormErrors({})
    }
  }, [title, slug, content, excerpt, categoryId, authorId, formErrors])

  const generateSlug = (titleStr: string) => {
    return titleStr
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Only auto-generate slug if it's a new post (no initialData) or if the slug was not pre-filled from initialData
    if (!initialData?.slug || (initialData && slug === generateSlug(initialData.title))) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleContentChange = (html: string) => {
    const sanitizedHtml = sanitizeHtml(html)
    setHtmlContent(sanitizedHtml)
    // Store HTML directly - no conversion needed
    setContent(sanitizedHtml)
  }

  const handleManualSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields - check for empty strings too
    if (!authorId || !categoryId || authorId.trim() === "" || categoryId.trim() === "") {
      toast({
        title: "Missing required fields",
        description: "Please select both an author and category.",
        variant: "destructive",
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your post.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    setFormErrors({})

    // Pause auto-save during manual save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    try {
      const formData = new FormData()
      if (initialData?.id) formData.append("id", initialData.id.toString())
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("excerpt", excerpt)
      formData.append("content", content)
      formData.append("date", date)
      formData.append("status", status)
      formData.append("featured", featured.toString())
      formData.append("category_id", categoryId)
      formData.append("author_id", authorId)
      formData.append("image_url", imageUrl)
      formData.append("stayOnPage", "true") // Stay on the same page

      const action = initialData ? updatePostAction : createPostAction
      
      // Add timeout to prevent hanging
      const savePromise = action({}, formData)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Save timeout')), 15000)
      )
      
      const result = await Promise.race([savePromise, timeoutPromise]) as { success?: boolean; message?: string; errors?: any }

      if (result.success === true) {
        toast({
          title: "Success!",
          description: result.message || "Post saved successfully!",
          variant: "default",
        })
        setHasUnsavedChanges(false)
        setLastSaved(new Date())
        
        // Set flag to prevent immediate "unsaved changes" detection
        justSavedRef.current = true
        setTimeout(() => {
          justSavedRef.current = false
        }, 2000) // Wait 2 seconds before allowing unsaved changes detection again
      } else {
        toast({
          title: "Save failed",
          description: result.message || "An error occurred while saving.",
          variant: "destructive",
        })
        if (result.errors) {
          setFormErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Manual save error:', error)
      const isTimeout = error instanceof Error && error.message === 'Save timeout'
      toast({
        title: "Save failed",
        description: isTimeout 
          ? "Save operation timed out. Please check your connection and try again."
          : "An unexpected error occurred while saving. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [isOnline, authorId, categoryId, title, toast, initialData, slug, excerpt, content, date, status, featured, imageUrl])

  // Set page title and header actions
  useEffect(() => {
    const pageTitle = initialData ? "Edit Post" : "Add New Post"
    setPageTitle(pageTitle)
    
    // Cleanup on unmount
    return () => {
      setPageTitle("Dashboard")
      setHeaderActions(null)
    }
  }, [initialData, setPageTitle, setHeaderActions])

  // Separate effect for header actions to avoid infinite loops
  useEffect(() => {
    const SaveButton = () => (
      <Button 
        type="submit" 
        disabled={isSaving || !isOnline}
        onClick={(e) => {
          e.preventDefault()
          handleManualSave(e as any)
        }}
      >
        {isSaving ? (
          <>
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    )
    
    setHeaderActions(<SaveButton />)
  }, [isSaving, isOnline, setHeaderActions, handleManualSave])

  const currentCategoryId = categoryId || (categories.length > 0 ? categories[0].id.toString() : "")
  const currentAuthorId = authorId || (authors.length > 0 ? authors[0].id.toString() : "")

  const getAutoSaveStatusInfo = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return { icon: Clock, text: 'Auto-saving...', color: 'bg-blue-500' }
      case 'saved':
        return { icon: CheckCircle, text: 'Auto-saved', color: 'bg-green-500' }
      case 'error':
        return { icon: AlertCircle, text: 'Auto-save failed', color: 'bg-red-500' }
      default:
        return null
    }
  }

  const autoSaveInfo = getAutoSaveStatusInfo()

  const SaveButton = ({ className = "" }: { className?: string }) => (
    <Button 
      type="submit" 
      disabled={isSaving || !isOnline}
      className={className}
    >
      {isSaving ? (
        <>
          <Clock className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          {initialData ? "Save Changes" : "Create Post"}
        </>
      )}
    </Button>
  )

  // Don't render form until client-side to prevent hydration issues
  if (!isClient || !isReady) {
    return (
      <div className="flex gap-6">
        <div className="flex-1 relative">
          <Card className="w-full">
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="w-80">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <form onSubmit={handleManualSave}>
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1 relative">
            <Card className="w-full">
              <CardContent className="space-y-6 pt-6">
                {initialData && <input type="hidden" name="id" value={initialData.id} />}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={title} onChange={handleTitleChange} required />
                    {formErrors?.title && <p className="text-xs text-red-500 mt-1">{formErrors.title[0]}</p>}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug (URL Path)</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      placeholder="auto-generated-from-title"
                      required
                    />
                    {formErrors?.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug[0]}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
                      {selectedTagIds.length === 0 ? (
                        <span className="text-gray-500 text-sm">No tags selected</span>
                      ) : (
                        selectedTagIds.map((tagId) => {
                          const tag = availableTags.find(t => t._id === tagId)
                          return tag ? (
                            <span key={tagId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {tag.name}
                              <button
                                type="button"
                                onClick={() => setSelectedTagIds(prev => prev.filter(id => id !== tagId))}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ) : null
                        })
                      )}
                    </div>
                    <select
                      onChange={(e) => {
                        const tagId = e.target.value
                        if (tagId && !selectedTagIds.includes(tagId)) {
                          setSelectedTagIds(prev => [...prev, tagId])
                        }
                        e.target.value = ""
                      }}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="">Add a tag...</option>
                      {availableTags
                        .filter(tag => !selectedTagIds.includes(tag._id))
                        .map(tag => (
                          <option key={tag._id} value={tag._id}>
                            {tag.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {formErrors?.tags && <p className="text-xs text-red-500 mt-1">{formErrors.tags[0]}</p>}
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief summary of the post for previews."
                    rows={3}
                  />
                  {formErrors?.excerpt && <p className="text-xs text-red-500 mt-1">{formErrors.excerpt[0]}</p>}
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <input type="hidden" name="content" value={content} />
                  <Suspense fallback={
                    <div className="border rounded-lg">
                      <div className="border-b p-2 flex gap-1">
                        {[...Array(8)].map((_, i) => (
                          <Skeleton key={i} className="h-8 w-8" />
                        ))}
                      </div>
                      <div className="p-4 space-y-3 min-h-[400px]">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="text-center mt-8">
                          <Skeleton className="h-6 w-32 mx-auto" />
                        </div>
                      </div>
                    </div>
                  }>
                    {isClient && (
                      <RichTextEditor
                        key={`editor-${initialData?.id || 'new'}`}
                        content={htmlContent}
                        onChange={handleContentChange}
                        placeholder="Write your post content here. You can use formatting tools in the toolbar or shortcut keys."
                        className="min-h-[400px]"
                      />
                    )}
                  </Suspense>
                  <p className="text-xs text-gray-500 mt-3">
                    Use the toolbar to format your content. You can add headers, lists, code blocks, images, links, and custom alert blocks. The editor is resizable - drag the bottom-right corner to adjust height.
                  </p>
                  {formErrors?.content && <p className="text-xs text-red-500 mt-1">{formErrors.content[0]}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6 sticky top-0 self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Connection and Auto-save Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                      {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                      {isOnline ? "Online" : "Offline"}
                    </Badge>
                    {autoSaveInfo && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <autoSaveInfo.icon className="h-3 w-3" />
                        {autoSaveInfo.text}
                      </Badge>
                    )}
                    {hasUnsavedChanges && (
                      <Badge variant="outline" className="text-orange-600">
                        Unsaved Changes
                      </Badge>
                    )}
                  </div>
                  {lastSaved && (
                    <p className="text-xs text-gray-500">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category_id" value={currentCategoryId} onValueChange={(value) => {
                    setCategoryId(value)
                  }} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors?.category_id && <p className="text-xs text-red-500 mt-1">{formErrors.category_id[0]}</p>}
                </div>

                {/* Author */}
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Select name="author_id" value={currentAuthorId} onValueChange={(value) => {
                    setAuthorId(value)
                  }} required>
                    <SelectTrigger id="author">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id.toString()}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors?.author_id && <p className="text-xs text-red-500 mt-1">{formErrors.author_id[0]}</p>}
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  {formErrors?.date && <p className="text-xs text-red-500 mt-1">{formErrors.date[0]}</p>}
                </div>

                {/* Post Status */}
                <div>
                  <Label htmlFor="status">Post Status</Label>
                  <Select name="status" value={status} onValueChange={(value) => setStatus(value as "published" | "draft")}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Post */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    name="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(!!checked)}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>

                {/* Image URL */}
                <div>
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg or /placeholder.svg"
                  />
                  {formErrors?.image_url && <p className="text-xs text-red-500 mt-1">{formErrors.image_url[0]}</p>}
                </div>
              </CardContent>
              
              {/* Divider and Save Button in Sidebar Footer */}
              <div className="border-t border-gray-200"></div>
              <CardFooter className="pt-3">
                <SaveButton className="w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
