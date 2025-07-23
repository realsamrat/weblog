// Example usage of fonts in your components
// This file is for reference only - copy the patterns to your actual components

import { fontClasses } from "@/lib/fonts"

export function FontExamples() {
  return (
    <div className="space-y-6 p-6">
      {/* Helvetica (Body font) */}
      <div>
        <h3 className={fontClasses.helvetica}>Helvetica Font (Body Text)</h3>
        <p className={fontClasses.helvetica}>
          This is regular text using Helvetica font. 
          Clean, professional, and perfect for body text and UI elements.
        </p>
      </div>

      {/* Serif (Crimson Text - Headings) */}
      <div>
        <h3 className={fontClasses.serif}>Serif Font (Crimson Text - Headings)</h3>
        <p className={fontClasses.serif}>
          This is text using Crimson Text serif font. 
          Perfect for headings and elegant content.
        </p>
      </div>

      {/* Monospace (JetBrains Mono) */}
      <div>
        <h3 className={fontClasses.mono}>Monospace Font (JetBrains Mono)</h3>
        <code className={fontClasses.mono}>
          const code = "This is code using JetBrains Mono";
          console.log("Perfect for code blocks and technical content");
        </code>
      </div>

      {/* Recommended usage pattern */}
      <div>
        <h1 className={`text-3xl font-bold ${fontClasses.serif}`}>
          Article Title (Crimson Text)
        </h1>
        <p className={`text-lg ${fontClasses.helvetica}`}>
          Article content in Helvetica font for clean, professional reading experience.
          This is the recommended setup for your blog.
        </p>
        <pre className={`bg-gray-100 p-4 rounded ${fontClasses.mono}`}>
          {`// Code example in JetBrains Mono
function example() {
  return "Monospace for code";
}`}
        </pre>
      </div>

      {/* Font weight examples */}
      <div>
        <h3 className={fontClasses.serif}>Font Weight Examples</h3>
        <div className={fontClasses.helvetica}>
          <p className="font-normal">Helvetica Regular (400)</p>
          <p className="font-bold">Helvetica Bold (700)</p>
          <p className="font-normal italic">Helvetica Oblique (400 italic)</p>
          <p className="font-bold italic">Helvetica Bold Oblique (700 italic)</p>
        </div>
      </div>
    </div>
  )
}

// Usage in your components:
/*
import { fontClasses } from "@/lib/fonts"

<h1 className={fontClasses.serif}>Heading (Crimson Text)</h1>
<p className={fontClasses.helvetica}>Body text (Helvetica)</p>
<code className={fontClasses.mono}>Code (JetBrains Mono)</code>

// Or use the default classes:
<h1 className="font-serif">Heading</h1>
<p className="font-helvetica">Body text</p>
<code className="font-mono">Code</code>
*/ 