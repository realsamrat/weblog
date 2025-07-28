import React from "react"
import Link from "next/link"

interface PopularTagsProps {
  tags: { _id: string; name: string; slug: { current: string }; postCount: number }[]
}

export default function PopularTags({ tags }: PopularTagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="mb-10 blur-element">
      <h3 className="font-sf-pro-display text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag._id}
            href={`/tags/${tag.slug.current}`}
            className="text-[13px] px-2 py-1 bg-[#FFF2E4] dark:bg-gray-800 text-[#5E5143] dark:text-gray-300 rounded border border-[#E5B98A] dark:border-gray-700 hover:bg-[#FFE8D1] dark:hover:bg-gray-700 hover:border-[#D4A574] dark:hover:border-gray-600 transition-colors cursor-pointer"
          >
            {tag.name} <span className="text-[#5E5143]/70 dark:text-gray-500 ml-1">{tag.postCount}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
