"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useCallback } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './dropdown-menu'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Settings, Plus, Trash2, Grid3X3, Grid2X2, LayoutGrid, Upload, X, Move, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImage {
  src: string
  alt?: string
  caption?: string
  id: string
}

const ImageGalleryComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const { images = [], columns = 2, gap = 'md', aspectRatio = 'auto', align = 'left' } = node.attrs

  const [showControls, setShowControls] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addImageDialogOpen, setAddImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = useCallback(async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    try {
      const uploadPromises = files.map(file => uploadImage(file))
      const urls = await Promise.all(uploadPromises)
      
      const newImages = urls.map((url: string, index: number) => ({
        id: `img-${Date.now()}-${index}`,
        src: url,
        alt: files[index].name,
        caption: ''
      }))

      updateAttributes({
        images: [...images, ...newImages]
      })
    } catch (error) {
      alert('Failed to upload images')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [images, updateAttributes, uploadImage])

  const addImageFromUrl = () => {
    if (!imageUrl.trim()) return

    const newImage: GalleryImage = {
      id: `img-${Date.now()}`,
      src: imageUrl.trim(),
      alt: imageCaption || 'Gallery image',
      caption: imageCaption
    }

    updateAttributes({
      images: [...images, newImage]
    })

    setImageUrl('')
    setImageCaption('')
    setAddImageDialogOpen(false)
  }

  const removeImage = (imageId: string) => {
    const newImages = images.filter((img: GalleryImage) => img.id !== imageId)
    
    // If no images left, delete the entire gallery node
    if (newImages.length === 0) {
      deleteNode()
    } else {
      updateAttributes({
        images: newImages
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImageId(imageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault()
    
    if (!draggedImageId || draggedImageId === targetImageId) {
      setDraggedImageId(null)
      return
    }

    const draggedIndex = images.findIndex((img: GalleryImage) => img.id === draggedImageId)
    const targetIndex = images.findIndex((img: GalleryImage) => img.id === targetImageId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newImages = [...images]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)

    updateAttributes({ images: newImages })
    setDraggedImageId(null)
  }

  const getGridClasses = () => {
    const baseClasses = "grid gap-2 w-full"
    const gapClasses = {
      sm: "gap-1",
      md: "gap-2", 
      lg: "gap-4"
    }
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    }

    return cn(
      baseClasses,
      gapClasses[gap as keyof typeof gapClasses],
      columnClasses[columns as keyof typeof columnClasses]
    )
  }

  const getContainerAlignmentClasses = () => {
    switch (align) {
      case 'center':
        return 'flex justify-center'
      case 'right':
        return 'flex justify-end'
      default:
        return 'flex justify-start'
    }
  }

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case '4/3':
        return 'aspect-[4/3]'
      case '16/9':
        return 'aspect-video'
      default:
        return ''
    }
  }

  // Fixed dropdown handlers with proper event management
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownOpen(!dropdownOpen)
  }

  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open)
    if (open) {
      setShowControls(true)
    }
  }

  const handleDropdownItemClick = (action: () => void) => {
    return (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      action()
      // Keep dropdown open for visual feedback, close after a short delay
      setTimeout(() => setDropdownOpen(false), 100)
    }
  }

  return (
    <NodeViewWrapper className={cn("my-6 relative group", getContainerAlignmentClasses())}>
      <div 
        className="relative w-full"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (!dropdownOpen && !addImageDialogOpen) {
            setShowControls(false)
          }
        }}
      >
        {/* Gallery Controls */}
        {showControls && (
          <div className="absolute top-2 right-2 z-50 flex gap-1">
            <Dialog open={addImageDialogOpen} onOpenChange={setAddImageDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
                  title="Add images"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md z-[10002]">
                <DialogHeader>
                  <DialogTitle>Add Images to Gallery</DialogTitle>
                  <DialogDescription>
                    Upload multiple images or add from URL
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Files</TabsTrigger>
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center relative">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">Upload Images</p>
                      <p className="text-xs text-muted-foreground mb-3">Select multiple images</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="text-xs text-muted-foreground">Uploading...</div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="imageCaption">Caption (optional)</Label>
                      <Input
                        id="imageCaption"
                        placeholder="Image caption..."
                        value={imageCaption}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageCaption(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddImageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addImageFromUrl} disabled={!imageUrl.trim()}>
                        Add Image
                      </Button>
                    </DialogFooter>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <DropdownMenu 
              open={dropdownOpen} 
              onOpenChange={handleDropdownOpenChange}
            >
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
                  title="Gallery settings"
                  onClick={handleSettingsClick}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom" 
                className="z-[10001] w-48"
                sideOffset={4}
                onCloseAutoFocus={(e) => {
                  e.preventDefault()
                }}
                onEscapeKeyDown={(e) => {
                  e.preventDefault()
                  setDropdownOpen(false)
                }}
                onPointerDownOutside={(e) => {
                  // Only close if clicking outside the trigger button
                  const target = e.target as Element
                  if (!target.closest('[data-radix-dropdown-menu-trigger]')) {
                    setDropdownOpen(false)
                  }
                }}
              >
                <DropdownMenuLabel>Layout</DropdownMenuLabel>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ columns: 1 }))}>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  1 Column {columns === 1 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ columns: 2 }))}>
                  <Grid2X2 className="h-4 w-4 mr-2" />
                  2 Columns {columns === 2 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ columns: 3 }))}>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  3 Columns {columns === 3 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ columns: 4 }))}>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  4 Columns {columns === 4 && '✓'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Alignment</DropdownMenuLabel>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ align: 'left' }))}>
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Left {align === 'left' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ align: 'center' }))}>
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Center {align === 'center' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ align: 'right' }))}>
                  <AlignRight className="h-4 w-4 mr-2" />
                  Right {align === 'right' && '✓'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Aspect Ratio</DropdownMenuLabel>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ aspectRatio: 'auto' }))}>
                  Auto {aspectRatio === 'auto' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ aspectRatio: 'square' }))}>
                  Square {aspectRatio === 'square' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ aspectRatio: '4/3' }))}>
                  4:3 {aspectRatio === '4/3' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ aspectRatio: '16/9' }))}>
                  16:9 {aspectRatio === '16/9' && '✓'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Gap</DropdownMenuLabel>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ gap: 'sm' }))}>
                  Small {gap === 'sm' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ gap: 'md' }))}>
                  Medium {gap === 'md' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownItemClick(() => updateAttributes({ gap: 'lg' }))}>
                  Large {gap === 'lg' && '✓'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={handleDropdownItemClick(() => {
                    deleteNode()
                    setDropdownOpen(false)
                  })}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Gallery
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Gallery Content */}
        {images.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <LayoutGrid className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Gallery</h3>
            <p className="text-gray-500 mb-4">Add images to create your gallery</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setAddImageDialogOpen(true)}
                className="inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Images
              </Button>
              <Button
                variant="outline"
                onClick={() => deleteNode()}
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Remove Gallery
              </Button>
            </div>
          </div>
        ) : (
          <div className={getGridClasses()}>
            {images.map((image: GalleryImage, index: number) => (
              <div
                key={image.id}
                className={cn(
                  "relative group/image cursor-move",
                  getAspectRatioClasses(),
                  draggedImageId === image.id && "opacity-50"
                )}
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image.id)}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover rounded-md transition-all duration-200",
                    aspectRatio !== 'auto' ? "absolute inset-0" : "block"
                  )}
                  loading="lazy"
                />
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-200 rounded-md">
                  <div className="absolute top-1 right-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeImage(image.id)
                      }}
                      className="h-6 w-6 p-0 bg-red-500/80 hover:bg-red-600 text-white rounded"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="absolute top-1 left-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Move className="h-3 w-3" />
                      Drag
                    </div>
                  </div>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b-md">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Gallery Info */}
        {images.length > 0 && showControls && (
          <div className="absolute -bottom-6 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity delay-300 pointer-events-none">
            {images.length} image{images.length !== 1 ? 's' : ''} • {columns} column{columns !== 1 ? 's' : ''} • Drag to reorder
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const ImageGallery = Node.create({
  name: 'imageGallery',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const data = element.getAttribute('data-images')
          console.log('ImageGallery parseHTML: Raw data-images attribute:', data)
          try {
            if (!data || data === 'undefined' || data === 'null') {
              console.log('ImageGallery parseHTML: No valid data, returning empty array')
              return []
            }
            const parsed = JSON.parse(data)
            console.log('ImageGallery parseHTML: Successfully parsed images:', parsed)
            return Array.isArray(parsed) ? parsed : []
          } catch (error) {
            console.error('ImageGallery parseHTML: Failed to parse gallery images:', error, 'Raw data:', data)
            return []
          }
        },
        renderHTML: attributes => {
          const images = attributes.images || []
          console.log('ImageGallery renderHTML: Rendering images to data-images:', images)
          return {
            'data-images': JSON.stringify(images),
          }
        },
      },
      columns: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute('data-columns') || '2'),
        renderHTML: attributes => ({
          'data-columns': attributes.columns.toString(),
        }),
      },
      gap: {
        default: 'md',
        parseHTML: element => element.getAttribute('data-gap') || 'md',
        renderHTML: attributes => ({
          'data-gap': attributes.gap,
        }),
      },
      aspectRatio: {
        default: 'auto',
        parseHTML: element => element.getAttribute('data-aspect-ratio') || 'auto',
        renderHTML: attributes => ({
          'data-aspect-ratio': attributes.aspectRatio,
        }),
      },
      align: {
        default: 'left',
        parseHTML: element => element.getAttribute('data-align') || 'left',
        renderHTML: attributes => ({
          'data-align': attributes.align,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-gallery"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { images, columns, gap, aspectRatio, align } = HTMLAttributes
    
    // If no images, return empty div instead of null
    if (!images || images.length === 0) {
      return ['div', { 'data-type': 'image-gallery' }]
    }

    // Build grid classes for HTML output
    const getGridStyles = () => {
      const gapValues = {
        sm: '0.25rem',
        md: '0.5rem', 
        lg: '1rem'
      }
      const gapValue = gapValues[gap as keyof typeof gapValues] || '0.5rem'
      
      let gridCols = '1fr'
      if (columns === 2) gridCols = 'repeat(2, 1fr)'
      else if (columns === 3) gridCols = 'repeat(3, 1fr)'
      else if (columns === 4) gridCols = 'repeat(4, 1fr)'
      
      return `display: grid; grid-template-columns: ${gridCols}; gap: ${gapValue}; width: 100%;`
    }

    // Build container alignment
    const getContainerStyles = () => {
      const baseStyles = 'margin: 1.5rem 0;'
      switch (align) {
        case 'center': return baseStyles + ' text-align: center;'
        case 'right': return baseStyles + ' text-align: right;'
        default: return baseStyles
      }
    }

    // Build aspect ratio styles
    const getAspectRatioStyles = () => {
      switch (aspectRatio) {
        case 'square': return 'aspect-ratio: 1/1; position: relative;'
        case '4/3': return 'aspect-ratio: 4/3; position: relative;'
        case '16/9': return 'aspect-ratio: 16/9; position: relative;'
        default: return 'position: relative;'
      }
    }

    // Create image elements for HTML output
    const imageElements = images.map((image: any) => {
      const imageStyle = aspectRatio !== 'auto' 
        ? 'width: 100%; height: 100%; object-fit: cover; border-radius: 0.375rem; position: absolute; top: 0; left: 0;'
        : 'width: 100%; height: auto; object-fit: cover; border-radius: 0.375rem; display: block;'

      const elements = [
        'img',
        {
          src: image.src,
          alt: image.alt || 'Gallery image',
          style: imageStyle,
          loading: 'lazy'
        }
      ]

      // Add caption if exists
      if (image.caption) {
        return [
          'div',
          {
            style: getAspectRatioStyles()
          },
          elements,
          [
            'div',
            {
              style: 'position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 0.75rem; padding: 0.5rem; border-radius: 0 0 0.375rem 0.375rem;'
            },
            image.caption
          ]
        ]
      }

      return [
        'div',
        {
          style: getAspectRatioStyles()
        },
        elements
      ]
    })

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'image-gallery',
        'data-images': JSON.stringify(images),
        'data-columns': columns.toString(),
        'data-gap': gap,
        'data-aspect-ratio': aspectRatio,
        'data-align': align,
        style: getContainerStyles(),
      }),
      [
        'div',
        {
          style: getGridStyles(),
        },
        ...imageElements,
      ],
    ]
  },

  addCommands() {
    return {
      setImageGallery: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageGalleryComponent)
  },
}) 