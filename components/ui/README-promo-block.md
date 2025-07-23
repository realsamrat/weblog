# Promotional Block Component

A flexible and reusable promotional block component perfect for events, products, newsletters, and VIP content.

## 📁 **File Location**
- Component: `components/ui/promo-block.tsx`
- Examples: `components/examples/promo-block-examples.tsx`

## 🚀 **Features**
- ✅ Fully customizable content
- ✅ Optional location and date display
- ✅ Custom logo/icon support
- ✅ Configurable button actions
- ✅ TechCrunch-style design
- ✅ TypeScript support
- ✅ Responsive design

## 📋 **Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Main headline text |
| `description` | `string` | ✅ | - | Promotional description |
| `buttonText` | `string` | ✅ | - | Call-to-action button text |
| `location` | `string` | ❌ | - | Event/promotion location |
| `date` | `string` | ❌ | - | Event/promotion date |
| `buttonAction` | `() => void` | ❌ | `console.log` | Button click handler |
| `logoText` | `string` | ❌ | `"TC"` | Logo/icon text |
| `variant` | `'techcrunch' \| 'custom'` | ❌ | `'techcrunch'` | Style variant |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

## 🎯 **Usage Examples**

### Basic Usage
```tsx
import PromoBlock from "@/components/ui/promo-block"

<PromoBlock
  title="Join Our Event"
  description="Don't miss this amazing opportunity!"
  buttonText="REGISTER NOW"
  buttonAction={() => window.open('/register')}
/>
```

### Event Promotion
```tsx
<PromoBlock
  title="AI Conference 2024"
  description="Connect with AI leaders and innovators."
  location="San Francisco, CA"
  date="March 20-22"
  buttonText="GET TICKETS"
  logoText="AI"
  buttonAction={() => alert("Redirecting to tickets...")}
/>
```

### Newsletter Signup
```tsx
<PromoBlock
  title="Weekly Tech Newsletter"
  description="Get the latest tech insights delivered to your inbox."
  buttonText="SUBSCRIBE"
  logoText="📧"
  buttonAction={() => console.log("Newsletter signup")}
/>
```

### Product Launch
```tsx
<PromoBlock
  title="New Product Launch"
  description="Early access to our revolutionary platform."
  buttonText="CLAIM ACCESS"
  logoText="🚀"
  className="border-blue-400"
/>
```

## 🎨 **Styling**

The component uses a TechCrunch-inspired design with:
- Green accent colors (`bg-green-500`, `text-green-600`)
- Clean, professional layout
- Responsive design
- Hover effects on buttons

### Custom Styling
You can customize the appearance by:
1. Using the `className` prop for additional styles
2. Modifying the component's CSS classes
3. Creating new variants in the component

## 📦 **Integration Examples**

### In Blog Posts
```tsx
// In your blog post content
<PromoBlock
  title="Exclusive: Premium Content Access"
  description="Unlock advanced tutorials and insider insights."
  buttonText="UPGRADE NOW"
  logoText="⭐"
/>
```

### In Sidebar
```tsx
// In your sidebar component
<PromoBlock
  title="Join Our Community"
  description="Connect with 10,000+ developers."
  buttonText="JOIN NOW"
  logoText="👥"
  className="max-w-sm"
/>
```

### Landing Pages
```tsx
// In landing page sections
<PromoBlock
  title="Limited Time Offer"
  description="50% off all premium features."
  date="Ends Soon"
  buttonText="CLAIM DEAL"
  logoText="💎"
/>
```

## 🔧 **Customization**

To create custom variants:

1. **Add new variant types**:
```tsx
variant?: 'techcrunch' | 'custom' | 'dark' | 'minimal'
```

2. **Implement variant-specific styling**:
```tsx
const getVariantClasses = (variant: string) => {
  switch (variant) {
    case 'dark':
      return 'bg-gray-900 border-gray-700'
    case 'minimal':
      return 'border-gray-200 shadow-sm'
    default:
      return 'border-emerald-400 bg-white'
  }
}
```

## 🎭 **TechCrunch Compatibility**

For backward compatibility, the original TechCrunch component is exported:

```tsx
import { TechCrunchPromoBlock } from "@/components/ui/promo-block"

<TechCrunchPromoBlock />
```

This renders the exact original design with predefined content. 