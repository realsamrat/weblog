import { Status } from '@prisma/client'
import { prisma } from '../lib/db'

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ai' },
      update: {},
      create: {
        name: 'AI',
        slug: 'ai',
        description: 'Articles about artificial intelligence and machine learning',
        color: '#0EA5E9' // sky-500
      }
    }),
    prisma.category.upsert({
      where: { slug: 'security' },
      update: {},
      create: {
        name: 'Security',
        slug: 'security',
        description: 'Cybersecurity best practices and vulnerabilities',
        color: '#F43F5E' // rose-500
      }
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and best practices',
        color: '#10B981' // emerald-500
      }
    }),
    prisma.category.upsert({
      where: { slug: 'general' },
      update: {},
      create: {
        name: 'General',
        slug: 'general',
        description: 'General technology articles',
        color: '#6B7280' // gray-500
      }
    })
  ])

  console.log('✅ Created categories:', categories.map(c => c.name))

  // Create authors
  const authors = await Promise.all([
    prisma.author.upsert({
      where: { email: 'simon@example.com' },
      update: {},
      create: {
        name: 'Simon Willison',
        email: 'simon@example.com',
        bio: 'Software engineer and AI researcher with a passion for open source.',
      }
    }),
    prisma.author.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        name: 'Jane Dev',
        email: 'jane@example.com',
        bio: 'Full-stack developer specializing in modern web technologies.',
      }
    })
  ])

  console.log('✅ Created authors:', authors.map(a => a.name))

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'transformer' },
      update: {},
      create: { name: 'transformer', slug: 'transformer' }
    }),
    prisma.tag.upsert({
      where: { slug: 'attention' },
      update: {},
      create: { name: 'attention', slug: 'attention' }
    }),
    prisma.tag.upsert({
      where: { slug: 'neural-networks' },
      update: {},
      create: { name: 'neural-networks', slug: 'neural-networks' }
    }),
    prisma.tag.upsert({
      where: { slug: 'deep-learning' },
      update: {},
      create: { name: 'deep-learning', slug: 'deep-learning' }
    }),
    prisma.tag.upsert({
      where: { slug: 'nlp' },
      update: {},
      create: { name: 'nlp', slug: 'nlp' }
    }),
    prisma.tag.upsert({
      where: { slug: 'ai-architecture' },
      update: {},
      create: { name: 'ai-architecture', slug: 'ai-architecture' }
    }),
    prisma.tag.upsert({
      where: { slug: 'machine-learning' },
      update: {},
      create: { name: 'machine-learning', slug: 'machine-learning' }
    }),
    prisma.tag.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: { name: 'nodejs', slug: 'nodejs' }
    }),
    prisma.tag.upsert({
      where: { slug: 'security' },
      update: {},
      create: { name: 'security', slug: 'security' }
    }),
    prisma.tag.upsert({
      where: { slug: 'authentication' },
      update: {},
      create: { name: 'authentication', slug: 'authentication' }
    }),
    prisma.tag.upsert({
      where: { slug: 'jwt' },
      update: {},
      create: { name: 'jwt', slug: 'jwt' }
    }),
    prisma.tag.upsert({
      where: { slug: 'functional-programming' },
      update: {},
      create: { name: 'functional-programming', slug: 'functional-programming' }
    }),
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: { name: 'javascript', slug: 'javascript' }
    }),
    prisma.tag.upsert({
      where: { slug: 'pure-functions' },
      update: {},
      create: { name: 'pure-functions', slug: 'pure-functions' }
    })
  ])

  console.log('✅ Created tags:', tags.length)

  // Create posts
  const aiCategory = categories.find(c => c.slug === 'ai')
  const securityCategory = categories.find(c => c.slug === 'security')
  const programmingCategory = categories.find(c => c.slug === 'programming')
  const simonAuthor = authors.find(a => a.email === 'simon@example.com')
  const janeAuthor = authors.find(a => a.email === 'jane@example.com')

  // Post 1: AI Article
  const post1 = await prisma.post.upsert({
    where: { slug: 'understanding-large-language-models' },
    update: {},
    create: {
      title: 'Understanding Large Language Models: A Deep Dive into Transformer Architecture',
      slug: 'understanding-large-language-models',
      excerpt: 'Exploring the fundamental concepts behind modern AI language models and the transformer architecture that powers them.',
      content: `Large Language Models (LLMs) have revolutionized the field of artificial intelligence...

> The transformer architecture represents one of the most significant breakthroughs...

## The Transformer Revolution

The transformer architecture, introduced in the seminal paper "Attention Is All You Need"...

[!INFO]
The original transformer paper has been cited over 50,000 times...

### Key Components

**Self-Attention Mechanism**: The core innovation...

\`\`\`python
def attention(query, key, value):
  # Calculate attention scores
  scores = torch.matmul(query, key.transpose(-2, -1))
  # Apply softmax to get attention weights
  weights = torch.softmax(scores, dim=-1)
  # Apply weights to values
  output = torch.matmul(weights, value)
  return output
\`\`\`

**Multi-Head Attention**: Multiple attention mechanisms...

[!TIP]
Think of multi-head attention like having multiple experts...

**Position Encoding**: Since transformers don't inherently understand word order...

## Training Methodologies

[!WARNING]
Training large language models requires significant computational resources...

Modern LLMs are trained using a combination of techniques:

1. **Unsupervised Pre-training**: Models learn language patterns...
2. **Supervised Fine-tuning**: Adaptation to specific tasks...
3. **Reinforcement Learning from Human Feedback (RLHF)**: Alignment...

The training process typically involves:

\`\`\`bash
# Example training command
python train.py \\
--model_size large \\
--batch_size 32 \\
--learning_rate 1e-4 \\
--num_epochs 10
\`\`\`

## Implications and Future Directions

[!SUCCESS]
Recent advances in transformer architecture have led to models that can perform complex reasoning...

The development of LLMs raises important questions about the future of AI...

Understanding the underlying architecture of these systems is crucial...`,
      status: Status.PUBLISHED,
      featured: true,
      publishedAt: new Date('2024-01-15'),
      categoryId: aiCategory?.id,
      authorId: simonAuthor?.id!,
      tags: {
        create: [
          { tagId: tags.find(t => t.slug === 'transformer')?.id! },
          { tagId: tags.find(t => t.slug === 'attention')?.id! },
          { tagId: tags.find(t => t.slug === 'neural-networks')?.id! },
          { tagId: tags.find(t => t.slug === 'deep-learning')?.id! },
          { tagId: tags.find(t => t.slug === 'nlp')?.id! },
          { tagId: tags.find(t => t.slug === 'ai-architecture')?.id! },
          { tagId: tags.find(t => t.slug === 'machine-learning')?.id! },
        ]
      }
    }
  })

  // Post 2: Security Article
  const post2 = await prisma.post.upsert({
    where: { slug: 'securing-nodejs-applications' },
    update: {},
    create: {
      title: 'Securing Your Node.js Applications: Best Practices for 2024',
      slug: 'securing-nodejs-applications',
      excerpt: 'A comprehensive guide to implementing security measures in Node.js applications, covering authentication, authorization, and common vulnerabilities.',
      content: `Node.js applications are increasingly becoming targets for cyber attacks. This comprehensive guide covers essential security practices for 2024.

## Authentication and Authorization

Proper authentication is the first line of defense...

## Common Vulnerabilities

### SQL Injection
Even though Node.js doesn't use SQL directly...

### Cross-Site Scripting (XSS)
XSS attacks remain one of the most common...

## Best Practices

1. **Use HTTPS everywhere**
2. **Implement proper input validation**
3. **Keep dependencies updated**
4. **Use security headers**

\`\`\`javascript
// Example security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000'
}));
\`\`\``,
      status: Status.PUBLISHED,
      featured: false,
      publishedAt: new Date('2024-01-10'),
      categoryId: securityCategory?.id,
      authorId: simonAuthor?.id!,
      tags: {
        create: [
          { tagId: tags.find(t => t.slug === 'nodejs')?.id! },
          { tagId: tags.find(t => t.slug === 'security')?.id! },
          { tagId: tags.find(t => t.slug === 'authentication')?.id! },
          { tagId: tags.find(t => t.slug === 'jwt')?.id! },
        ]
      }
    }
  })

  // Post 3: Programming Article (Draft)
  const post3 = await prisma.post.upsert({
    where: { slug: 'functional-programming-javascript' },
    update: {},
    create: {
      title: 'Functional Programming Patterns in JavaScript',
      slug: 'functional-programming-javascript',
      excerpt: 'Exploring functional programming concepts and patterns that can make your JavaScript code more predictable and maintainable.',
      content: `Functional programming offers a powerful paradigm for writing cleaner, more maintainable code.

## Core Concepts

### Pure Functions
Functions that always return the same output for the same input...

### Immutability
Avoiding mutation of data structures...

### Higher-Order Functions
Functions that operate on other functions...

\`\`\`javascript
// Example of higher-order function
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
\`\`\``,
      status: Status.DRAFT,
      featured: false,
      categoryId: programmingCategory?.id,
      authorId: janeAuthor?.id!,
      tags: {
        create: [
          { tagId: tags.find(t => t.slug === 'functional-programming')?.id! },
          { tagId: tags.find(t => t.slug === 'javascript')?.id! },
          { tagId: tags.find(t => t.slug === 'pure-functions')?.id! },
        ]
      }
    }
  })

  console.log('✅ Created posts:', [post1.title, post2.title, post3.title])

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 