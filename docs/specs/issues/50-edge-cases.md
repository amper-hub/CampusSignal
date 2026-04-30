# Issues Edge Cases

- Empty description: Creating an issue with an empty or whitespace-only `description` must fail.
- Missing JWT: Creating, updating, or deleting an issue without a valid bearer token must fail.
- Invalid issue ID: Updating or deleting a non-existent issue must return a not-found response.
- Unauthorized delete: A normal user with `roleId = 2` must not delete another user's issue.
- Optional image omitted: Issue creation must still succeed when no image is uploaded.
- Alternate upload field: The backend must accept either `image` or `file` for the optional issue attachment.
- Orphaned relations during delete: When an issue is deleted, related votes and suggestions must be removed or handled so stale child records do not break the feed.
- Admin feedback length: Admin feedback must not exceed the backend limit of 5000 characters.
