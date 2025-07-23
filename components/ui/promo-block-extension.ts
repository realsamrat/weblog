import { Node, mergeAttributes } from '@tiptap/core'

export interface PromoBlockOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    promoBlock: {
      setPromoBlock: (attributes: { 
        title: string
        description: string
        location?: string
        date?: string
        buttonText: string
        logoText?: string
      }) => ReturnType
    }
  }
}

export const PromoBlock = Node.create<PromoBlockOptions>({
  name: 'promoBlock',

  group: 'block',

  content: '',

  addAttributes() {
    return {
      title: {
        default: 'Promo Title',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {}
          }
          return {
            'data-title': attributes.title,
          }
        },
      },
      description: {
        default: 'Promo description text goes here.',
        parseHTML: element => element.getAttribute('data-description'),
        renderHTML: attributes => {
          if (!attributes.description) {
            return {}
          }
          return {
            'data-description': attributes.description,
          }
        },
      },
      location: {
        default: '',
        parseHTML: element => element.getAttribute('data-location'),
        renderHTML: attributes => {
          return {
            'data-location': attributes.location || '',
          }
        },
      },
      date: {
        default: '',
        parseHTML: element => element.getAttribute('data-date'),
        renderHTML: attributes => {
          return {
            'data-date': attributes.date || '',
          }
        },
      },
      buttonText: {
        default: 'Learn More',
        parseHTML: element => element.getAttribute('data-button-text'),
        renderHTML: attributes => {
          if (!attributes.buttonText) {
            return {}
          }
          return {
            'data-button-text': attributes.buttonText,
          }
        },
      },
      logoText: {
        default: 'TC',
        parseHTML: element => element.getAttribute('data-logo-text'),
        renderHTML: attributes => {
          return {
            'data-logo-text': attributes.logoText || 'TC',
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-promo-block]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { title, description, location, date, buttonText, logoText } = node.attrs

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-promo-block': 'true',
        'data-title': title,
        'data-description': description,
        'data-location': location,
        'data-date': date,
        'data-button-text': buttonText,
        'data-logo-text': logoText,
        class: 'flex max-w-2xl mx-auto my-8 border overflow-hidden rounded-none border-emerald-400 bg-white',
      }),
      [
        // Green sidebar with logo
        'div',
        {
          class: 'bg-green-500 flex justify-center w-24 flex-shrink-0 items-start pt-5',
        },
        [
          'div',
          {
            class: 'text-black font-bold text-2xl',
          },
          logoText || 'TC',
        ],
      ],
      [
        // Main content area
        'div',
        {
          class: 'flex-1 p-6',
        },
        [
          // Title
          'h3',
          {
            class: 'text-green-600 font-semibold text-xl mb-4',
          },
          title || 'Promo Title',
        ],
        [
          // Description
          'p',
          {
            class: 'text-gray-800 text-base mb-4 leading-relaxed font-semibold',
          },
          description || 'Promo description text goes here.',
        ],
        [
          // Location, date and button wrapper
          'div',
          {
            class: 'flex flex-col gap-4',
          },
          // Location and date section (only if provided)
          ...(location || date ? [
            [
              'div',
              {
                class: 'flex items-center gap-2 text-green-600 font-medium text-sm',
              },
              ...(location ? [
                [
                  'span',
                  {
                    class: 'font-semibold tracking-normal leading-4',
                  },
                  location,
                ]
              ] : []),
              ...(location && date ? [
                [
                  'div',
                  {
                    class: 'w-px h-3 bg-green-600',
                  },
                ]
              ] : []),
              ...(date ? [
                [
                  'span',
                  {
                    class: 'text-slate-600 leading-4',
                  },
                  date,
                ]
              ] : []),
            ]
          ] : []),
          [
            // CTA Button
            'button',
            {
              class: 'bg-green-500 hover:bg-green-600 text-white font-semibold rounded-none px-[3.75rem] py-5 self-start cursor-pointer transition-colors',
            },
            buttonText || 'Learn More',
          ],
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setPromoBlock: attributes => ({ commands }) => {
        return commands.setNode(this.name, attributes)
      },
    }
  },
}) 