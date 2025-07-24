import Link from "next/link"

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-black text-white">
      <div className="max-w-[1360px] mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold text-white hover:text-gray-300 transition-colors flex items-baseline" // Changed to items-baseline
          >
            Weblog
            <span className="ml-1 text-orange-500 text-4xl leading-none">.</span>{" "}
            {/* Period character, adjusted size and spacing */}
          </Link>
          <div className="flex space-x-8">
            <Link href="/" className="text-sm hover:text-gray-300 transition-colors">
              Posts
            </Link>
            <Link href="/about" className="text-sm hover:text-gray-300 transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
