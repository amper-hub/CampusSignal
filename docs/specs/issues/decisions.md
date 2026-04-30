# Issues Decisions

## [2026-04-30]

Chose `roleId` as the source of truth for role-based issue permissions: `roleId = 1` means admin and `roleId = 2` means user. This keeps frontend redirects, admin page protection, and backend authorization checks aligned.

## [2026-04-30]

Kept issue image uploads as local file uploads through the existing uploads service rather than introducing cloud storage. This matches the current CampusSignal architecture and keeps the feature simple for local development and academic validation.

## [2026-04-30]

Documented issue creation as multipart form data because the existing `POST /issues` controller uses `FileFieldsInterceptor` and accepts optional `image` or `file` fields.
