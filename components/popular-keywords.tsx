interface PopularKeywordsProps {
  keywords: { name: string; count: number }[]
}

export default function PopularKeywords({ keywords }: PopularKeywordsProps) {
  return (
    <div className="mb-10">
      <h3 className="font-serif text-lg font-semibold mb-3">Popular Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword.name}
            className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-colors cursor-pointer"
          >
            {keyword.name} <span className="text-gray-500 ml-1">({keyword.count})</span>
          </span>
        ))}
      </div>
    </div>
  )
}
