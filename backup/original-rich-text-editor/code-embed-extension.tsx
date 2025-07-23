"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu'
import { Button } from './button'
import { Settings, Trash2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const CodeEmbedComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [showControls, setShowControls] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { src, width = '100%', height = '400', title = 'Code Embed' } = node.attrs

  const handleDelete = () => {
    deleteNode()
  }

  const handleOpenInNewTab = () => {
    window.open(src, '_blank')
  }

  const handleResize = (newHeight: string) => {
    updateAttributes({ height: newHeight })
  }

  // Detect embed type based on URL
  const getEmbedType = (url: string) => {
    if (url.includes('codepen.io')) return 'CodePen'
    if (url.includes('jsfiddle.net')) return 'JSFiddle'
    if (url.includes('codesandbox.io')) return 'CodeSandbox'
    if (url.includes('github.com') && url.includes('gist')) return 'GitHub Gist'
    if (url.includes('replit.com')) return 'Replit'
    if (url.includes('stackblitz.com')) return 'StackBlitz'
    return 'Code Embed'
  }

  const embedType = getEmbedType(src)

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
              onClick={handleOpenInNewTab}
              className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded"
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            
            <DropdownMenu 
              open={dropdownOpen} 
              onOpenChange={(open) => {
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
                onCloseAutoFocus={(e) => {
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
                  Delete Embed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Embed Header */}
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">
            {embedType}
          </span>
          <span className="text-xs text-gray-500">
            {height}px
          </span>
        </div>

        {/* Iframe */}
        <iframe
          src={src}
          width={width}
          height={height}
          title={title}
          className="w-full border-0"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </NodeViewWrapper>
  )
}

export const CodeEmbed = Node.create({
  name: 'codeEmbed',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) {
            return {}
          }
          return {
            src: attributes.src,
          }
        },
      },
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: '400',
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          return {
            height: attributes.height,
          }
        },
      },
      title: {
        default: 'Code Embed',
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          return {
            title: attributes.title,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="code-embed"]',
        getAttrs: (element: any) => {
          const iframe = element.querySelector('iframe')
          return {
            src: iframe?.getAttribute('src'),
            width: iframe?.getAttribute('width') || '100%',
            height: iframe?.getAttribute('height') || '400',
            title: iframe?.getAttribute('title') || 'Code Embed',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, width, height, title } = HTMLAttributes
    
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'code-embed',
        class: 'my-6 border-2 border-gray-200 rounded-md overflow-hidden bg-white',
      }),
      [
        'div',
        {
          class: 'bg-gray-50 px-3 py-2 border-b border-gray-200',
        },
        [
          'span',
          {
            class: 'text-xs font-medium text-gray-600',
          },
          'Code Embed',
        ],
      ],
      [
        'iframe',
        {
          src,
          width,
          height,
          title,
          class: 'w-full border-0',
          frameborder: '0',
          allowfullscreen: 'true',
          loading: 'lazy',
        },
      ],
    ]
  },

  addCommands() {
    return {
      insertCodeEmbed: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeEmbedComponent)
  },
}) 