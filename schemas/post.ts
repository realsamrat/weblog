import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image.',
            },
          ],
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: 'Code Block',
          fields: [
            {
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'Python', value: 'python' },
                  { title: 'Java', value: 'java' },
                  { title: 'C++', value: 'cpp' },
                  { title: 'C', value: 'c' },
                  { title: 'C#', value: 'csharp' },
                  { title: 'PHP', value: 'php' },
                  { title: 'Ruby', value: 'ruby' },
                  { title: 'Go', value: 'go' },
                  { title: 'Rust', value: 'rust' },
                  { title: 'HTML', value: 'html' },
                  { title: 'CSS', value: 'css' },
                  { title: 'JSON', value: 'json' },
                  { title: 'XML', value: 'xml' },
                  { title: 'YAML', value: 'yaml' },
                  { title: 'Bash', value: 'bash' },
                  { title: 'Shell', value: 'shell' },
                  { title: 'SQL', value: 'sql' },
                  { title: 'Dockerfile', value: 'dockerfile' },
                  { title: 'Plain Text', value: 'plaintext' },
                ],
              },
              initialValue: 'javascript',
            },
            {
              name: 'code',
              title: 'Code',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'filename',
              title: 'Filename (optional)',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary of the post',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Featured Image URL',
      type: 'url',
      description: 'Featured image URL',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'DRAFT' },
          { title: 'Published', value: 'PUBLISHED' },
          { title: 'Archived', value: 'ARCHIVED' },
        ],
        layout: 'radio',
      },
      initialValue: 'DRAFT',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description: 'Tags for this post. Add custom tags manually, or use "Generate Tags" to append auto-generated ones based on content.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      status: 'status',
    },
    prepare(selection) {
      const { author, status } = selection
      return {
        ...selection,
        subtitle: `${status} ${author ? `by ${author}` : ''}`,
      }
    },
  },
})
