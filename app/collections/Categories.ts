import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .trim()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#6B7280',
      admin: {
        description: 'Hex color code for the category',
        position: 'sidebar',
      },
    },
  ],
}