# Weblog Blog

A modern blog application built with Next.js, featuring a rich text editor with advanced image handling capabilities.

## Features

### Rich Text Editor with Tiptap 3.0

Our blog features a powerful rich text editor built on Tiptap 3.0 with the following capabilities:

#### Advanced Image Management
- **Single Images**: Full-featured image handling with resize controls
- **Image Galleries**: Grid-based layouts with multiple images side by side
- **Drag & Drop Upload**: Simply drag images into the editor
- **URL Import**: Insert images from external URLs
- **Advanced Resize Controls**: Professional image resizing with multiple options

#### Image Resize Features

The image component includes comprehensive resize and alignment capabilities:

**Resize Methods:**
- **Drag Resize**: Drag corner and edge handles to resize
- **Preset Sizes**: Quick resize to Small (300px), Medium (600px), Large (900px), or Original size
- **Custom Dimensions**: Enter exact pixel dimensions
- **Keyboard Shortcuts**: Use Shift+↑/↓ to resize in 10px increments

**Aspect Ratio Control:**
- **Lock/Unlock**: Toggle aspect ratio preservation (Ctrl+L)
- **Preset Ratios**: Square (1:1), Standard (4:3), Widescreen (16:9), Photo (3:2)
- **Original Ratio**: Restore to image's natural aspect ratio
- **Visual Indicator**: Shows current aspect ratio and lock status

**Alignment Options:**
- Left align (Ctrl+←)
- Center align (Ctrl+↑)  
- Right align (Ctrl+→)

**Additional Features:**
- **Download**: Save images directly from the editor
- **Delete**: Remove images with Delete/Backspace keys
- **Loading States**: Visual feedback during image loading
- **Real-time Dimensions**: See size and percentage while resizing
- **Keyboard Shortcuts**: Comprehensive keyboard support for power users

#### Image Gallery Features

The image gallery component provides a powerful way to display multiple images in organized grid layouts:

**Gallery Layouts:**
- **Responsive Columns**: 1, 2, 3, or 4 column layouts that adapt to screen size
- **Grid Spacing**: Small, medium, or large gaps between images
- **Aspect Ratios**: Auto, Square (1:1), Standard (4:3), or Widescreen (16:9)
- **Alignment**: Left, center, or right alignment for the entire gallery

**Gallery Management:**
- **Multiple Upload**: Upload multiple images at once via drag & drop or file selection
- **URL Import**: Add images from external URLs with optional captions
- **Drag Reorder**: Drag and drop images within the gallery to reorder them
- **Individual Controls**: Remove images or add captions to individual items
- **Responsive Design**: Automatically adapts to different screen sizes

**Gallery Creation:**
1. Click the Gallery button (grid icon) in the toolbar
2. Add images via upload or URL
3. Customize layout (columns, spacing, aspect ratio)
4. Drag images to reorder them
5. Add captions to individual images

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift + ↑/↓` | Resize image by 10px increments |
| `Ctrl + L` | Toggle aspect ratio lock |
| `Ctrl + R` | Reset to original size |
| `Ctrl + ←/↑/→` | Align left/center/right |
| `Delete/Backspace` | Delete image |

#### Other Editor Features
- **Code Blocks**: Syntax highlighting with language selection
- **JavaScript Embeds**: Execute JavaScript code safely within posts
- **Widget Embeds**: Support for external widgets and iframes
- **Alert Blocks**: Info, warning, success, and error callouts
- **Text Formatting**: Bold, italic, lists, headings, and more
- **Link Management**: Easy link insertion and editing

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Technology Stack

- **Next.js 14**: React framework with App Router
- **Tiptap 3.0**: Headless rich text editor
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Prisma**: Database ORM
- **Radix UI**: Accessible component primitives

## Image Upload API

The application includes a built-in image upload API at `/api/upload` that handles:
- File validation and size limits
- Secure file storage
- Automatic image optimization
- Support for PNG, JPG, GIF, and WebP formats

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 