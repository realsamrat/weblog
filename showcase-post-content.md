# Complete Style Guide: All Post Block Types

Welcome to the comprehensive style guide for our Weblog blog! This post demonstrates every type of content block and styling option available in our posting system. Use this as a reference when creating new content.

> This comprehensive guide covers all the styling patterns and components available in our blog system, from basic typography to advanced code blocks and special alert elements.

## Regular Paragraphs

This is a standard paragraph with normal text flow. It demonstrates the default typography settings including line height, font family (Arial), and text color. Paragraphs automatically have proper spacing between them and maintain readability across different screen sizes.

This is another paragraph to show the spacing between multiple paragraphs. Notice how the text flows naturally and maintains consistent formatting throughout the content area.

## Headings Hierarchy

### This is a Subsection Heading (H3)

Subsection headings use the serif font family (Crimson Text) and are slightly smaller than main section headings. They provide good visual hierarchy for organizing content within larger sections.

## Bold and Emphasis Text

**This entire paragraph is bold text** to demonstrate how bold formatting appears in the content. Bold text uses font-weight: semibold and maintains the same color and spacing as regular text.

This paragraph contains **bold inline text** mixed with regular text to show how emphasis can be applied to specific words or phrases within a sentence for highlighting important concepts.

## Special Alert Blocks

Our blog supports four types of special alert blocks for highlighting important information:

[!INFO]
This is an INFO block with a blue color scheme. Use this for general information, tips, or neutral announcements that readers should be aware of. The blue styling draws attention without being alarming.

[!TIP]
This is a TIP block with a yellow color scheme. Perfect for helpful suggestions, pro tips, best practices, or useful advice that can enhance the reader's understanding or experience.

[!WARNING]
This is a WARNING block with a red color scheme. Use this for important warnings, potential pitfalls, security concerns, or critical information that readers must pay attention to avoid problems.

[!SUCCESS]
This is a SUCCESS block with a green color scheme. Ideal for positive outcomes, completed steps, achievements, or confirmation messages that indicate something has been accomplished successfully.

## Code Blocks and Inline Code

### Inline Code

Here's an example of `inline code` within a paragraph. Inline code uses a monospace font (JetBrains Mono) with a gray background to distinguish it from regular text. You can use it for `variable names`, `function calls`, or `short code snippets`.

### JavaScript Code Block

```javascript
// This is a JavaScript code block with syntax highlighting
function calculateSum(a, b) {
  const result = a + b;
  console.log(`The sum of ${a} and ${b} is ${result}`);
  return result;
}

// Call the function
const total = calculateSum(10, 20);

// Array methods example
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log('Doubled numbers:', doubled);
```

### Python Code Block

```python
# This is a Python code block demonstration
class BlogPost:
    def __init__(self, title, content, author):
        self.title = title
        self.content = content
        self.author = author
        self.published = False
    
    def publish(self):
        """Publish the blog post"""
        self.published = True
        print(f"'{self.title}' has been published!")
    
    def get_word_count(self):
        return len(self.content.split())

# Create and publish a post
post = BlogPost("My First Post", "This is the content of my first post.", "John Doe")
post.publish()
print(f"Word count: {post.get_word_count()}")
```

### CSS Code Block

```css
/* This demonstrates CSS code block styling */
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.blog-post h2 {
  font-family: 'Crimson Text', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 2rem 0 1rem;
}

.code-block {
  background: #f8f9fa;
  border: 2px solid #000;
  border-radius: 8px;
  overflow: hidden;
}
```

### Terminal/Bash Code Block

```bash
# Terminal commands and bash scripting
ls -la
pwd
cd /path/to/project

# Git commands
git add .
git commit -m "Add new blog post with all styling examples"
git push origin main

# NPM commands
npm install
npm run build
npm start

# Create a new file and add content
echo "Hello World" > hello.txt
cat hello.txt
```

## Blockquotes

> This is a blockquote that demonstrates how quoted text appears in our blog. Blockquotes are perfect for highlighting important quotes, excerpts from other sources, or emphasizing key points from your content.

> Here's another blockquote to show how multiple blockquotes are handled. Notice the italic styling, left border, and background color that makes quoted content stand out from regular paragraphs.

## Lists and Structured Content

### Numbered Lists

1. This is the first item in a numbered list
2. Second item with some additional explanation text
3. Third item demonstrating consistent formatting
4. Fourth item to show proper spacing and alignment
5. Fifth item completing our numbered list example

### Bullet Point Lists

- First bullet point item
- Second bullet point with more detailed information
- Third bullet point demonstrating consistent styling
- Fourth bullet point showing proper indentation
- Fifth bullet point completing our unordered list

## Mixed Content Example

Here's a paragraph that combines multiple formatting types. It includes `inline code`, **bold text**, and regular text all in one paragraph to demonstrate how different styles work together seamlessly.

[!TIP]
When creating content, you can mix and match these different block types to create engaging and well-structured blog posts. The key is to use each type purposefully to enhance readability and user experience.

## Advanced Code Example with Comments

```typescript
// TypeScript example showing our design token system
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  publishedAt: Date | null;
  tags: string[];
  category: string;
}

// Function to create a new blog post
async function createBlogPost(postData: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const newPost: BlogPost = {
    id: generateUniqueId(),
    ...postData
  };
  
  // Save to database
  await database.posts.create(newPost);
  
  return newPost;
}

// Usage example
const post = await createBlogPost({
  title: "Complete Style Guide",
  content: "This post shows all our styling options...",
  author: { name: "John Doe", email: "john@example.com" },
  publishedAt: new Date(),
  tags: ["styling", "guide", "examples"],
  category: "Documentation"
});
```

## Combining Different Elements

This section demonstrates how different content types work together:

**Bold introduction**: Here's how you might start a section with bold text, then continue with regular content that includes `inline code snippets` and links to other resources.

> "The best way to learn about styling is to see all the options in action together." - This blockquote provides context for our comprehensive guide.

[!INFO]
Remember that good content structure uses these elements strategically, not just for visual variety. Each element should serve a specific purpose in communicating your message effectively.

### Final Code Example

```sql
-- SQL query example for our blog database
SELECT 
  posts.title,
  posts.publishedAt,
  authors.name as author_name,
  categories.name as category_name,
  COUNT(post_tags.tag_id) as tag_count
FROM posts
JOIN authors ON posts.author_id = authors.id
JOIN categories ON posts.category_id = categories.id
LEFT JOIN post_tags ON posts.id = post_tags.post_id
WHERE posts.published = true
GROUP BY posts.id, authors.name, categories.name
ORDER BY posts.publishedAt DESC
LIMIT 10;
```

## Conclusion

This post has demonstrated every available content block type and styling option in our blog system:

- Regular paragraphs with proper typography
- Heading hierarchy (H2 and H3)
- Bold text (both full paragraphs and inline)
- Four types of alert blocks (INFO, TIP, WARNING, SUCCESS)
- Inline code with monospace font
- Code blocks with language-specific formatting
- Blockquotes with distinctive styling
- Numbered and bulleted lists
- Mixed content combining multiple formats

**Next Steps**: Use this guide as a reference when creating new blog posts. Each element serves a specific purpose in creating engaging, readable, and well-structured content.

[!SUCCESS]
You now have access to a complete toolkit for creating beautifully formatted blog posts with consistent styling throughout our Weblog platform!
