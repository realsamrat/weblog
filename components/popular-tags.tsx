import React from "react"
import Link from "next/link"

interface PopularTagsProps {
  tags: { _id: string; name: string; slug: { current: string }; postCount: number }[]
}

export default function PopularTags({ tags }: PopularTagsProps) {
  return (
    <div className="mb-10">
      <h3 className="font-sf-pro-display text-lg font-semibold mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag._id}
            href={`/tags/${tag.slug.current}`}
            className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors cursor-pointer"
          >
            {tag.name} <span className="text-gray-500 ml-1">{tag.postCount}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
