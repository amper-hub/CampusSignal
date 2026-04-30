# Issues Invariants

- An issue must always have a valid `userId` belonging to an existing user.
- A user must be authenticated before creating, updating, or deleting an issue.
- `roleId` must be either `1` for admin or `2` for user when making role-based access decisions.
- Only the owner of an issue or an admin with `roleId = 1` may delete the issue.
- Issue `description` must never be empty after trimming whitespace.
- Issue `status` must have a meaningful workflow value, defaulting to `open` for newly created issues.
- `adminFeedback` must only be written through admin-controlled workflows.
