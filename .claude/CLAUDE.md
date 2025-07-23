# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.2.4 blog application with a sophisticated rich text editor built on Tiptap 3.0 (beta). The project uses TypeScript, Prisma ORM with PostgreSQL, and follows the App Router pattern.

## Development Commands

```bash
# Development (using Doppler for secrets management)
doppler run -- npm run dev   # Start development server on http://localhost:3000
doppler run -- npm run build # Build for production
doppler run -- npm run start # Start production server
npm run lint                 # Run ESLint

# Database Management (requires Doppler for DATABASE_URL)
doppler run -- npm run db:generate  # Generate Prisma client after schema changes
doppler run -- npm run db:push      # Push schema changes to database (dev only)
doppler run -- npm run db:migrate   # Run database migrations (production)
doppler run -- npm run db:studio    # Open Prisma Studio GUI for database inspection
doppler run -- npm run db:seed      # Seed database with initial data
```

**Note**: This project uses Doppler for secrets management. All commands that require environment variables (like DATABASE_URL) must be prefixed with `doppler run --`.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.2.4 with App Router, React 19.1.0, TypeScript 5.8.3
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM 5.22.0
- **Rich Text**: Tiptap 3.0 (beta) with custom extensions
- **Forms**: React Hook Form with Zod validation

### Key Directories
- `/app` - Next.js App Router pages, layouts, and API routes
- `/components` - Reusable React components
- `/components/ui` - shadcn/ui components with custom extensions for rich text editing
- `/lib` - Utility functions, database client, and business logic
- `/prisma` - Database schema and seed scripts
- `/public/uploads` - User-uploaded images
- `/external-libs/mui-tiptap` - Vendored Tiptap integration library

### Database Schema
The application uses 5 main entities:
- **Post**: Blog posts with status (DRAFT/PUBLISHED/ARCHIVED), featured flag, and relations
- **Author**: Content creators with profile information
- **Category**: Post categorization with color coding
- **Tag**: Many-to-many relationship with posts
- **PostTag**: Junction table for post-tag relationships

### Environment Configuration
- **Doppler**: All secrets are managed through Doppler. Use `doppler run --` prefix for commands requiring environment variables
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **Required Variables**: See `env.example` for required environment variables

## Rich Text Editor Features

The editor (`/components/ui/rich-text-editor.tsx`) includes custom extensions for:
- **Image handling**: Resize controls, galleries with drag-and-drop
- **Code blocks**: Syntax highlighting and preview
- **JavaScript embedding**: Execute JS in posts
- **Alert blocks**: Custom styled notifications
- **iFrame embedding**: External content integration

## Important Patterns

### Server Actions
Dashboard operations use Next.js server actions (see `/app/dashboard/actions.ts`):
- `createPost`, `updatePost`, `deletePost`
- `createCategory`, `updateCategory`, `deleteCategory`

### Image Uploads
File uploads are handled via `/app/api/upload/route.ts` with UUID-based naming to `/public/uploads/`.

### State Management
- Dashboard state via React Context (`/components/dashboard/dashboard-provider.tsx`)
- Posts management context (`/components/dashboard/posts-provider.tsx`)
- Form state with React Hook Form

## Testing and Quality

Currently no test suite is configured. When implementing tests:
1. Check for testing framework in package.json first
2. Follow existing patterns if tests exist
3. Ask user for preferred testing approach if needed

## Common Tasks

### Adding a New Post Field
1. Update Prisma schema in `/prisma/schema.prisma`
2. Run `npm run db:generate` and `npm run db:push`
3. Update Post type definitions
4. Modify form schema in dashboard components
5. Update server actions to handle new field

### Extending Rich Text Editor
1. Create extension in `/components/ui/` following existing patterns
2. Import and configure in `rich-text-editor.tsx`
3. Add toolbar controls if needed
4. Update content rendering in post display components

### Creating New Dashboard Pages
1. Add route in `/app/dashboard/[feature]/page.tsx`
2. Create corresponding components in `/components/dashboard/`
3. Implement server actions for data operations
4. Follow existing patterns for loading states and error handling