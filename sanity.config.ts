import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { updatePostKeywords } from './lib/sanity'

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
              await updatePostKeywords(doc._id)
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
                await updatePostKeywords(doc._id)
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
