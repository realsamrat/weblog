import Navigation from "@/components/navigation"

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4">
        <article>
          <header className="mb-8">
            <h1 className="font-serif text-3xl font-bold leading-tight mb-4">About Weblog</h1>
          </header>

          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              Welcome to Weblog, a personal technology blog dedicated to exploring the fascinating intersections of
              artificial intelligence, programming, and cybersecurity.
            </p>

            <p>
              In an era where technology evolves at breakneck speed, this blog serves as a space to dive deep into the
              concepts, tools, and methodologies that shape our digital world. Whether you're a seasoned developer, a
              security professional, or someone curious about the latest developments in AI, you'll find thoughtful
              analysis and practical insights here.
            </p>

            <h2 className="font-serif text-xl font-semibold mt-8 mb-4">What You'll Find Here</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-semibold mb-2">Artificial Intelligence</h3>
                <p className="text-gray-600">
                  Deep dives into machine learning algorithms, neural network architectures, and the ethical
                  implications of AI development.
                </p>
              </div>

              <div>
                <h3 className="font-serif font-semibold mb-2">Programming</h3>
                <p className="text-gray-600">
                  Best practices, design patterns, and emerging technologies across various programming languages and
                  frameworks.
                </p>
              </div>

              <div>
                <h3 className="font-serif font-semibold mb-2">Security</h3>
                <p className="text-gray-600">
                  Cybersecurity strategies, vulnerability analysis, and practical guides for building secure
                  applications.
                </p>
              </div>
            </div>

            <h2 className="font-serif text-xl font-semibold mt-8 mb-4">Philosophy</h2>

            <p>
              Technology should be accessible, understandable, and used responsibly. This blog aims to break down
              complex topics into digestible insights while maintaining technical depth and accuracy.
            </p>

            <p>
              Every post is crafted with care, backed by research, and written with the goal of providing genuine value
              to the reader. The focus is on quality over quantity, ensuring each piece contributes meaningfully to the
              ongoing conversation about technology's role in our lives.
            </p>
          </div>
        </article>
      </main>

      <footer className="mt-20 border-t border-gray-200 py-4">
        {" "}
        {/* Reduced py-8 to py-4 */}
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">© 2024 Weblog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
