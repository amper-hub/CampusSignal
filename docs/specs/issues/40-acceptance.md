# Issues Acceptance Criteria

## AC-ISSUES-001: Create Issue

Given a logged-in user with `roleId = 2`, when they submit a valid issue with a description, then the issue is saved with their `userId` and appears in `GET /issues`.

## AC-ISSUES-002: Create Issue With Image

Given a logged-in user, when they submit an issue with an `image` or `file` upload, then the response includes an `imageUrl` and the feed renders the uploaded image URL.

## AC-ISSUES-003: Reject Empty Description

Given a logged-in user, when they submit an issue with an empty or whitespace-only description, then the API rejects the request with a validation error.

## AC-ISSUES-004: Owner Delete

Given a logged-in user who owns an issue, when they call `DELETE /issues/:id`, then the issue is removed and the response message is `Issue deleted successfully`.

## AC-ISSUES-005: Admin Delete

Given a logged-in admin with `roleId = 1`, when they call `DELETE /issues/:id` for any issue, then the issue is removed even if the admin is not the owner.

## AC-ISSUES-006: Non-Owner Delete Blocked

Given a logged-in user with `roleId = 2` who does not own an issue, when they call `DELETE /issues/:id`, then the API returns a forbidden response.
