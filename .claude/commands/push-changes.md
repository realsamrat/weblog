Push all changes to git with a clean commit message. The user will specify the branch name or request to create a new branch after the command.

**Important**: Do NOT include any references to Claude, Anthropic, AI generation, or any related email addresses in the commit message.

Workflow:

1. First, check git status to see what files have been modified
2. Stage all changes with `git add -A`
3. Show the staged files to the user
4. Create a clean, professional commit message that:
   - Follows conventional commit format (feat:, fix:, docs:, etc.)
   - Describes the changes made
   - Includes bullet points for multiple changes
   - Does NOT mention Claude, Anthropic, or AI generation
   - Does NOT include any noreply email addresses
5. If user specifies a branch name:
   - If it's a new branch name, create and switch to it first
   - Push to the specified branch
6. If user specifies "current branch", push to the current branch
7. Confirm the push was successful

Example commit message format:

```
fix: Update API endpoints and improve error handling

- Fix database queries to use correct table names
- Improve natural language processing for chat queries
- Add diagnostic scripts for testing
- Enhance error messages for better debugging
```

Never include:

- "Generated with Claude"
- "Co-Authored-By: Claude <noreply@anthropic.com>"
- Any mention of AI assistance
- Any anthropic.com email addresses
