/**
 * HTML content utilities for the rich text editor
 * Following the approach of modern platforms like Ghost, Notion, etc.
 * that store HTML directly instead of converting to/from markdown
 */

/**
 * Sanitize HTML content (basic sanitization)
 * In a production environment, you might want to use a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // For now, we trust the content from Tiptap since it's controlled
  // In production, you might want to add proper HTML sanitization here
  return html.trim()
}

/**
 * Check if content is HTML (contains HTML tags)
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false
  const htmlTagRegex = /<[^>]+>/
  return htmlTagRegex.test(content)
}

/**
 * Legacy function for backward compatibility with existing markdown content
 * This will only be used during migration of old markdown content to HTML
 */
export async function legacyMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return ''
  
  // If it's already HTML, return as-is
  if (isHtmlContent(markdown)) {
    return sanitizeHtml(markdown)
  }
  
  // For legacy markdown content, do a basic conversion
  // In practice, you'd run a one-time migration script to convert existing content
  try {
    const { marked } = await import('marked')
    
    let processedMarkdown = markdown
    
    // Process alert blocks
    processedMarkdown = processedMarkdown.replace(
      /^\[!(INFO|TIP|WARNING|SUCCESS|DANGER|QUOTE)\]\s*([\s\S]*?)(?=\n\n|\n\[!|\n#|$)/gm,
      '<div data-type="$1">$2</div>\n\n'
    )
    
    // Configure marked
    marked.setOptions({
      breaks: true,
      gfm: true
    })
    
    const html = await marked.parse(processedMarkdown)
    return sanitizeHtml(html)
  } catch (error) {
    console.error('Error converting legacy markdown to HTML:', error)
    return sanitizeHtml(markdown)
  }
} 