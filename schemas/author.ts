import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'url',
      description: 'URL to avatar image',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'bio',
    },
  },
})
