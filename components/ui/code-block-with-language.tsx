"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu'
import { Button } from './button'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'

// Common programming languages
const codeLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'plaintext', label: 'Plain Text' },
]

const CodeBlockComponent = ({ node, updateAttributes, extension }: any) => {
  const [language, setLanguage] = useState(node.attrs.language || 'javascript')
  const [showLanguageBar, setShowLanguageBar] = useState(node.attrs.showLanguageBar === true)

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    updateAttributes({ language: newLanguage })
  }

  const toggleLanguageBar = () => {
    const newShowLanguageBar = !showLanguageBar
    setShowLanguageBar(newShowLanguageBar)
    updateAttributes({ showLanguageBar: newShowLanguageBar })
  }

  const currentLanguage = codeLanguages.find(lang => lang.value === language) || codeLanguages[0]

  return (
    <NodeViewWrapper className="relative my-6 border-2 border-black rounded-md overflow-hidden bg-white">
      {/* Language header bar with integrated dropdown */}
      {showLanguageBar && (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <span className="text-xs font-mono text-gray-600 uppercase tracking-wide">
            {currentLanguage.label}
          </span>
          
          <div className="flex items-center gap-1">
            {/* Language visibility toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguageBar}
              className="h-5 px-1 text-xs bg-transparent hover:bg-gray-200 border-0 rounded"
              title="Hide language bar"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
            
            {/* Language selector dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-5 px-1 text-xs bg-transparent hover:bg-gray-200 border-0 rounded"
                  title="Change language"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom" 
                className="z-[10001] max-h-60 overflow-y-auto"
                sideOffset={4}
              >
                {codeLanguages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.value} 
                    onClick={() => handleLanguageChange(lang.value)}
                    className="text-sm"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Code content */}
      <div className="bg-white p-4 relative">
        {/* Show language bar toggle when hidden */}
        {!showLanguageBar && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleLanguageBar}
            className="absolute top-2 right-2 h-5 px-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded z-10"
            title="Show language bar"
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
        
        <NodeViewContent className="block text-black whitespace-pre-wrap break-words font-mono text-sm leading-relaxed outline-none" />
      </div>
    </NodeViewWrapper>
  )
}

export const CodeBlockWithLanguage = Node.create({
  name: 'codeBlock',

  addOptions() {
    return {
      languageClassPrefix: 'language-',
      HTMLAttributes: {},
    }
  },

  content: 'text*',

  marks: '',

  group: 'block',

  code: true,

  defining: true,

  addAttributes() {
    return {
      language: {
        default: 'javascript',
        parseHTML: element => {
          const { languageClassPrefix } = this.options
          const classNames = [...(element.firstElementChild?.classList || [])]
          const languages = classNames
            .filter(className => className.startsWith(languageClassPrefix))
            .map(className => className.replace(languageClassPrefix, ''))
          const language = languages[0]

          if (!language) {
            return null
          }

          return language
        },
        rendered: false,
      },
      showLanguageBar: {
        default: false,
        parseHTML: element => {
          return element.getAttribute('data-show-language-bar') === 'true'
        },
        renderHTML: attributes => {
          return {
            'data-show-language-bar': attributes.showLanguageBar,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || 'javascript'
    const showLanguageBar = node.attrs.showLanguageBar === true
    
    const content = [
      [
        'div',
        {
          class: 'bg-white p-4',
        },
        [
          'code',
          {
            class: `block text-black whitespace-pre-wrap break-words font-mono text-sm leading-relaxed ${this.options.languageClassPrefix}${language}`,
          },
          0,
        ],
      ],
    ]
    
    if (showLanguageBar) {
      content.unshift([
        'div',
        {
          class: 'bg-gray-100 px-4 py-2 border-b border-gray-200',
        },
        [
          'span',
          {
            class: 'text-xs font-mono text-gray-600 uppercase tracking-wide',
          },
          language,
        ],
      ])
    }
    
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-language': language,
        'data-show-language-bar': showLanguageBar,
        class: 'my-6 border-2 border-black rounded-md overflow-hidden bg-white relative',
      }),
      ...content,
    ]
  },

  addCommands() {
    return {
      setCodeBlock:
        attributes => ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleCodeBlock:
        attributes => ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => {
        // Safe check - avoid accessing view properties that trigger docView
        if (!this.editor || this.editor.isDestroyed || !this.editor.commands) {
          return false
        }
        try {
          return this.editor.commands.toggleCodeBlock()
        } catch (error) {
          console.debug('Error in toggleCodeBlock shortcut:', error)
          return false
        }
      },

      // remove code block when at start of document or code block is empty
      Backspace: () => {
        // Safe check - avoid accessing view properties that trigger docView
        if (!this.editor || this.editor.isDestroyed || !this.editor.state) {
          return false
        }
        
        try {
          const { empty, $anchor } = this.editor.state.selection
          const isAtStart = $anchor.pos === 1

          if (!empty || $anchor.parent.type.name !== this.name) {
            return false
          }

          if (isAtStart || !$anchor.parent.textContent.length) {
            return this.editor.commands.clearNodes()
          }

          return false
        } catch (error) {
          console.debug('Error in Backspace shortcut:', error)
          return false
        }
      },

      // exit node on triple enter
      Enter: ({ editor }) => {
        // Safe check - avoid accessing view properties that trigger docView
        if (!this.editor || this.editor.isDestroyed || !editor) {
          return false
        }
        
        try {
          if (!this.editor.isActive(this.name)) {
            return false
          }

          const { state } = editor
          const { selection } = state
          const { $from, empty } = selection

          if (!empty || $from.parent.type !== this.type) {
            return false
          }

          const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
          const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

          if (!isAtEnd || !endsWithDoubleNewline) {
            return false
          }

          return editor
            .chain()
            .command(({ tr }) => {
              tr.delete($from.pos - 2, $from.pos)

              return true
            })
            .exitCode()
            .run()
        } catch (error) {
          console.debug('Error in Enter shortcut:', error)
          return false
        }
      },

      // exit node on arrow down
      ArrowDown: ({ editor }) => {
        // Safe check - avoid accessing view properties that trigger docView
        if (!this.editor || this.editor.isDestroyed || !editor) {
          return false
        }
        
        try {
          if (!this.editor.isActive(this.name)) {
            return false
          }

          const { state } = editor
          const { selection, doc } = state
          const { $from, empty } = selection

          if (!empty || $from.parent.type !== this.type) {
            return false
          }

          const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

          if (!isAtEnd) {
            return false
          }

          const after = $from.after()

          if (after === undefined) {
            return false
          }

          const nodeAfter = doc.nodeAt(after)

          if (nodeAfter) {
            return false
          }

          return editor.commands.exitCode()
        } catch (error) {
          console.debug('Error in ArrowDown shortcut:', error)
          return false
        }
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
}) 