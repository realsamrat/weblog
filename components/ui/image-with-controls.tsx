"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub
} from './dropdown-menu'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Settings, AlignLeft, AlignCenter, AlignRight, Maximize2, RotateCcw, Trash2, Download, Lock, Unlock, RectangleHorizontal, Crop } from 'lucide-react'
import { cn } from '@/lib/utils'

const ImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [isResizing, setIsResizing] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 })
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true)
  const [showDimensionInput, setShowDimensionInput] = useState(false)
  const [tempWidth, setTempWidth] = useState('')
  const [tempHeight, setTempHeight] = useState('')
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const { src, alt, width, height, align = 'left', aspectRatio } = node.attrs

  // Handle image load to set initial dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      
      setNaturalDimensions({ width: naturalWidth, height: naturalHeight })
      
      if (!width && !height) {
        // Set initial dimensions to natural size, but constrain to max width
        const maxWidth = 600
        const scaleFactor = naturalWidth > maxWidth ? maxWidth / naturalWidth : 1
        const initialWidth = Math.round(naturalWidth * scaleFactor)
        const initialHeight = Math.round(naturalHeight * scaleFactor)
        
        updateAttributes({
          width: initialWidth,
          height: initialHeight,
          aspectRatio: naturalHeight / naturalWidth,
        })
      } else if (!aspectRatio) {
        // Set aspect ratio if not already set
        updateAttributes({
          aspectRatio: naturalHeight / naturalWidth,
        })
      }
    }
    setImageLoaded(true)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showControls || !imageRef.current) return
      
      // Only handle shortcuts when the image container is focused/hovered
      const container = containerRef.current
      if (!container || !container.matches(':hover')) return
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        deleteNode()
      } else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault()
        resetToOriginalSize()
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault()
        setAspectRatioLocked(!aspectRatioLocked)
      } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault()
        handleAlignmentChange('left')
      } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault()
        handleAlignmentChange('center')
      } else if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault()
        handleAlignmentChange('right')
      } else if (e.key === 'ArrowUp' && e.shiftKey) {
        e.preventDefault()
        resizeByStep(-10)
      } else if (e.key === 'ArrowDown' && e.shiftKey) {
        e.preventDefault()
        resizeByStep(10)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showControls, aspectRatioLocked])

  const resizeByStep = (step: number) => {
    if (!width || !height) return
    
    const newWidth = Math.max(50, Math.min(1200, width + step))
    let newHeight = height
    
    if (aspectRatioLocked && aspectRatio) {
      newHeight = Math.round(newWidth * aspectRatio)
    }
    
    updateAttributes({
      width: newWidth,
      height: newHeight,
    })
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return
      
      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y
      
      // Use the larger delta for more responsive resizing
      const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY
      
      const newWidth = Math.max(50, Math.min(1200, startPos.current.width + delta))
      let newHeight: number
      
      if (aspectRatioLocked && aspectRatio) {
        newHeight = newWidth * aspectRatio
      } else {
        const currentAspectRatio = startPos.current.height / startPos.current.width
        newHeight = newWidth * currentAspectRatio
      }
      
      updateAttributes({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [updateAttributes, aspectRatioLocked, aspectRatio])

  const handleAlignmentChange = (newAlign: string) => {
    updateAttributes({ align: newAlign })
  }

  const handlePresetSize = (preset: string) => {
    if (!naturalDimensions.width || !naturalDimensions.height) return
    
    let newWidth: number
    let newHeight: number
    
    switch (preset) {
      case 'small':
        newWidth = Math.min(300, naturalDimensions.width)
        break
      case 'medium':
        newWidth = Math.min(600, naturalDimensions.width)
        break
      case 'large':
        newWidth = Math.min(900, naturalDimensions.width)
        break
      case 'original':
        newWidth = naturalDimensions.width
        break
      default:
        return
    }
    
    const targetAspectRatio = aspectRatioLocked && aspectRatio ? aspectRatio : naturalDimensions.height / naturalDimensions.width
    newHeight = newWidth * targetAspectRatio
    
    updateAttributes({
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    })
  }

  const handleAspectRatioPreset = (ratio: string) => {
    if (!width) return
    
    let newAspectRatio: number
    let newHeight: number
    
    switch (ratio) {
      case '1:1':
        newAspectRatio = 1
        break
      case '4:3':
        newAspectRatio = 3/4
        break
      case '16:9':
        newAspectRatio = 9/16
        break
      case '3:2':
        newAspectRatio = 2/3
        break
      case 'original':
        newAspectRatio = naturalDimensions.height / naturalDimensions.width
        break
      default:
        return
    }
    
    newHeight = Math.round(width * newAspectRatio)
    
    updateAttributes({
      height: newHeight,
      aspectRatio: newAspectRatio,
    })
  }

  const resetToOriginalSize = () => {
    if (naturalDimensions.width && naturalDimensions.height) {
      updateAttributes({
        width: naturalDimensions.width,
        height: naturalDimensions.height,
        aspectRatio: naturalDimensions.height / naturalDimensions.width,
      })
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = alt || 'image'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleDimensionSubmit = () => {
    const newWidth = parseInt(tempWidth)
    const newHeight = parseInt(tempHeight)
    
    if (newWidth > 0 && newHeight > 0) {
      updateAttributes({
        width: newWidth,
        height: newHeight,
        aspectRatio: aspectRatioLocked ? newHeight / newWidth : aspectRatio,
      })
    }
    
    setShowDimensionInput(false)
    setTempWidth('')
    setTempHeight('')
  }

  const getAlignmentClasses = () => {
    switch (align) {
      case 'center':
        return 'mx-auto'
      case 'right':
        return 'ml-auto'
      default:
        return 'mr-auto'
    }
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

  const getCurrentSize = () => {
    if (!width || !naturalDimensions.width) return 'custom'
    
    const ratio = width / naturalDimensions.width
    if (ratio <= 0.35) return 'small'
    if (ratio <= 0.65) return 'medium'
    if (ratio <= 0.95) return 'large'
    return 'original'
  }

  const getCurrentAspectRatio = () => {
    if (!width || !height) return 'custom'
    
    const ratio = height / width
    if (Math.abs(ratio - 1) < 0.01) return '1:1'
    if (Math.abs(ratio - 3/4) < 0.01) return '4:3'
    if (Math.abs(ratio - 9/16) < 0.01) return '16:9'
    if (Math.abs(ratio - 2/3) < 0.01) return '3:2'
    if (Math.abs(ratio - (naturalDimensions.height / naturalDimensions.width)) < 0.01) return 'original'
    return 'custom'
  }

  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open)
    if (open) {
      setShowControls(true)
    }
  }

  return (
    <NodeViewWrapper className={cn("my-4 relative group", getContainerAlignmentClasses())}>
      <div 
        ref={containerRef}
        className={cn(
          "relative inline-block transition-all duration-200 rounded-md",
          showControls && "shadow-md"
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (!dropdownOpen && !showDimensionInput) {
            setShowControls(false)
          }
        }}
        tabIndex={0}
      >
        {/* Image Controls */}
        {showControls && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setAspectRatioLocked(!aspectRatioLocked)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                "h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded",
                aspectRatioLocked ? "bg-blue-500/70" : ""
              )}
              title={`${aspectRatioLocked ? 'Unlock' : 'Lock'} aspect ratio (Ctrl+L)`}
            >
              {aspectRatioLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                resetToOriginalSize()
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
              title="Reset to original size (Ctrl+R)"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            
            <DropdownMenu 
              open={dropdownOpen} 
              onOpenChange={handleDropdownOpenChange}
            >
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
                  title="Image settings"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom" 
                className="z-[10001] w-56"
                sideOffset={4}
                onCloseAutoFocus={(e) => {
                  e.preventDefault()
                  // Only hide controls if dropdown is actually closed
                  setTimeout(() => {
                    if (!dropdownOpen) {
                      setShowControls(false)
                    }
                  }, 150)
                }}
              >
                <DropdownMenuLabel>Alignment</DropdownMenuLabel>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleAlignmentChange('left')
                  setDropdownOpen(false)
                }}>
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Left {align === 'left' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleAlignmentChange('center')
                  setDropdownOpen(false)
                }}>
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Center {align === 'center' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleAlignmentChange('right')
                  setDropdownOpen(false)
                }}>
                  <AlignRight className="h-4 w-4 mr-2" />
                  Right {align === 'right' && '✓'}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Size Presets</DropdownMenuLabel>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handlePresetSize('small')
                  setDropdownOpen(false)
                }}>
                  Small (300px) {getCurrentSize() === 'small' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handlePresetSize('medium')
                  setDropdownOpen(false)
                }}>
                  Medium (600px) {getCurrentSize() === 'medium' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handlePresetSize('large')
                  setDropdownOpen(false)
                }}>
                  Large (900px) {getCurrentSize() === 'large' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handlePresetSize('original')
                  setDropdownOpen(false)
                }}>
                  Original ({naturalDimensions.width}px) {getCurrentSize() === 'original' && '✓'}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <RectangleHorizontal className="h-4 w-4 mr-2" />
                    Aspect Ratio
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem 
                      checked={aspectRatioLocked}
                      onCheckedChange={setAspectRatioLocked}
                    >
                      Lock Aspect Ratio
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleAspectRatioPreset('1:1')
                    }}>
                      Square (1:1) {getCurrentAspectRatio() === '1:1' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleAspectRatioPreset('4:3')
                    }}>
                      Standard (4:3) {getCurrentAspectRatio() === '4:3' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleAspectRatioPreset('16:9')
                    }}>
                      Widescreen (16:9) {getCurrentAspectRatio() === '16:9' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleAspectRatioPreset('3:2')
                    }}>
                      Photo (3:2) {getCurrentAspectRatio() === '3:2' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleAspectRatioPreset('original')
                    }}>
                      Original {getCurrentAspectRatio() === 'original' && '✓'}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  setTempWidth(width?.toString() || '')
                  setTempHeight(height?.toString() || '')
                  setShowDimensionInput(true)
                  setDropdownOpen(false)
                }}>
                  <Crop className="h-4 w-4 mr-2" />
                  Custom Dimensions
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                  setDropdownOpen(false)
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNode()
                    setDropdownOpen(false)
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Custom Dimensions Input */}
        {showDimensionInput && (
          <div className="absolute top-2 left-2 z-10 bg-white rounded-md shadow-lg border p-3 min-w-[200px]">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Custom Dimensions</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Width"
                    value={tempWidth}
                    onChange={(e) => setTempWidth(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Height"
                    value={tempHeight}
                    onChange={(e) => setTempHeight(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  onClick={handleDimensionSubmit}
                  className="h-6 text-xs flex-1"
                >
                  Apply
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowDimensionInput(false)}
                  className="h-6 text-xs flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image */}
        <img
          ref={imageRef}
          src={src}
          alt={alt || ''}
          onLoad={handleImageLoad}
          onMouseDown={(e) => {
            // Prevent image selection/dragging when clicking on the image itself
            e.preventDefault()
          }}
          className={cn(
            "rounded-md max-w-full h-auto transition-all duration-200",
            isResizing && "select-none shadow-lg cursor-grabbing",
            !isResizing && "cursor-default",
            getAlignmentClasses()
          )}
          style={{
            width: width && width > 0 ? `${width}px` : 'auto',
            height: height && height > 0 ? `${height}px` : 'auto',
            maxWidth: '100%',
          }}
        />

        {/* Resize Handles */}
        {showControls && (
          <>
            {/* Corner resize handles */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 cursor-se-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            <div
              className="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 cursor-nw-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 cursor-ne-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            <div
              className="absolute -bottom-1 -left-1 w-5 h-5 bg-blue-500 cursor-sw-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            
            {/* Edge resize handles */}
            <div
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-blue-500 cursor-n-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-blue-500 cursor-s-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            <div
              className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-blue-500 cursor-w-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
            <div
              className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-blue-500 cursor-e-resize rounded-full border-2 border-white shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            />
          </>
        )}

        {/* Resize Indicator */}
        {isResizing && (
          <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-3 py-1 rounded-md shadow-lg">
            {width} × {height}
            {naturalDimensions.width && (
              <span className="ml-2 text-gray-300">
                ({Math.round((width / naturalDimensions.width) * 100)}%)
              </span>
            )}
            <div className="text-gray-400 text-[10px]">
              {aspectRatioLocked ? '🔒' : '🔓'} {getCurrentAspectRatio()}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        {showControls && !isResizing && (
          <div className="absolute -bottom-6 left-0 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity delay-500 pointer-events-none whitespace-nowrap">
            ⌨️ Shift+↑↓ resize | Ctrl+L lock | Del delete
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const ImageWithControls = Node.create({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  inline: false,

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('width') || element.style.width
          return width ? parseInt(width.replace('px', '')) : null
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('height') || element.style.height
          return height ? parseInt(height.replace('px', '')) : null
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
      align: {
        default: 'left',
        parseHTML: element => element.getAttribute('data-align') || 'left',
        renderHTML: attributes => {
          return {
            'data-align': attributes.align,
          }
        },
      },
      aspectRatio: {
        default: null,
        parseHTML: element => {
          const ratio = element.getAttribute('data-aspect-ratio')
          return ratio ? parseFloat(ratio) : null
        },
        renderHTML: attributes => {
          if (!attributes.aspectRatio) {
            return {}
          }
          return {
            'data-aspect-ratio': attributes.aspectRatio,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: element => {
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width') ? parseInt(element.getAttribute('width')!) : null,
            height: element.getAttribute('height') ? parseInt(element.getAttribute('height')!) : null,
            align: element.getAttribute('data-align') || 'left',
            aspectRatio: element.getAttribute('data-aspect-ratio') ? parseFloat(element.getAttribute('data-aspect-ratio')!) : null,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { align, width, height, aspectRatio, ...otherAttributes } = HTMLAttributes
    const alignmentClass = align === 'center' ? 'mx-auto block' : align === 'right' ? 'ml-auto block' : 'mr-auto'
    
    const style: any = {}
    if (width) style.width = `${width}px`
    if (height) style.height = `${height}px`
    
    return [
      'img', 
      mergeAttributes(this.options.HTMLAttributes, otherAttributes, {
        class: `rounded-md max-w-full h-auto ${alignmentClass}`,
        'data-align': align,
        'data-aspect-ratio': aspectRatio,
        style: Object.keys(style).length > 0 ? style : undefined,
      })
    ]
  },

  addCommands() {
    return {
      setImage: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
}) 