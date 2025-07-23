import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Weblog CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [structureTool(), visionTool()],

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'post') {
        const generateKeywordsAction = (props: any) => ({
          label: 'Generate Keywords',
          icon: () => '🔑',
          onHandle: async () => {
            const { draft, published } = props
            const doc = draft || published
            if (doc?._id) {
              try {
                const response = await fetch('/api/generate-keywords', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ postId: doc._id })
                })
                if (!response.ok) {
                  throw new Error('Failed to generate keywords')
                }
                window.location.reload()
              } catch (error) {
                console.error('Error generating keywords:', error)
                alert('Failed to generate keywords. Please try again.')
              }
            }
          }
        })
        return [...prev, generateKeywordsAction]
      }
      return prev
    },
    publishAction: (prev: any, context: any) => {
      if (context.schemaType === 'post') {
        return (props: any) => {
          const originalResult = prev(props)
          return {
            ...originalResult,
            onHandle: async () => {
              const result = await originalResult.onHandle()
              const { draft, published } = props
              const doc = draft || published
              if (doc?._id) {
                try {
                  await fetch('/api/generate-keywords', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId: doc._id })
                  })
                } catch (error) {
                  console.error('Error auto-generating keywords:', error)
                }
              }
              return result
            }
          }
        }
      }
      return prev
    }
  },

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
})
