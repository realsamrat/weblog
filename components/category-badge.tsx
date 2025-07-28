import { getCategoryStyles } from "@/lib/utils"

interface CategoryBadgeProps {
  category: {
    name: string
    color?: string
  } | string
  darkBackground?: boolean
  className?: string
}

export default function CategoryBadge({ 
  category, 
  darkBackground = false,
  className = ""
}: CategoryBadgeProps) {
  const categoryName = typeof category === 'string' ? category : category.name
  const categoryColor = typeof category === 'string' ? undefined : category.color
  
  return (
    <>
      {/* Light mode version */}
      <span 
        className={`dark:hidden inline-block text-xs px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wide transition-all duration-200 hover:shadow-sm ${className}`}
        style={getCategoryStyles(categoryColor, darkBackground)}
      >
        {categoryName}
      </span>
      
      {/* Dark mode version - always use dark background styles */}
      <span 
        className={`hidden dark:inline-block text-xs px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wide transition-all duration-200 hover:shadow-sm ${className}`}
        style={getCategoryStyles(categoryColor, true)}
      >
        {categoryName}
      </span>
    </>
  )
}