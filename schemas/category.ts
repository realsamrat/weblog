import { defineField, defineType } from 'sanity'
import { generateRandomPastelColor } from '../lib/utils'
import { ColorInput } from '../components/sanity/ColorInput'

export default defineType({
  name: 'category',
  title: 'Category',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Pastel color for the category (click randomize to generate new color)',
      initialValue: () => generateRandomPastelColor(),
      components: {
        input: ColorInput,
      },
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Must be a valid hex color'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})
