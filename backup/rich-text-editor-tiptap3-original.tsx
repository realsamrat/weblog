"use client"

import * as React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { AlertBlock } from './alert-block-extension'
import { CodeBlockWithLanguage } from './code-block-with-language'
import { ImageWithControls } from './image-with-controls'
import { IframeEmbed } from './iframe-extension'
import { CodePreview } from './code-preview-extension'
import { JSEmbed } from './js-embed-extension'
import { ImageGallery } from './image-gallery-extension'
import { PromoBlock } from './promo-block-extension'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlertTriangle,
  Info,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  RotateCw,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  FileCode,
  LayoutGrid,
  ChevronDown,
  Type,
  Sparkles,
} from 'lucide-react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu'
import { Input } from './input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Label } from './label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

// Custom extension for alert blocks ([!INFO], etc.) - temporarily disabled due to TypeScript issues
// import { Node, mergeAttributes } from '@tiptap/core'



interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Write your content here...', 
  className 
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState<string>('')
  const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false)
  const [embedUrl, setEmbedUrl] = useState<string>('')
  const [embedDialogOpen, setEmbedDialogOpen] = useState<boolean>(false)
  const [rawCode, setRawCode] = useState<string>('')
  const [codeType, setCodeType] = useState<string>('html')
  const [embedType, setEmbedType] = useState<string>('javascript')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<string>('16')
  const [promoDialogOpen, setPromoDialogOpen] = useState<boolean>(false)
  const [promoTitle, setPromoTitle] = useState<string>('Save $200+ on your event pass')
  const [promoDescription, setPromoDescription] = useState<string>('Join visionaries for a day packed with strategies, workshops, and meaningful connections.')
  const [promoLocation, setPromoLocation] = useState<string>('Boston, MA')
  const [promoDate, setPromoDate] = useState<string>('July 15')
  const [promoButtonText, setPromoButtonText] = useState<string>('REGISTER NOW')
  const [promoLogoText, setPromoLogoText] = useState<string>('TC')

  const editorInitialized = useRef<boolean>(false)
  const mountTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const initRetryCountRef = useRef<number>(0)

  // Ensure we only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Enhanced editor readiness check function with critical docView check
  const isEditorFullyReady = (editor: Editor | null): boolean => {
    if (!editor) return false
    
    try {
      // Check basic editor existence
      if (editor.isDestroyed) return false
      
      // Check view existence and properties
      if (!editor.view) return false
      if (!editor.view.state) return false
      if (!editor.view.dom) return false
      
      // Critical check: ensure docView exists (this is what was failing)
      // Access docView through bracket notation to avoid TypeScript issues
      if (!(editor.view as any)['docView']) return false
      
      // Check DOM connection
      if (!editor.view.dom.isConnected) return false
      
      // Check commands availability
      if (!editor.commands) return false
      
      // Additional state checks
      if (!editor.view.state.doc) return false
      
      return true
    } catch (error) {
      console.debug('Editor readiness check failed:', error)
      return false
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // Disable StarterKit's codeBlock to avoid duplicates
        link: false, // Disable StarterKit's link to avoid duplicates
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      ImageWithControls,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      CodeBlockWithLanguage,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      IframeEmbed,
      CodePreview,
      JSEmbed,
      ImageGallery,
      AlertBlock,
      PromoBlock,
    ],
    content: content || '',
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    enableInputRules: true,
    enablePasteRules: true,
    enableCoreExtensions: true,
    editable: true,
    autofocus: false,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none text-black focus:outline-none',
          'min-h-[200px] p-4 border-0 bg-transparent resize-y',
        ),
      },
      handleDrop: (view: any, event: any, slice: any, moved: any) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            uploadImage(file)
            return true
          }
        }
        return false
      },
      handlePaste: (view: any, event: any, slice: any) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            uploadImage(file)
            return true
          }
        }
        return false
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      // Use a micro-task to ensure the update happens after DOM changes
      Promise.resolve().then(() => {
        try {
          if (!isEditorFullyReady(editor)) {
            console.debug('Editor not ready for update, skipping')
            return
          }
          
          const html = editor.getHTML()
          if (html !== undefined && html !== null) {
            onChange(html)
          }
        } catch (error) {
          console.error('Error in editor onUpdate:', error)
        }
      })
    },
    onSelectionUpdate: ({ editor }: { editor: any }) => {
      // Text selection handler - can be used for future features
    },
    onCreate: ({ editor }: { editor: any }) => {
      console.log('Editor created, waiting for full initialization...')
      
      // Clear any existing timeout
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current)
      }
      
      initRetryCountRef.current = 0
      
      const waitForFullMount = () => {
        initRetryCountRef.current++
        
        if (isEditorFullyReady(editor)) {
          console.log('Editor fully ready after', initRetryCountRef.current, 'attempts')
          setIsEditorReady(true)
          return
        }
        
        if (initRetryCountRef.current < 50) { // Max 50 attempts (5 seconds)
          mountTimeoutRef.current = setTimeout(waitForFullMount, 100)
        } else {
          console.warn('Editor initialization timed out, forcing ready state')
          setIsEditorReady(true)
        }
      }
      
      // Start checking immediately, then with delays
      waitForFullMount()
    },
    onDestroy: () => {
      console.log('Editor destroyed')
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current)
      }
      editorInitialized.current = false
      setIsEditorReady(false)
      initRetryCountRef.current = 0
    },
  }, [isClient, placeholder])

  // Additional safety check for editor readiness
  useEffect(() => {
    if (editor && !isEditorReady) {
      const checkEditor = () => {
        try {
          if (editor.view && editor.view.state && editor.view.dom && !editor.isDestroyed) {
            setIsEditorReady(true)
          }
        } catch (error) {
          console.warn('Editor not ready yet:', error)
        }
      }
      
      const interval = setInterval(checkEditor, 100)
      const timeout = setTimeout(() => {
        clearInterval(interval)
        console.warn('Editor readiness check timed out')
      }, 2000)
      
      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
    
    // Return undefined when condition is not met
    return undefined
  }, [editor, isEditorReady])

  useEffect(() => {
    if (editor && content !== undefined && content.trim() !== '' && isClient && isEditorReady) {
      // Only set content on initial load, not on subsequent updates
      if (!editorInitialized.current) {
        try {
          // Enhanced safety check for editor state
          if (!editor.view || !editor.view.state || !editor.view.dom) {
            console.warn('Editor view not ready, delaying content setting')
            return
          }
          
          editor.commands.setContent(content, { emitUpdate: false })
          editorInitialized.current = true
        } catch (error) {
          console.error('Error setting editor content:', error)
          // Try again with a delay and additional checks
          setTimeout(() => {
            try {
              if (editor && editor.commands && editor.view && editor.view.dom && !editorInitialized.current && !editor.isDestroyed) {
                editor.commands.setContent(content, { emitUpdate: false })
                editorInitialized.current = true
              }
            } catch (retryError) {
              console.error('Retry failed for setting editor content:', retryError)
            }
          }, 100)
        }
      }
    }
  }, [content, editor, isClient, isEditorReady])

  // Cleanup effect to properly destroy the editor
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  // Handle dialog state changes
  useEffect(() => {
    if (editor && (linkDialogOpen || imageDialogOpen || embedDialogOpen)) {
      // Force focus back to editor when dialogs open with safety check
      if (isEditorFullyReady(editor)) {
        try {
          editor.commands.blur()
        } catch (error) {
          console.debug('Error blurring editor:', error)
        }
      }
    }
  }, [linkDialogOpen, imageDialogOpen, embedDialogOpen, editor])

  // Enhanced safe method to check if editor is active
  const safeIsActive = useCallback((type: any, attrs?: any) => {
    if (!isEditorReady || !editor || !isEditorFullyReady(editor)) {
      return false
    }
    
    try {
      return attrs ? editor.isActive(type, attrs) : editor.isActive(type)
    } catch (error) {
      console.debug('Safe isActive check failed:', error)
      return false
    }
  }, [editor, isEditorReady])

  // Enhanced safe method to execute editor commands
  const safeExecuteCommand = useCallback((commandFn: () => void, errorMessage: string = 'Command execution failed') => {
    if (!isEditorReady || !isEditorFullyReady(editor)) {
      console.debug('Editor not ready for command execution')
      return false
    }
    
    try {
      commandFn()
      return true
    } catch (error) {
      console.error(errorMessage, error)
      return false
    }
  }, [editor, isEditorReady])

  // Safe method to check if command can be executed
  const safeCanExecute = useCallback((commandName: string) => {
    if (!isEditorReady || !editor || !isEditorFullyReady(editor)) {
      return false
    }
    
    try {
      return (editor.can() as any)[commandName]()
    } catch (error) {
      console.debug(`Cannot check if ${commandName} can be executed:`, error)
      return false
    }
  }, [editor, isEditorReady])

  const uploadImage = useCallback(async (file: File) => {
    if (!editor) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadData = await response.json()
      
      // Insert the image into the editor using safe command execution
      safeExecuteCommand(
        () => (editor.chain().focus() as any).setImage({ 
          src: uploadData.url,
          alt: file.name || 'Uploaded image'
        }).run(),
        'Error inserting uploaded image'
      )
      
      setUploadProgress(100)
      
      // Close the dialog after successful upload
      setImageDialogOpen(false)
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [editor, safeExecuteCommand])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }, [uploadImage])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        uploadImage(file)
      }
    }
  }, [uploadImage])

  // Show loading state while client-side hydration is happening
  if (!isClient) {
    return (
      <div className={cn(
        'min-h-[200px] p-4 border rounded-md bg-gray-50',
        'flex items-center justify-center text-gray-500',
        className
      )}>
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          Loading editor...
        </div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className={cn(
        'min-h-[200px] p-4 border rounded-md bg-gray-50',
        'flex items-center justify-center text-gray-500',
        className
      )}>
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          Initializing editor...
        </div>
      </div>
    )
  }

  const addLink = () => {
    if (linkUrl) {
      const success = safeExecuteCommand(
        () => editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run(),
        'Error adding link'
      )
      if (success) {
        setLinkUrl('');
        setLinkDialogOpen(false);
      }
    }
  };

  const addImageFromUrl = () => {
    if (imageUrl) {
      const success = safeExecuteCommand(
        () => (editor.chain().focus() as any).setImage({ 
          src: imageUrl,
          alt: 'Image from URL'
        }).run(),
        'Error adding image'
      )
      if (success) {
        setImageUrl('');
        setImageDialogOpen(false);
      }
    }
  };

  const addAlertBlock = (type: string) => {
    safeExecuteCommand(
      () => editor.chain().focus().setAlertBlock({ type }).run(),
      'Error adding alert block'
    )
  };

  const addCodeEmbed = () => {
    if (embedUrl) {
      try {
        editor.chain().focus().insertContent({
          type: 'iframe',
          attrs: {
            src: embedUrl,
            width: '100%',
            height: '400',
            title: 'Embedded Content'
          }
        }).run();
      } catch (error) {
        console.error('Error inserting iframe embed:', error);
      }
      
      setEmbedUrl('');
      setEmbedDialogOpen(false);
    }
  };

  const addCodePreview = () => {
    if (rawCode.trim()) {
      try {
        editor.chain().focus().insertContent({
          type: 'codePreview',
          attrs: {
            code: rawCode,
            codeType: codeType,
            height: '400',
            title: `${codeType.toUpperCase()} Preview`
          }
        }).run();
      } catch (error) {
        console.error('Error inserting code preview:', error);
      }
      
      setRawCode('');
      setCodeType('html');
      setEmbedDialogOpen(false);
    }
  };

  const addJSEmbed = () => {
    if (rawCode.trim()) {
      // Auto-detect embed type if not explicitly set
      let detectedType = embedType;
      if (embedType === 'auto') {
        if (/<iframe[^>]*>/i.test(rawCode)) {
          detectedType = 'iframe';
        } else if (/<script[^>]*src[^>]*>/i.test(rawCode)) {
          detectedType = 'widget';
        } else if (/<[^>]+>/i.test(rawCode)) {
          detectedType = 'html';
        } else {
          detectedType = 'javascript';
        }
      }

      // Extract URL for iframe types
      let extractedUrl = '';
      if (detectedType === 'iframe') {
        const srcMatch = rawCode.match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
          extractedUrl = srcMatch[1];
        }
      }
      
      try {
        editor.chain().focus().insertContent({
          type: 'jsEmbed',
          attrs: {
            code: rawCode,
            embedType: detectedType,
            height: '400',
            title: `${detectedType.toUpperCase()} Embed`,
            url: extractedUrl,
            autoExecute: true
          }
        }).run();
      } catch (error) {
        console.error('Error inserting JS embed:', error);
      }
      
      setRawCode('');
      setEmbedType('javascript');
      setEmbedDialogOpen(false);
    }
  };

  const applyFontSize = (size: string) => {
    const success = safeExecuteCommand(
      () => {
        // Apply font size using the textStyle mark
        editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
      },
      'Error applying font size'
    )
    
    if (success) {
      setFontSize(size);
    } else {
      // Fallback: try applying as inline style
      safeExecuteCommand(
        () => editor.chain().focus().setMark('textStyle', { style: `font-size: ${size}px;` }).run(),
        'Fallback font size application failed'
      )
    }
  };

  const addPromoBlock = () => {
    const success = safeExecuteCommand(
      () => editor.chain().focus().setPromoBlock({
        title: promoTitle,
        description: promoDescription,
        location: promoLocation,
        date: promoDate,
        buttonText: promoButtonText,
        logoText: promoLogoText,
      }).run(),
      'Error inserting promo block'
    )
    
    if (success) {
      setPromoDialogOpen(false);
    }
  };

  // Get the current heading icon based on active heading level for dropdown
  const getCurrentHeadingIcon = () => {
    if (safeIsActive('heading', { level: 1 })) {
      return <Heading1 className="h-4 w-4" />
    }
    if (safeIsActive('heading', { level: 2 })) {
      return <Heading2 className="h-4 w-4" />
    }
    if (safeIsActive('heading', { level: 3 })) {
      return <Heading3 className="h-4 w-4" />
    }
    
    // Default to H1 when no heading is active
    return <Heading1 className="h-4 w-4" />
  };

  // Get the current alignment icon based on active alignment
  const getCurrentAlignmentIcon = () => {
    if (safeIsActive({ textAlign: 'center' })) {
      return <AlignCenter className="h-4 w-4" />
    }
    if (safeIsActive({ textAlign: 'right' })) {
      return <AlignRight className="h-4 w-4" />
    }
    if (safeIsActive({ textAlign: 'justify' })) {
      return <AlignJustify className="h-4 w-4" />
    }
    
    return <AlignLeft className="h-4 w-4" /> // Default to left alignment
  };


  return (
    <div className={cn("relative flex flex-col space-y-2", className)}>
      <div className="flex items-center gap-1 p-1 border border-input rounded-md bg-background mb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-w-0">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleBold().run(),
                    'Error toggling bold'
                  )
                }}
                className={safeIsActive('bold') ? 'bg-muted' : ''}
                disabled={!isEditorReady}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleItalic().run(),
                    'Error toggling italic'
                  )
                }}
                className={safeIsActive('italic') ? 'bg-muted' : ''}
                disabled={!isEditorReady}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleCode().run(),
                    'Error toggling code'
                  )
                }}
                className={safeIsActive('code') ? 'bg-muted' : ''}
                disabled={!isEditorReady}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inline Code</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                  >
                    <div className="flex items-center gap-1">
                      <Type className="h-4 w-4" />
                      <span className="text-xs">{fontSize}px</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Font Size</TooltipContent>
            </Tooltip>
            <DropdownMenuContent 
              align="start" 
              side="bottom" 
              className="z-[10001]"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              sticky="always"
              onCloseAutoFocus={(e: Event) => e.preventDefault()}
            >
              <DropdownMenuItem onClick={() => applyFontSize('12')}>
                <span className="text-xs">12px - Small</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFontSize('14')}>
                <span className="text-sm">14px - Normal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFontSize('16')}>
                <span className="text-base">16px - Medium</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFontSize('18')}>
                <span className="text-lg">18px - Large</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFontSize('20')}>
                <span className="text-xl">20px - X-Large</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFontSize('24')}>
                <span className="text-2xl">24px - XX-Large</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFontSize('32')}>
                <span className="text-3xl">32px - Huge</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={safeIsActive('heading') ? 'bg-muted' : ''}
                  >
                    <div className="flex items-center gap-1">
                      {getCurrentHeadingIcon()}
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Headings</TooltipContent>
            </Tooltip>
            <DropdownMenuContent 
              align="start" 
              side="bottom" 
              className="z-[10001]"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              sticky="always"
              onCloseAutoFocus={(e: Event) => e.preventDefault()}
            >
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                  'Error toggling heading 1'
                )
              }}>
                <Heading1 className="h-4 w-4 mr-2" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                  'Error toggling heading 2'
                )
              }}>
                <Heading2 className="h-4 w-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                  'Error toggling heading 3'
                )
              }}>
                <Heading3 className="h-4 w-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setParagraph().run(),
                  'Error setting paragraph'
                )
              }}>
                <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs font-medium">P</span>
                Normal Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleBulletList().run(),
                    'Error toggling bullet list'
                  )
                }}
                className={safeIsActive('bulletList') ? 'bg-muted' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleOrderedList().run(),
                    'Error toggling ordered list'
                  )
                }}
                className={safeIsActive('orderedList') ? 'bg-muted' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleBlockquote().run(),
                    'Error toggling blockquote'
                  )
                }}
                className={safeIsActive('blockquote') ? 'bg-muted' : ''}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Quote</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().toggleCodeBlock().run(),
                    'Error toggling code block'
                  )
                }}
                className={safeIsActive('codeBlock') ? 'bg-muted' : ''}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code Block</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={safeIsActive({ textAlign: 'center' }) || safeIsActive({ textAlign: 'right' }) || safeIsActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}
                  >
                    {getCurrentAlignmentIcon()}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Text Alignment</TooltipContent>
            </Tooltip>
            <DropdownMenuContent 
              align="start" 
              side="bottom" 
              className="z-[10001]"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              sticky="always"
              onCloseAutoFocus={(e: Event) => e.preventDefault()}
            >
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setTextAlign('left').run(),
                  'Error setting left alignment'
                )
              }}>
                <AlignLeft className="h-4 w-4 mr-2" />
                Align Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setTextAlign('center').run(),
                  'Error setting center alignment'
                )
              }}>
                <AlignCenter className="h-4 w-4 mr-2" />
                Align Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setTextAlign('right').run(),
                  'Error setting right alignment'
                )
              }}>
                <AlignRight className="h-4 w-4 mr-2" />
                Align Right
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setTextAlign('justify').run(),
                  'Error setting justify alignment'
                )
              }}>
                <AlignJustify className="h-4 w-4 mr-2" />
                Justify
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={safeIsActive('link') ? 'bg-muted' : ''}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
                <DialogDescription>
                  Add a URL to create a link.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                    suppressHydrationWarning={true}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addLink}>Insert Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
                <DialogDescription>
                  Upload an image file or provide a URL.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="url">Image URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                      dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                      isUploading && "pointer-events-none opacity-50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {isUploading ? (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Drop images here, or click to select</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading}
                        />
                      </div>
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
                      onChange={(e) => setImageUrl(e.target.value)}
                      suppressHydrationWarning={true}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addImageFromUrl} disabled={!imageUrl}>
                      Insert Image
                    </Button>
                  </DialogFooter>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().insertContent({ type: 'imageGallery', attrs: { images: [], columns: 2 } }).run(),
                    'Error inserting image gallery'
                  )
                }}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Image Gallery</TooltipContent>
          </Tooltip>

          <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <FileCode className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Embed Content</DialogTitle>
                <DialogDescription>
                  Embed content from URLs or paste raw HTML/JavaScript/iframe code for live preview.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="url">Embed URL</TabsTrigger>
                  <TabsTrigger value="code">Code Preview</TabsTrigger>
                  <TabsTrigger value="jsembed">JS/Widget</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="embedUrl">Embed URL</Label>
                    <Input
                      id="embedUrl"
                      placeholder="https://codepen.io/username/embed/abc123"
                      value={embedUrl}
                      onChange={(e) => setEmbedUrl(e.target.value)}
                      suppressHydrationWarning={true}
                    />
                    <p className="text-xs text-muted-foreground">
                      Supports: CodePen, JSFiddle, CodeSandbox, GitHub Gist, YouTube, Replit, StackBlitz, and any iframe URL
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEmbedDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addCodeEmbed} disabled={!embedUrl}>
                      Embed URL
                    </Button>
                  </DialogFooter>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="codeType">Code Type</Label>
                    <Select value={codeType} onValueChange={setCodeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select code type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="iframe">Iframe Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rawCode">Raw Code</Label>
                    <Textarea
                      id="rawCode"
                      placeholder={
                        codeType === 'html' ? 
                          '<div style="text-align: center; padding: 20px;">\n  <h1>Hello World!</h1>\n  <p style="color: blue;">This is HTML content</p>\n</div>' :
                        codeType === 'javascript' ? 
                          '// Try some interactive JavaScript!\nconsole.log("Hello World!");\n\n// Interact with DOM elements\ndocument.getElementById("demo").textContent = "Text changed by JavaScript!";\n\n// Add click event\ndocument.getElementById("myButton").onclick = function() {\n  document.getElementById("result").innerHTML = "<p>Button clicked!</p>";\n};' :
                        '<iframe src="https://codepen.io/username/embed/abc123" width="100%" height="400" frameborder="0"></iframe>'
                      }
                      value={rawCode}
                      onChange={(e) => setRawCode(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                      suppressHydrationWarning={true}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste your {codeType.toUpperCase()} code here. It will render as a live preview in the editor.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEmbedDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addCodePreview} disabled={!rawCode.trim()}>
                      Add Preview
                    </Button>
                  </DialogFooter>
                </TabsContent>

                <TabsContent value="jsembed" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="embedType">Embed Type</Label>
                    <Select value={embedType} onValueChange={setEmbedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select embed type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="widget">Widget/Script</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="iframe">Iframe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jsEmbedCode">Embed Code</Label>
                    <Textarea
                      id="jsEmbedCode"
                      placeholder={
                        embedType === 'widget' ? 
                          '<!-- Widget embed example -->\n<div data-bloom-form-id="2gr9m4ggk9zy0" style="width:100%;"></div>\n<script>\n  window.bloomSettings={userId:"pk37oyw5v9qwz",profileId:"po8711rmw7w41"};\n  if(void 0===bloomScript){\n    var bloomScript=document.createElement("script");\n    bloomScript.async=!0;\n    fetch("https://code.bloom.io/version?t="+Date.now())\n      .then(function(t){return t.text()})\n      .then(function(t){\n        bloomScript.src="https://code.bloom.io/widget.js?v="+t;\n        document.head.appendChild(bloomScript)\n      })\n  }\n</script>' :
                        embedType === 'javascript' ? 
                          '// Interactive JavaScript example\nconsole.log("Hello from JavaScript embed!");\n\n// Create dynamic content\nconst div = document.createElement("div");\ndiv.innerHTML = "<h3>Dynamic Content</h3><p>This was created by JavaScript!</p>";\ncontainer.appendChild(div);\n\n// Add interactivity\nconst button = document.createElement("button");\nbutton.textContent = "Click me!";\nbutton.onclick = () => alert("Button clicked!");\ncontainer.appendChild(button);' :
                        embedType === 'html' ?
                          '<div style="text-align: center; padding: 20px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 10px;">\n  <h2>Rich HTML Content</h2>\n  <p>This HTML will be rendered directly in the editor!</p>\n  <button onclick="alert(\'HTML button clicked!\')">Interactive Button</button>\n</div>' :
                        embedType === 'iframe' ?
                          '<iframe src="https://codepen.io/username/embed/abc123" width="100%" height="400" frameborder="0" allowfullscreen></iframe>' :
                          '<!-- Paste your embed code here -->\n<!-- Supports: JavaScript widgets, HTML content, iframe embeds -->\n<!-- Auto-detection will identify the type automatically -->'
                      }
                      value={rawCode}
                      onChange={(e) => setRawCode(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                      suppressHydrationWarning={true}
                    />
                    <p className="text-xs text-muted-foreground">
                      {embedType === 'widget' ? 
                        'Paste widget embed code (like Bloom forms, analytics scripts, etc.). Scripts will be executed safely.' :
                        embedType === 'javascript' ?
                        'Write JavaScript code that will be executed in a safe environment with console output.' :
                        embedType === 'html' ?
                        'Paste HTML content that will be rendered directly in the editor.' :
                        embedType === 'iframe' ?
                        'Paste iframe embed code from CodePen, JSFiddle, YouTube, etc.' :
                        'Paste any embed code - the system will auto-detect whether it\'s a widget, HTML, iframe, or JavaScript.'
                      }
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEmbedDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addJSEmbed} disabled={!rawCode.trim()}>
                      Add Embed
                    </Button>
                  </DialogFooter>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Alert Blocks</TooltipContent>
            </Tooltip>
            <DropdownMenuContent 
              align="start" 
              side="bottom" 
              className="z-[10001]"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              sticky="always"
              onCloseAutoFocus={(e: Event) => e.preventDefault()}
            >
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setAlertBlock({ type: 'INFO' }).run(),
                  'Error inserting info alert'
                )
              }}>
                <Info className="h-4 w-4 mr-2 text-blue-600" />
                Info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setAlertBlock({ type: 'TIP' }).run(),
                  'Error inserting tip alert'
                )
              }}>
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                Tip
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setAlertBlock({ type: 'WARNING' }).run(),
                  'Error inserting warning alert'
                )
              }}>
                <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                safeExecuteCommand(
                  () => editor.chain().focus().setAlertBlock({ type: 'SUCCESS' }).run(),
                  'Error inserting success alert'
                )
              }}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Success
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Styled Blocks</TooltipContent>
            </Tooltip>
            <DropdownMenuContent 
              align="start" 
              side="bottom" 
              className="z-[10001]"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              sticky="always"
              onCloseAutoFocus={(e: Event) => e.preventDefault()}
            >
              <DropdownMenuItem onClick={() => setPromoDialogOpen(true)}>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  Promo Block
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().undo().run(),
                    'Error undoing'
                  )
                }}
                disabled={!isEditorReady || !safeCanExecute('undo')}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  safeExecuteCommand(
                    () => editor.chain().focus().redo().run(),
                    'Error redoing'
                  )
                }}
                disabled={!isEditorReady || !safeCanExecute('redo')}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="relative">
        {editor && isEditorReady ? (
          <EditorContent 
            editor={editor} 
            className="resize-y overflow-auto min-h-[200px] max-h-[800px] rounded-md border border-input bg-background"
            style={{ resize: 'vertical' }}
            suppressHydrationWarning={true}
          />
        ) : (
          <div className="min-h-[200px] flex items-center justify-center border border-input rounded-md bg-background">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              Editor loading...
            </div>
          </div>
        )}
        
        {/* Drag overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-md flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Drop image to upload</p>
            </div>
          </div>
        )}
      </div>

      {/* Promo Block Dialog */}
      <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Promo Block</DialogTitle>
            <DialogDescription>
              Create a promotional block with custom content and styling.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="promoTitle">Title</Label>
              <Input
                id="promoTitle"
                placeholder="Save $200+ on your event pass"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                suppressHydrationWarning={true}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="promoDescription">Description</Label>
              <Textarea
                id="promoDescription"
                placeholder="Join visionaries for a day packed with strategies, workshops, and meaningful connections."
                value={promoDescription}
                onChange={(e) => setPromoDescription(e.target.value)}
                rows={3}
                suppressHydrationWarning={true}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="promoLocation">Location (Optional)</Label>
                <Input
                  id="promoLocation"
                  placeholder="Boston, MA"
                  value={promoLocation}
                  onChange={(e) => setPromoLocation(e.target.value)}
                  suppressHydrationWarning={true}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="promoDate">Date (Optional)</Label>
                <Input
                  id="promoDate"
                  placeholder="July 15"
                  value={promoDate}
                  onChange={(e) => setPromoDate(e.target.value)}
                  suppressHydrationWarning={true}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="promoButtonText">Button Text</Label>
                <Input
                  id="promoButtonText"
                  placeholder="REGISTER NOW"
                  value={promoButtonText}
                  onChange={(e) => setPromoButtonText(e.target.value)}
                  suppressHydrationWarning={true}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="promoLogoText">Logo Text</Label>
                <Input
                  id="promoLogoText"
                  placeholder="TC"
                  value={promoLogoText}
                  onChange={(e) => setPromoLogoText(e.target.value)}
                  maxLength={3}
                  suppressHydrationWarning={true}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addPromoBlock} disabled={!promoTitle || !promoDescription}>
              Add Promo Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      

    </div>
  )
}
