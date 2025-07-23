# Custom Fonts Guide

This folder contains custom font files for the Weblog project.

## 📁 **Folder Structure**
```
public/fonts/
├── README.md (this file)
├── woff2/          # Modern format (recommended)
├── woff/           # Fallback format
├── ttf/            # TrueType fonts
└── otf/            # OpenType fonts
```

## 🚀 **How to Add Custom Fonts**

### Method 1: Local Font Files (Recommended)

1. **Add font files** to `public/fonts/` directory:
   ```
   public/fonts/
   ├── MyCustomFont-Regular.woff2
   ├── MyCustomFont-Bold.woff2
   └── MyCustomFont-Italic.woff2
   ```

2. **Update `app/layout.tsx`**:
   ```tsx
   import localFont from 'next/font/local'

   const myCustomFont = localFont({
     src: [
       {
         path: '/fonts/MyCustomFont-Regular.woff2',
         weight: '400',
         style: 'normal',
       },
       {
         path: '/fonts/MyCustomFont-Bold.woff2',
         weight: '700',
         style: 'normal',
       },
       {
         path: '/fonts/MyCustomFont-Italic.woff2',
         weight: '400',
         style: 'italic',
       },
     ],
     variable: '--font-custom',
     display: 'swap',
   })

   export default function RootLayout({ children }) {
     return (
       <html className={`${myCustomFont.variable}`}>
         <body>{children}</body>
       </html>
     )
   }
   ```

3. **Update `app/globals.css`**:
   ```css
   .font-custom {
     font-family: var(--font-custom), sans-serif;
   }
   ```

### Method 2: Google Fonts (Current Setup)

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

### Method 3: CSS @font-face (Alternative)

Add to `app/globals.css`:
```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont-Regular.woff2') format('woff2'),
       url('/fonts/MyCustomFont-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.font-custom {
  font-family: 'MyCustomFont', sans-serif;
}
```

## 📋 **Font Format Priority**

1. **WOFF2** - Best compression, modern browsers
2. **WOFF** - Good compression, wider support
3. **TTF/OTF** - Fallback for older browsers

## 🎯 **Usage Examples**

```tsx
// In your components
<h1 className="font-serif">Heading (Crimson Text)</h1>
<p className="font-helvetica">Body text (Helvetica)</p>
<code className="font-mono">Code (JetBrains Mono)</code>

// Or using the semantic classes
<h1 className={fontClasses.serif}>Heading</h1>
<p className={fontClasses.sans}>Body text (now Helvetica)</p>
<code className={fontClasses.mono}>Code</code>
```

## ⚡ **Performance Tips**

- Use `font-display: swap` for better loading performance
- Preload critical fonts in `<head>`
- Use WOFF2 format for best compression
- Subset fonts to include only needed characters

## 🔧 **Current Fonts in Project**

- **Body Text**: Helvetica (Local WOFF files) - `font-helvetica` or `font-sans`
- **Headings**: Crimson Text (Google Fonts) - `font-serif`
- **Code**: JetBrains Mono (Google Fonts) - `font-mono`

## 🎯 **Usage Examples**

```tsx
// In your components
<h1 className="font-serif">Heading (Crimson Text)</h1>
<p className="font-helvetica">Body text (Helvetica)</p>
<code className="font-mono">Code (JetBrains Mono)</code>

// Or using the semantic classes
<h1 className={fontClasses.serif}>Heading</h1>
<p className={fontClasses.sans}>Body text (now Helvetica)</p>
<code className={fontClasses.mono}>Code</code>
```

## 📁 **Current Font Files**

### Helvetica (Body Text)
- `public/fonts/woff/Helvetica.woff` - Regular (400)
- `public/fonts/woff/Helvetica-Bold.woff` - Bold (700)
- `public/fonts/woff/Helvetica-Oblique.woff` - Italic (400)
- `public/fonts/woff/Helvetica-BoldOblique.woff` - Bold Italic (700) 