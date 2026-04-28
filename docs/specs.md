You are a senior full-stack developer (NestJS + TypeORM + HTML/CSS/JS).

Continue and improve the **CampusSignal** project (a campus issue reporting and suggestion system).

Design a **complete feature specification** that includes:

* Backend API
* UI structure (HTML pages)
* File upload (images)
* Comments system
* Admin feedback indicator (green/red dot)

Follow the required format strictly.

---

## **Title**

CampusSignal Issue & Suggestion System with Photo Upload, Comments, and Admin Feedback Indicator

---

## **Goal (1–2 sentences)**

Enable users to report issues and suggestions with photo evidence, allow other users to comment on posts, and track admin feedback using visual indicators to improve collaboration and transparency.

---

## **User Story**

As a campus user, I want to report issues, upload photos, and comment on other users’ posts, so that I can participate in discussions and stay updated on report progress.

Include:

* Reporting issues/suggestions
* Uploading photos
* Commenting on posts
* Viewing admin feedback status
* Viewing personal reports

---

## **API Endpoints**

### Auth

* POST `/auth/register`
* POST `/auth/login`

### Issues

* GET `/issues`
* POST `/issues` *(multipart/form-data with image)*

### Suggestions

* GET `/suggestions`
* POST `/suggestions` *(multipart/form-data with image)*

### Comments

* GET `/comments/:postId`
* POST `/comments`

### Users

* GET `/users/profile`
* GET `/users/:id/reports`

---

## **Request + Response Examples (JSON)**

Include examples for:

* Creating issue (with image)
* Creating suggestion (with image)
* Creating comment
* Fetching feeds

Example:

```json
{
  "id": 1,
  "title": "Broken chair",
  "description": "Room 101",
  "imageUrl": "/uploads/file.jpg",
  "status": "pending",
  "hasAdminFeedback": false,
  "commentsCount": 2
}
```

---

## **Acceptance Criteria (3–5 bullets)**

* Users can submit issues and suggestions with optional images
* Users can comment on posts
* Posts display image, status indicator, and comment count
* Users can view their own reports in profile
* Navigation works across all UI pages

---

## **Notes**

Include:

* Edge cases (empty input, invalid file, spam comments)
* Error codes (400, 401, 404, 409, 413, 415)
* Assumptions (JWT auth, admin updates status, image storage)

---

## **UI Structure**

Create a separate folder:

```
ui/
 ├── login.html
 ├── register.html
 ├── home.html
 ├── report.html
 └── profile.html
```

---

## **Login Page**

* Email + password form
* Calls: POST `/auth/login`

---

## **Register Page**

* Email + password form
* Calls: POST `/auth/register`

---

## **Home Page Updates**

### Navigation Bar

* Home
* Make a Report
* Profile

### Feed Content

Each issue/suggestion displays:

* Title
* Description
* Image preview (if available)
* Status indicator:

  * 🟢 Green → admin feedback exists
  * 🔴 Red → no feedback
* Comment count

### Comments Section

* List of comments (user, content, timestamp)
* Input field to add comment
* Submit → POST `/comments`

---

## **Make a Report Page Updates**

### Report Issue Form

* Title input
* Description input
* File upload input (image)
* Submit → POST `/issues`

### Suggestion Form

* Title input
* Description input
* File upload input (image)
* Submit → POST `/suggestions`

---

## **Profile Page**

Displays:

* User basic info (email, role)
* My Reports (user’s issues)
* My Suggestions

---

## **Integration Behavior**

* Use `fetch()` for API calls
* Use `FormData` for file uploads
* Refresh feed after posting
* Dynamically update comments and status

---

## **Additional Requirements**

* Keep UI simple (HTML + minimal CSS + vanilla JS)
* Maintain existing backend functionality
* Ensure proper connection between frontend and backend
* Use clean and readable code

---

## **Output Requirements**

* Full structured feature specification
* API examples
* Basic HTML layout for each page
* Example JavaScript for API calls
