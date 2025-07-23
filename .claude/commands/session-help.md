Show help for the session management system:

## Session Management Commands

The session system helps document development work for future reference.

### Available Commands:

**Session Management:**

- `/project:session-start [name]` - Start a new session with optional name
- `/project:session-update [notes]` - Add notes to current session
- `/project:session-end` - End session with comprehensive summary
- `/project:session-list` - List all session files
- `/project:session-current` - Show current session status
- `/project:session-help` - Show this help

**Git Operations:**

- `/push-changes [branch]` - Commit and push all changes to specified branch
  - Creates clean commit messages without AI references
  - Use: `/push-changes main` or `/push-changes feature/new-feature`
  - Specify "current branch" to push to current branch

### How It Works:

1. Sessions are markdown files in `.claude/sessions/`
2. Files use `YYYY-MM-DD-HHMM-name.md` format
3. Only one session can be active at a time
4. Sessions track progress, issues, solutions, and learnings

### Best Practices:

- Start a session when beginning significant work
- Update regularly with important changes or findings
- End with thorough summary for future reference
- Review past sessions before starting similar work

### Example Workflows:

**Session Management:**

```
/project:session-start refactor-auth
/project:session-update Added Google OAuth restriction
/project:session-update Fixed Next.js 15 params Promise issue
/project:session-end
```

**Git Push Workflow:**

```
# Push to main branch
/push-changes main

# Create and push to new feature branch
/push-changes feature/add-user-auth

# Push to current branch
/push-changes current branch
```
