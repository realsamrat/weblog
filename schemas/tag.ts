import { defineField, defineType } from 'sanity'
import { generatePastelColor } from '../lib/utils'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Auto-generated pastel color for the tag',
      initialValue: (doc, context) => {
        return doc?.name ? generatePastelColor(doc.name) : '#E5E7EB'
      },
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Must be a valid hex color'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
