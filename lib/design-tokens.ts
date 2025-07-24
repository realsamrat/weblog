/**
 * Design Tokens for Weblog Blog
 * 
 * This file contains all the design tokens used throughout the blog application,
 * ensuring consistency across components and pages.
 */

// Typography
export const typography = {
  fontFamily: {
    sans: 'Arial, Helvetica, sans-serif',
    serif: 'var(--font-serif)', // Crimson Text (from CSS)
    mono: 'JetBrains Mono, monospace'
  },
  fontSize: {
    xs: 'text-xs', // 12px
    sm: 'text-sm', // 14px
    base: 'text-base', // 16px
    lg: 'text-lg', // 18px
    xl: 'text-xl', // 20px
    '2xl': 'text-2xl', // 24px
    '3xl': 'text-3xl', // 30px
    '4xl': 'text-4xl' // 36px
  },
  fontWeight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  },
  lineHeight: {
    tight: 'leading-tight',
    relaxed: 'leading-relaxed',
    none: 'leading-none'
  }
} as const

// Colors
export const colors = {
  // Brand colors
  brand: {
    primary: 'bg-black text-white',
    accent: 'text-orange-500'
  },
  
  // Text colors
  text: {
    primary: 'text-black',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    inverse: 'text-white'
  },
  
  // Background colors
  background: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    muted: 'bg-gray-100',
    dark: 'bg-black'
  },
  
  // Border colors
  border: {
    light: 'border-gray-100',
    default: 'border-gray-200',
    medium: 'border-gray-300',
    dark: 'border-gray-400'
  },
  
  // Interactive colors
  interactive: {
    link: 'text-blue-600 hover:text-blue-800',
    linkBorder: 'border-gray-300 hover:border-gray-600',
    hover: 'hover:text-gray-600',
    hoverBg: 'hover:bg-gray-200'
  }
} as const

// Spacing
export const spacing = {
  gap: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12'
  },
  padding: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  },
  margin: {
    xs: 'm-2',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-12'
  }
} as const

// Component-specific tokens
export const components = {
  tag: {
    base: 'text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors cursor-pointer'
  },
  
  // Category badges
  category: {
    base: 'text-xs px-2 py-1 rounded',
    colors: {
      ai: 'bg-sky-100 text-sky-800',
      security: 'bg-rose-100 text-rose-800',
      programming: 'bg-emerald-100 text-emerald-800',
      general: 'bg-teal-100 text-teal-800',
      default: 'bg-slate-100 text-slate-800'
    }
  },
  
  // Featured badge
  featured: {
    base: 'text-sm px-3 py-1 bg-yellow-100 rounded text-yellow-800 font-semibold'
  },
  
  // Navigation
  navigation: {
    container: 'bg-black text-white mb-6',
    wrapper: 'max-w-4xl mx-auto px-4 py-2',
    logo: 'font-serif text-2xl font-bold text-white hover:text-gray-300 transition-colors flex items-baseline',
    logoAccent: 'ml-1 text-orange-500 text-4xl leading-none',
    link: 'text-sm hover:text-gray-300 transition-colors'
  },
  
  // Cards
  card: {
    blogPost: {
      container: 'border-b border-gray-100 pb-8 mb-8 last:border-b-0',
      title: 'font-serif text-xl font-semibold mb-3 leading-tight',
      excerpt: 'text-sm text-black leading-relaxed mb-3',
      readMore: 'text-xs text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-600'
    },
    featured: {
      container: 'mb-12 pb-8 border-2 border-gray-200 p-6 rounded-lg',
      title: 'font-serif text-3xl font-bold mb-4 leading-tight',
      excerpt: 'text-base text-black leading-relaxed mb-4',
      readMore: 'text-sm text-gray-900 hover:text-gray-600 transition-colors border-b-2 border-gray-400 hover:border-gray-600 pb-px'
    }
  },
  
  // Sidebar
  sidebar: {
    container: 'w-80 flex-shrink-0',
    sticky: 'sticky top-8',
    section: 'mb-8',
    title: 'font-serif text-lg font-semibold mb-3'
  },
  
  // Post content
  post: {
    article: 'flex-1 max-w-xl',
    header: 'mb-8',
    content: 'prose prose-sm max-w-none text-black',
    backLink: 'text-sm text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-300 hover:border-gray-600'
  },
  
  // Special blocks
  alert: {
    base: 'border-l-4 p-4 my-6 rounded-r-md',
    variants: {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      tip: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      warning: 'bg-red-50 border-red-200 text-red-900',
      success: 'bg-green-50 border-green-200 text-green-900'
    }
  },
  
  // Code blocks
  code: {
    block: {
      container: 'my-6 border-2 border-black rounded-md overflow-hidden',
      header: 'bg-white px-4 py-2 border-b-2 border-black',
      headerText: 'text-gray-600 text-xs font-mono',
      content: 'bg-white text-black p-4 overflow-x-auto m-0',
      text: 'font-mono text-sm leading-relaxed'
    },
    inline: 'bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800'
  },
  
  // Blockquotes
  blockquote: 'border-l-4 border-gray-300 pl-4 py-2 my-6 italic text-gray-700 bg-gray-50 rounded-r-md',
  
  // Lists
  list: {
    item: 'mb-2 leading-relaxed ml-4 text-black'
  },
  
  // Text formatting
  text: {
    paragraph: 'mb-4 leading-relaxed text-black',
    bold: {
      fullParagraph: 'font-semibold mb-4 leading-relaxed',
      inline: 'font-semibold'
    }
  },
  
  // Post metadata
  meta: {
    categoryBadge: 'text-xs px-2 py-1 bg-teal-100 rounded text-teal-800',
    date: 'text-xs text-gray-500',
    author: 'text-sm text-gray-600',
    description: 'text-sm text-gray-600 mb-2',
    tagCount: 'ml-1 text-gray-500'
  },
  
  // Headings
  heading: {
    h1: 'font-serif text-3xl font-bold leading-tight mb-4', // Article titles
    h2: 'font-serif text-xl font-semibold mt-8 mb-4',
    h3: 'font-serif text-lg font-semibold mt-6 mb-3',
    sectionTitle: 'font-serif text-2xl font-semibold mb-6 mt-10 pt-8 border-t border-gray-300'
  }
} as const

// Layout tokens
export const layout = {
  container: {
    main: 'max-w-4xl mx-auto px-4',
    content: 'min-h-screen'
  },
  grid: {
    mainContent: 'flex flex-col md:flex-row gap-12',
    postLayout: 'flex gap-12',
    twoThirds: 'w-full md:w-2/3',
    oneThird: 'w-full md:w-1/3 md:sticky md:top-8 h-fit'
  },
  footer: {
    container: 'mt-20 border-t border-gray-200 py-8',
    content: 'max-w-4xl mx-auto px-4 text-center',
    text: 'text-xs text-gray-500'
  }
} as const

// Transition tokens
export const transitions = {
  default: 'transition-colors',
  fast: 'transition-colors duration-150',
  slow: 'transition-colors duration-300'
} as const

// Utility functions for combining tokens
export const combineTokens = (...tokens: string[]) => tokens.join(' ')

// Helper functions for common patterns
export const getTagStyles = () => components.tag.base
export const getCategoryStyles = (category: keyof typeof components.category.colors = 'default') => 
  combineTokens(components.category.base, components.category.colors[category])
export const getAlertStyles = (variant: keyof typeof components.alert.variants = 'info') =>
  combineTokens(components.alert.base, components.alert.variants[variant])

// Export everything as a single tokens object
export const tokens = {
  typography,
  colors,
  spacing,
  components,
  layout,
  transitions
} as const

export default tokens
