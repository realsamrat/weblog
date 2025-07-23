# Claude Helper Scripts

This directory contains helper scripts for Claude Code to ensure consistent and accurate operations.

## Scripts

### get-session-date.sh

Generates the correct date-time format for session filenames.

**Usage:**

```bash
./.claude/scripts/get-session-date.sh
# Output: 2025-06-25-1901
```

**Format:** `YYYY-MM-DD-HHMM`

- YYYY: 4-digit year
- MM: 2-digit month (01-12)
- DD: 2-digit day
- HH: 2-digit hour (00-23)
- MM: 2-digit minute

This script helps prevent date formatting errors when creating session files.
