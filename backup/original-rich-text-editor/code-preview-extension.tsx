"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu'
import { Button } from './button'
import { Settings, Trash2, Code, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const CodePreviewComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [showControls, setShowControls] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { 
    code = '', 
    codeType = 'html', 
    height = '400', 
    title = 'Code Preview' 
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

  // Render the code in an iframe for safe execution
  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        let htmlContent = ''
        
        if (codeType === 'html') {
          // For HTML, render as-is
          htmlContent = code
        } else if (codeType === 'javascript') {
          // Enhanced JavaScript execution with better output handling
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; }
                .console { 
                  background: #1e1e1e; 
                  color: #d4d4d4; 
                  padding: 15px; 
                  border-radius: 6px; 
                  font-family: 'Consolas', 'Monaco', monospace; 
                  font-size: 13px;
                  line-height: 1.4;
                  min-height: 100px;
                  max-height: 300px;
                  overflow-y: auto;
                  white-space: pre-wrap;
                  word-break: break-word;
                }
                .output { 
                  background: white; 
                  border: 1px solid #e1e5e9; 
                  border-radius: 6px; 
                  padding: 15px; 
                  margin-bottom: 15px;
                  min-height: 50px;
                }
                .log-entry { margin-bottom: 4px; }
                .log-error { color: #ff6b6b; }
                .log-warn { color: #feca57; }
                .log-info { color: #48cae4; }
                .log-success { color: #51cf66; }
                h3 { margin: 0 0 10px 0; color: #495057; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="output" id="output">
                <h3>DOM Output:</h3>
                <div id="dom-content"></div>
              </div>
              <div class="console" id="console">
                <h3 style="color: #d4d4d4; margin-bottom: 10px;">Console:</h3>
                <div id="console-content"></div>
              </div>
              <script>
                const output = document.getElementById('dom-content');
                const consoleContent = document.getElementById('console-content');
                
                // Enhanced console methods
                const originalConsole = {
                  log: console.log,
                  error: console.error,
                  warn: console.warn,
                  info: console.info
                };
                
                function addToConsole(message, type = 'log') {
                  const entry = document.createElement('div');
                  entry.className = 'log-entry log-' + type;
                  entry.textContent = '> ' + message;
                  consoleContent.appendChild(entry);
                  consoleContent.scrollTop = consoleContent.scrollHeight;
                }
                
                console.log = function(...args) {
                  const message = args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                  ).join(' ');
                  addToConsole(message, 'log');
                  originalConsole.log.apply(console, args);
                };
                
                console.error = function(...args) {
                  const message = args.map(arg => String(arg)).join(' ');
                  addToConsole(message, 'error');
                  originalConsole.error.apply(console, args);
                };
                
                console.warn = function(...args) {
                  const message = args.map(arg => String(arg)).join(' ');
                  addToConsole(message, 'warn');
                  originalConsole.warn.apply(console, args);
                };
                
                console.info = function(...args) {
                  const message = args.map(arg => String(arg)).join(' ');
                  addToConsole(message, 'info');
                  originalConsole.info.apply(console, args);
                };
                
                // Create a basic DOM structure for JavaScript to interact with
                const container = document.createElement('div');
                container.id = 'app';
                container.style.cssText = 'padding: 10px; border: 1px dashed #ccc; margin: 10px 0; border-radius: 4px;';
                output.appendChild(container);
                
                // Add some common DOM elements that JS can interact with
                const heading = document.createElement('h2');
                heading.textContent = 'Interactive Area';
                heading.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 16px;';
                container.appendChild(heading);
                
                const paragraph = document.createElement('p');
                paragraph.id = 'demo';
                paragraph.textContent = 'This text can be modified by your JavaScript code.';
                paragraph.style.cssText = 'margin: 0 0 10px 0; color: #666;';
                container.appendChild(paragraph);
                
                const button = document.createElement('button');
                button.id = 'myButton';
                button.textContent = 'Click me!';
                button.style.cssText = 'padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;';
                container.appendChild(button);
                
                const input = document.createElement('input');
                input.id = 'myInput';
                input.type = 'text';
                input.placeholder = 'Type something...';
                input.style.cssText = 'padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; margin-right: 10px;';
                container.appendChild(input);
                
                const resultDiv = document.createElement('div');
                resultDiv.id = 'result';
                resultDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; min-height: 20px;';
                container.appendChild(resultDiv);
                
                // Execute the user's JavaScript code
                try {
                  addToConsole('Executing JavaScript code...', 'info');
                  ${code}
                  addToConsole('Code executed successfully!', 'success');
                } catch (error) {
                  addToConsole('Error: ' + error.message, 'error');
                  console.error('JavaScript execution error:', error);
                }
              </script>
            </body>
            </html>
          `
        } else if (codeType === 'iframe') {
          // For iframe code, extract src and render iframe
          const srcMatch = code.match(/src=["']([^"']+)["']/i)
          if (srcMatch) {
            htmlContent = `
              <!DOCTYPE html>
              <html>
              <head><meta charset="UTF-8"></head>
              <body style="margin:0;padding:0;">
                <iframe src="${srcMatch[1]}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
              </body>
              </html>
            `
          } else {
            // If no src found, render the iframe code as-is
            htmlContent = `
              <!DOCTYPE html>
              <html>
              <head><meta charset="UTF-8"></head>
              <body style="margin:0;padding:0;">
                ${code}
              </body>
              </html>
            `
          }
        }

        iframeDoc.open()
        iframeDoc.write(htmlContent)
        iframeDoc.close()
      }
    }
  }, [code, codeType])

  const getCodeTypeLabel = () => {
    switch (codeType) {
      case 'javascript': return 'JavaScript'
      case 'iframe': return 'Iframe'
      default: return 'HTML'
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
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Header */}
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">
            {getCodeTypeLabel()} Preview
          </span>
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
          <iframe
            ref={iframeRef}
            width="100%"
            height={height}
            title={title}
            className="w-full border-0"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const CodePreview = Node.create({
  name: 'codePreview',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      code: {
        default: '',
      },
      codeType: {
        default: 'html',
      },
      height: {
        default: '400',
      },
      title: {
        default: 'Code Preview',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="code-preview"]',
        getAttrs: (element: any) => {
          return {
            code: element.getAttribute('data-code') || '',
            codeType: element.getAttribute('data-code-type') || 'html',
            height: element.getAttribute('data-height') || '400',
            title: element.getAttribute('data-title') || 'Code Preview',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { code, codeType, height, title } = HTMLAttributes
    
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'code-preview',
        'data-code': code,
        'data-code-type': codeType,
        'data-height': height,
        'data-title': title,
        class: 'my-6 border-2 border-gray-200 rounded-md overflow-hidden bg-white',
      }),
      [
        'div',
        {
          class: 'bg-gray-50 px-3 py-2 border-b border-gray-200',
        },
        `${codeType.toUpperCase()} Preview`,
      ],
      [
        'div',
        {
          class: 'p-4 bg-gray-100 text-sm',
          style: `height: ${height}px`,
        },
        'Code preview will render here when published',
      ],
    ]
  },

  addCommands() {
    return {
      setCodePreview: (options: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodePreviewComponent)
  },
}) 