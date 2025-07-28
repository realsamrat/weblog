# Weblog Blog

A modern blog platform built with Next.js, Prisma, and Sanity CMS.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Doppler CLI for environment management

### Development Setup

1. **Environment Variables**
   This project uses Doppler for secret management. Make sure you have access to the `weblog-ops` project.
   
   Required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET`: Sanity dataset (usually "production")
   - `NEXT_PUBLIC_SERVER_URL`: Your application URL

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 Content Management

### Sanity Studio

Access the Sanity Studio at: `http://localhost:3000/studio`

### Features

- **Rich Text Editor**: Create and edit blog posts with Sanity's Portable Text editor
- **Media Management**: Upload and manage images and files
- **Categories & Tags**: Organize content with categories and tags
- **Authors**: Manage multiple authors for the blog
- **Draft/Published Status**: Control post visibility and publication

### Content Types

- **Posts**: Manage blog posts with rich text content
- **Categories**: Organize posts by category
- **Tags**: Tag posts for better organization
- **Authors**: Manage blog authors

## 🛠 Development Scripts

- `npm run dev` - Start development server with Doppler
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:studio` - Open Prisma Studio

## 🔒 Security

All sensitive configuration is managed through Doppler. The application automatically loads environment variables when running commands through `doppler run --`.

## 📚 Tech Stack

- **Framework**: Next.js 15
- **Database**: PostgreSQL with Prisma ORM
- **CMS**: Sanity CMS
- **Styling**: Tailwind CSS
- **Rich Text**: Portable Text
- **Secrets**: Doppler
- **Deployment**: Vercel (recommended)

## Image Upload API

The application includes a built-in image upload API at `/api/upload` that handles:
- File validation and size limits
- Secure file storage
- Automatic image optimization
- Support for PNG, JPG, GIF, and WebP formats

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.  