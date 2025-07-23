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

const IframeComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [showControls, setShowControls] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { src, width = '100%', height = '400', title = 'Embedded Content' } = node.attrs

  const handleDelete = () => {
    deleteNode()
  }

  const handleOpenInNewTab = () => {
    window.open(src, '_blank')
  }

  const handleResize = (newHeight: string) => {
    updateAttributes({ height: newHeight })
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

export const IframeEmbed = Node.create({
  name: 'iframe',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400',
      },
      title: {
        default: 'Embedded Content',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'w-full border-0',
        frameborder: '0',
        allowfullscreen: 'true',
        loading: 'lazy',
      }),
    ]
  },

  addCommands() {
    return {
      setIframe: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframeComponent)
  },
}) 