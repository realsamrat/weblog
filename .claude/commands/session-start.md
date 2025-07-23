Start a new development session by creating a session file in `.claude/sessions/` with the format `YYYY-MM-DD-HHMM-$ARGUMENTS.md` (or just `YYYY-MM-DD-HHMM.md` if no name provided).

**Important**: Use the `.claude/scripts/get-session-date.sh` script to get the correct date format, or verify the current date with the `date` command to ensure the correct month is used (e.g., June = 06, not 01).

The session file should begin with:

1. Session name and timestamp as the title
2. Session overview section with start time
3. Goals section (ask user for goals if not clear)
4. Empty progress section ready for updates

After creating the file, create or update `.claude/sessions/.current-session` to track the active session filename.

Confirm the session has started and remind the user they can:

- Update it with `/project:session-update`
- End it with `/project:session-end`
