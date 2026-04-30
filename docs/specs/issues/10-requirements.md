# Issues Requirements

REQ-ISSUES-001: An authenticated user can create an issue using `POST /issues`.

REQ-ISSUES-002: Issue creation must include a non-empty `description`.

REQ-ISSUES-003: Issue creation may include one uploaded image using either the `image` or `file` multipart field.

REQ-ISSUES-004: A created issue must be associated with the authenticated user's `userId`.

REQ-ISSUES-005: Users can retrieve all issues using `GET /issues` without authentication.

REQ-ISSUES-006: Users can retrieve a single issue using `GET /issues/:id` without authentication.

REQ-ISSUES-007: An authenticated issue owner can update their own issue using `PATCH /issues/:id`.

REQ-ISSUES-008: An authenticated issue owner can delete their own issue using `DELETE /issues/:id`.

REQ-ISSUES-009: An admin with `roleId = 1` can delete any issue.

REQ-ISSUES-010: When an issue is listed, the response must include vote totals as `agree` and `disagree`.

REQ-ISSUES-011: When an issue is listed, related suggestions must be included in the response summary.

REQ-ISSUES-012: Issue status must default to `open` when not explicitly changed by an admin workflow.
