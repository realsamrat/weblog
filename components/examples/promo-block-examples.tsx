import PromoBlock, { TechCrunchPromoBlock } from "@/components/ui/promo-block"

export function PromoBlockExamples() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Promotional Block Examples</h2>
      
      {/* Original TechCrunch version */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Original TechCrunch Style</h3>
        <TechCrunchPromoBlock />
      </div>

      {/* Custom event promotion */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Custom Event Promotion</h3>
        <PromoBlock
          title="Join our AI Summit 2024"
          description="Connect with leading AI researchers, developers, and entrepreneurs. Learn about the latest breakthroughs in machine learning, neural networks, and artificial intelligence applications."
          location="San Francisco, CA"
          date="March 20-22"
          buttonText="GET TICKETS"
          logoText="AI"
          buttonAction={() => {
            alert("Redirecting to ticket purchase...")
          }}
        />
      </div>

      {/* Product launch promotion */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. Product Launch Promotion</h3>
        <PromoBlock
          title="Early Access: New Developer Tools"
          description="Be among the first to experience our revolutionary development platform. Get 50% off your first year subscription and exclusive access to premium features."
          buttonText="CLAIM EARLY ACCESS"
          logoText="DEV"
          buttonAction={() => {
            window.open('/signup', '_blank')
          }}
        />
      </div>

      {/* Newsletter signup */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. Newsletter Signup</h3>
        <PromoBlock
          title="Stay Updated with Weekly Tech Insights"
          description="Get the latest trends, tutorials, and industry news delivered straight to your inbox. Join 50,000+ developers who trust our curated content."
          buttonText="SUBSCRIBE NOW"
          logoText="📧"
          buttonAction={() => {
            console.log("Newsletter signup clicked")
          }}
        />
      </div>

      {/* Course promotion */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5. Course Promotion</h3>
        <PromoBlock
          title="Master React in 30 Days - Limited Time Offer"
          description="From basics to advanced patterns, build real-world applications with our comprehensive React course. Includes project-based learning and lifetime access."
          date="Starts Soon"
          buttonText="ENROLL TODAY"
          logoText="⚛️"
          className="border-blue-400"
          buttonAction={() => {
            window.location.href = '/courses/react'
          }}
        />
      </div>
    </div>
  )
}

// Usage instructions for developers
/*
Basic Usage:
```tsx
import PromoBlock from "@/components/ui/promo-block"

<PromoBlock
  title="Your promotional title"
  description="Your promotional description"
  buttonText="CALL TO ACTION"
  buttonAction={() => {
    // Your action logic here
  }}
/>
```

With location and date:
```tsx
<PromoBlock
  title="Event Title"
  description="Event description"
  location="City, State"
  date="Date"
  buttonText="REGISTER"
  logoText="LOGO"
  buttonAction={() => console.log("clicked")}
/>
```

Custom styling:
```tsx
<PromoBlock
  title="Custom Styled Block"
  description="Description"
  buttonText="ACTION"
  className="border-blue-400 shadow-lg"
/>
```
*/ 