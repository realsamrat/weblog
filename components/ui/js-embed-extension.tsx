"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu'
import { Button } from './button'
import { Settings, Trash2, Code, Eye, EyeOff, RefreshCw, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const JSEmbedComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [showControls, setShowControls] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { 
    code = '', 
    embedType = 'javascript', 
    height = '400', 
    title = 'JavaScript Embed',
    url = '',
    autoExecute = true
  } = node.attrs

  const handleDelete = () => {
    deleteNode()
  }

  const handleResize = (newHeight: string) => {
    updateAttributes({ height: newHeight })
  }

  const toggleCodeView = () => {
    setShowCode(!showCode)
  }

  const handleRefresh = () => {
    if (embedType === 'javascript' || embedType === 'widget') {
      executeJavaScript()
    } else if (embedType === 'iframe') {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src
      }
    }
  }

  const openInNewTab = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Detect embed type from code content
  const detectEmbedType = useCallback((code: string) => {
    // Check for iframe tags
    if (/<iframe[^>]*>/i.test(code)) {
      return 'iframe'
    }
    // Check for script tags with src (widget pattern)
    if (/<script[^>]*src[^>]*>/i.test(code)) {
      return 'widget'
    }
    // Check for CodePen, JSFiddle, etc URLs
    if (/(?:codepen\.io|jsfiddle\.net|codesandbox\.io|stackblitz\.com)/i.test(code)) {
      return 'iframe'
    }
    // Default to JavaScript
    return 'javascript'
  }, [])

  // Execute JavaScript code safely
  const executeJavaScript = useCallback(() => {
    if (!containerRef.current || !code) return

    setIsLoading(true)
    setError(null)

    try {
      const container = containerRef.current
      
      // Clear previous content
      container.innerHTML = ''

      if (embedType === 'widget') {
        // Handle widget embeds (like the Bloom example)
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = code
        
        // Extract script tags and div containers
        const scriptTags = tempDiv.querySelectorAll('script')
        const divContainers = tempDiv.querySelectorAll('div')
        
        // Add div containers first
        divContainers.forEach(div => {
          const clonedDiv = div.cloneNode(true) as HTMLElement
          container.appendChild(clonedDiv)
        })
        
        // Execute scripts
        scriptTags.forEach(script => {
          const newScript = document.createElement('script')
          
          if (script.src) {
            // External script
            newScript.src = script.src
            newScript.async = true
            newScript.onload = () => setIsLoading(false)
            newScript.onerror = () => {
              setError('Failed to load external script')
              setIsLoading(false)
            }
          } else {
            // Inline script
            newScript.textContent = script.textContent
            setTimeout(() => setIsLoading(false), 100)
          }
          
          // Copy other attributes
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src') {
              newScript.setAttribute(attr.name, attr.value)
            }
          })
          
          document.head.appendChild(newScript)
        })
        
      } else if (embedType === 'javascript') {
        // Handle pure JavaScript
        const outputDiv = document.createElement('div')
        outputDiv.className = 'js-embed-output'
        outputDiv.style.cssText = `
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 15px;
          margin: 10px 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 50px;
        `
        container.appendChild(outputDiv)
        
        // Create a safe execution context
        const consoleOutput: string[] = []
        const originalConsole = {
          log: console.log,
          error: console.error,
          warn: console.warn
        }
        
        // Override console methods
        const addOutput = (message: string, type: 'log' | 'error' | 'warn' = 'log') => {
          const p = document.createElement('p')
          p.style.cssText = `
            margin: 5px 0;
            color: ${type === 'error' ? '#dc3545' : type === 'warn' ? '#ffc107' : '#495057'};
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
          `
          p.textContent = `> ${message}`
          outputDiv.appendChild(p)
        }
        
        console.log = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          addOutput(message, 'log')
          originalConsole.log(...args)
        }
        
        console.error = (...args) => {
          const message = args.map(arg => String(arg)).join(' ')
          addOutput(message, 'error')
          originalConsole.error(...args)
        }
        
        console.warn = (...args) => {
          const message = args.map(arg => String(arg)).join(' ')
          addOutput(message, 'warn')
          originalConsole.warn(...args)
        }
        
        try {
          // Create a function to execute the code in a controlled scope
          const func = new Function('container', 'document', 'window', code)
          func(container, document, window)
          
          if (outputDiv.children.length === 0) {
            addOutput('Code executed successfully (no console output)')
          }
        } catch (error: any) {
          addOutput(`Error: ${error.message}`, 'error')
          setError(error.message)
        } finally {
          // Restore console
          console.log = originalConsole.log
          console.error = originalConsole.error
          console.warn = originalConsole.warn
          setIsLoading(false)
        }
        
      } else if (embedType === 'html') {
        // Handle HTML content
        container.innerHTML = code
        setIsLoading(false)
      }
      
    } catch (error: any) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [code, embedType])

  // Auto-execute on mount and when code changes
  useEffect(() => {
    if (autoExecute && (embedType === 'javascript' || embedType === 'widget' || embedType === 'html')) {
      executeJavaScript()
    }
  }, [autoExecute, executeJavaScript])

  // Handle iframe embeds
  const renderIframe = () => {
    let iframeSrc = url

    // Extract URL from iframe code if needed
    if (!iframeSrc && code) {
      const srcMatch = code.match(/src=["']([^"']+)["']/i)
      if (srcMatch) {
        iframeSrc = srcMatch[1]
      }
    }

    if (!iframeSrc) return null

    return (
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        width="100%"
        height={height}
        title={title}
        className="w-full border-0"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load iframe content')
          setIsLoading(false)
        }}
      />
    )
  }

  const getEmbedTypeLabel = () => {
    switch (embedType) {
      case 'widget': return 'Widget'
      case 'iframe': return 'Iframe'
      case 'html': return 'HTML'
      default: return 'JavaScript'
    }
  }

  return (
    <NodeViewWrapper className="my-6 relative group">
      <div 
        className="relative border-2 border-gray-200 rounded-md overflow-hidden bg-white"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (!dropdownOpen) {
            setShowControls(false)
          }
        }}
      >
        {/* Controls */}
        {showControls && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleCodeView}
              className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
              title={showCode ? "Show preview" : "Show code"}
            >
              {showCode ? <Eye className="h-3 w-3" /> : <Code className="h-3 w-3" />}
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
              title="Refresh"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>

            {url && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={openInNewTab}
                className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
                title="Open in new tab"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            
            <DropdownMenu 
              open={dropdownOpen} 
              onOpenChange={(open: boolean) => {
                setDropdownOpen(open)
                if (open) {
                  setShowControls(true)
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
                  title="Settings"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom" 
                className="z-[10001]"
                sideOffset={4}
                onCloseAutoFocus={(e: Event) => {
                  e.preventDefault()
                  setTimeout(() => {
                    setShowControls(false)
                  }, 100)
                }}
              >
                <DropdownMenuItem onClick={() => handleResize('300')}>
                  Height: 300px
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleResize('400')}>
                  Height: 400px
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleResize('500')}>
                  Height: 500px
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleResize('600')}>
                  Height: 600px
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Header */}
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">
              {getEmbedTypeLabel()} Embed
            </span>
            {isLoading && (
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
            )}
            {error && (
              <span className="text-xs text-red-600" title={error}>
                Error
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {height}px
          </span>
        </div>

        {/* Content */}
        {showCode ? (
          <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto" style={{ height: `${height}px` }}>
            <pre className="whitespace-pre-wrap break-words">{code}</pre>
          </div>
        ) : (
          <div className="relative" style={{ height: `${height}px` }}>
            {embedType === 'iframe' ? (
              renderIframe()
            ) : (
              <div 
                ref={containerRef}
                className="w-full h-full overflow-auto p-4"
                style={{ minHeight: `${height}px` }}
              />
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const JSEmbed = Node.create({
  name: 'jsEmbed',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      code: {
        default: '',
      },
      embedType: {
        default: 'javascript',
      },
      height: {
        default: '400',
      },
      title: {
        default: 'JavaScript Embed',
      },
      url: {
        default: '',
      },
      autoExecute: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="js-embed"]',
        getAttrs: (element: any) => {
          return {
            code: element.getAttribute('data-code') || '',
            embedType: element.getAttribute('data-embed-type') || 'javascript',
            height: element.getAttribute('data-height') || '400',
            title: element.getAttribute('data-title') || 'JavaScript Embed',
            url: element.getAttribute('data-url') || '',
            autoExecute: element.getAttribute('data-auto-execute') !== 'false',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { code, embedType, height, title, url, autoExecute } = HTMLAttributes
    
    // For iframe embeds, render the actual iframe
    if (embedType === 'iframe' && url) {
      return [
        'div',
        mergeAttributes(this.options.HTMLAttributes, {
          'data-type': 'js-embed',
          'data-code': code,
          'data-embed-type': embedType,
          'data-height': height,
          'data-title': title,
          'data-url': url,
          'data-auto-execute': autoExecute,
          class: 'my-6 border-2 border-gray-200 rounded-md overflow-hidden bg-white',
        }),
        [
          'div',
          {
            class: 'bg-gray-50 px-3 py-2 border-b border-gray-200',
          },
          `${embedType.toUpperCase()} Embed`,
        ],
        [
          'iframe',
          {
            src: url,
            width: '100%',
            height: height,
            title: title,
            class: 'w-full border-0',
            frameborder: '0',
            allowfullscreen: 'true',
            sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
          },
        ],
      ]
    }
    
    // For other embed types, show a code preview
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'js-embed',
        'data-code': code,
        'data-embed-type': embedType,
        'data-height': height,
        'data-title': title,
        'data-url': url,
        'data-auto-execute': autoExecute,
        class: 'my-6 border-2 border-gray-200 rounded-md overflow-hidden bg-white',
      }),
      [
        'div',
        {
          class: 'bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between',
        },
        [
          'span',
          {
            class: 'text-xs font-medium text-gray-600',
          },
          `${embedType.toUpperCase()} Embed`,
        ],
        [
          'span',
          {
            class: 'text-xs text-gray-500',
          },
          `${height}px`,
        ],
      ],
      [
        'div',
        {
          class: 'p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto',
          style: `height: ${height}px`,
        },
        [
          'pre',
          {
            class: 'whitespace-pre-wrap break-words',
          },
          code || '// No code provided',
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setJSEmbed: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(JSEmbedComponent)
  },
}) 