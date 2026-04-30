# Issues API

## GET /issues

Returns all issues ordered by newest first.

### Request JSON

No request body.

### Response JSON

```json
[
  {
    "id": 12,
    "title": "Broken projector",
    "category": "Facilities",
    "building": "Main Building",
    "room": "201",
    "description": "The projector is not turning on.",
    "status": "open",
    "imageUrl": "/uploads/example.jpg",
    "hasAdminFeedback": false,
    "adminFeedback": null,
    "userId": 5,
    "createdAt": "2026-04-30T02:15:00.000Z",
    "user": {
      "id": 5,
      "email": "student@example.com",
      "roleId": 2
    },
    "agree": 3,
    "disagree": 1,
    "suggestions": [
      {
        "id": 7,
        "description": "Try replacing the HDMI cable.",
        "imageUrl": "",
        "user": {
          "id": 6,
          "email": "helper@example.com"
        },
        "createdAt": "2026-04-30T03:00:00.000Z"
      }
    ]
  }
]
```

## GET /issues/:id

Returns one issue by ID.

### Request JSON

No request body.

### Response JSON

```json
{
  "id": 12,
  "title": "Broken projector",
  "category": "Facilities",
  "building": "Main Building",
  "room": "201",
  "description": "The projector is not turning on.",
  "status": "open",
  "imageUrl": "/uploads/example.jpg",
  "hasAdminFeedback": false,
  "adminFeedback": null,
  "userId": 5,
  "createdAt": "2026-04-30T02:15:00.000Z",
  "agree": 3,
  "disagree": 1,
  "suggestions": []
}
```

If the issue does not exist, the current service returns `null`.

## POST /issues

Creates an issue. Requires `Authorization: Bearer <jwt_token>`.

The existing backend accepts multipart form data because image upload is supported.

### Request Form Data

```json
{
  "title": "Broken projector",
  "category": "Facilities",
  "building": "Main Building",
  "room": "201",
  "description": "The projector is not turning on.",
  "image": "<optional file>"
}
```

The file field may also be named `file`.

### Response JSON

```json
{
  "id": 12,
  "title": "Broken projector",
  "category": "Facilities",
  "building": "Main Building",
  "room": "201",
  "description": "The projector is not turning on.",
  "status": "open",
  "imageUrl": "/uploads/example.jpg",
  "hasAdminFeedback": false,
  "adminFeedback": null,
  "userId": 5,
  "createdAt": "2026-04-30T02:15:00.000Z"
}
```

## PATCH /issues/:id

Updates an issue. Requires `Authorization: Bearer <jwt_token>`.

### Request JSON

```json
{
  "title": "Updated projector issue",
  "description": "The projector turns on but has no display."
}
```

### Response JSON

```json
{
  "id": 12,
  "title": "Updated projector issue",
  "category": "Facilities",
  "building": "Main Building",
  "room": "201",
  "description": "The projector turns on but has no display.",
  "status": "open",
  "imageUrl": "/uploads/example.jpg",
  "hasAdminFeedback": false,
  "adminFeedback": null,
  "userId": 5,
  "createdAt": "2026-04-30T02:15:00.000Z"
}
```

## DELETE /issues/:id

Deletes an issue. Requires `Authorization: Bearer <jwt_token>`.

Owners may delete their own issues. Admins with `roleId = 1` may delete any issue.

### Request JSON

No request body.

### Response JSON

```json
{
  "message": "Issue deleted successfully"
}
```

## PATCH /admin/issues/:id/feedback

Adds or updates admin feedback for an issue. Requires an authenticated admin with `roleId = 1`.

### Request JSON

```json
{
  "feedback": "Facilities has been notified and will inspect the room today.",
  "status": "in-progress"
}
```

### Response JSON

```json
{
  "id": 12,
  "status": "in-progress",
  "hasAdminFeedback": true,
  "adminFeedback": "Facilities has been notified and will inspect the room today."
}
```
