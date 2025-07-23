/**
 * Design Tokens Usage Examples
 * 
 * This file demonstrates how to use the design tokens in your components
 * to maintain consistency across your blog application.
 */

import { getKeywordStyles, getCategoryStyles, getAlertStyles, components, layout, colors } from './design-tokens'

// Example 1: Using keyword styles
export function KeywordExample({ keywords }: { keywords: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <span key={keyword} className={getKeywordStyles()}>
          {keyword}
        </span>
      ))}
    </div>
  )
}

// Example 2: Using category styles
export function CategoryBadgeExample({ category }: { category: string }) {
  const categoryKey = category.toLowerCase() as keyof typeof components.category.colors
  return (
    <span className={getCategoryStyles(categoryKey)}>
      {category}
    </span>
  )
}

// Example 3: Using alert styles
export function AlertExample({ type, message }: { type: 'info' | 'tip' | 'warning' | 'success', message: string }) {
  return (
    <div className={getAlertStyles(type)}>
      {message}
    </div>
  )
}

// Example 4: Using navigation tokens
export function NavigationExample() {
  return (
    <nav className={components.navigation.container}>
      <div className={components.navigation.wrapper}>
        <div className="flex items-center justify-between">
          <a href="/" className={components.navigation.logo}>
            Weblog
            <span className={components.navigation.logoAccent}>.</span>
          </a>
          <div className="flex space-x-8">
            <a href="/" className={components.navigation.link}>Posts</a>
            <a href="/about" className={components.navigation.link}>About</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Example 5: Using card tokens
export function BlogPostCardExample({ title, excerpt, date, slug }: any) {
  return (
    <article className={components.card.blogPost.container}>
      <h2 className={components.card.blogPost.title}>
        <a href={`/posts/${slug}`}>{title}</a>
      </h2>
      <p className={components.card.blogPost.excerpt}>{excerpt}</p>
      <a href={`/posts/${slug}`} className={components.card.blogPost.readMore}>
        Read more →
      </a>
    </article>
  )
}

// Example 6: Using layout tokens
export function LayoutExample({ children }: { children: React.ReactNode }) {
  return (
    <div className={layout.container.content}>
      <main className={layout.container.main}>
        <div className={layout.grid.mainContent}>
          {children}
        </div>
      </main>
    </div>
  )
}

// Example 7: Code block using tokens
export function CodeBlockExample({ language, code }: { language: string, code: string }) {
  return (
    <div className={components.code.block.container}>
      <div className={components.code.block.header}>
        <span className={components.code.block.headerText}>{language}</span>
      </div>
      <pre className={components.code.block.content}>
        <code className={components.code.block.text}>{code}</code>
      </pre>
    </div>
  )
}

// Example 8: Sidebar using tokens
export function SidebarExample({ children }: { children: React.ReactNode }) {
  return (
    <aside className={components.sidebar.container}>
      <div className={components.sidebar.sticky}>
        <div className={components.sidebar.section}>
          <h3 className={components.sidebar.title}>Sidebar Section</h3>
          {children}
        </div>
      </div>
    </aside>
  )
}

// Example 9: Typography usage
export function TypographyExample() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Main Heading</h1>
      <h2 className={components.heading.h2}>Section Heading</h2>
      <h3 className={components.heading.h3}>Subsection Heading</h3>
      <p className="text-base leading-relaxed text-black">Body text example</p>
      <code className={components.code.inline}>inline code</code>
    </div>
  )
}

// Example 10: Using tokens with custom combinations
export function CustomComponentExample() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-serif text-lg font-semibold mb-3">Custom Component</h3>
        <p className="text-sm text-gray-600 mb-4">
          This component uses multiple design tokens for consistent styling.
        </p>
        <div className="flex gap-2">
          <span className={getKeywordStyles()}>Design</span>
          <span className={getKeywordStyles()}>Tokens</span>
          <span className={getCategoryStyles('programming')}>Programming</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Migration Guide:
 * 
 * To migrate existing components to use design tokens:
 * 
 * 1. Replace hardcoded Tailwind classes with token imports
 * 2. Use helper functions for common patterns
 * 3. Combine tokens when needed using combineTokens()
 * 
 * Before:
 * <span className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400">
 * 
 * After:
 * <span className={getKeywordStyles()}>
 * 
 * Or:
 * import { components } from './design-tokens'
 * <span className={components.keyword.base}>
 */
