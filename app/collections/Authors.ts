import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  auth: true,
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
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 1000,
    },
    {
      name: 'avatar',
      type: 'text',
      admin: {
        description: 'URL to avatar image',
      },
    },
  ],
}