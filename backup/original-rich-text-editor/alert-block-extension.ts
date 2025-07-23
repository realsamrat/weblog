import { Node, mergeAttributes } from '@tiptap/core'

export interface AlertBlockOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alertBlock: {
      setAlertBlock: (attributes: { type: string }) => ReturnType
    }
  }
}

export const AlertBlock = Node.create<AlertBlockOptions>({
  name: 'alertBlock',

  group: 'block',

  content: 'paragraph+',

  addAttributes() {
    return {
      type: {
        default: 'INFO',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes.type) {
            return {}
          }
          return {
            'data-type': attributes.type,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const type = node.attrs.type || 'INFO'
    
    const configs = {
      INFO: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-900',
      },
      TIP: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-900',
      },
      WARNING: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-900',
      },
      SUCCESS: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-900',
      },
    }

    const config = configs[type as keyof typeof configs] || configs.INFO

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': type,
        class: `${config.bgColor} ${config.borderColor} ${config.textColor} border-l-4 p-4 my-6 rounded-r-md text-sm leading-relaxed whitespace-pre-wrap`,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setAlertBlock: attributes => ({ commands }) => {
        return commands.setNode(this.name, attributes)
      },
    }
  },
}) 