# Issues Feature Context

## Feature Name

Issues

## Purpose

The Issues feature allows authenticated campus users to report campus problems, optionally attach an image, and view reported issues in the community feed. It also supports administrative oversight through feedback, status updates, dashboard counts, and deletion.

## Actors

- User: A registered user with `roleId = 2` who can create, view, update their own issues, and delete their own issues.
- Admin: A privileged user with `roleId = 1` who can view all issues, delete issues, and provide official feedback through admin routes.

## High-Level Description

Users submit issue reports through the HTML/JavaScript frontend. The frontend sends issue form data to the NestJS backend at `/issues`. The backend validates that the caller is authenticated, accepts optional uploaded image data, stores uploaded files locally through the uploads service, and persists the issue with TypeORM/MySQL.

Issues are visible in the feed through `GET /issues`, including creator information, vote counts, suggestions, status, image URL, and admin feedback state. Owners and admins may delete issues. Admin feedback is managed through `/admin/issues/:id/feedback`.

## Dependencies

- NestJS `IssuesController` and `IssuesService`
- TypeORM `Issue` entity
- MySQL database
- JWT authentication via `AuthGuard('jwt')`
- User roles where `roleId = 1` is admin and `roleId = 2` is user
- Uploads service for optional `image` or `file` multipart fields
- Suggestions, votes, and comments relations for issue feed display
- Static HTML/JavaScript UI under `public/ui`
