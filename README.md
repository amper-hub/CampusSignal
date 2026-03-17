# CampusSignal

CampusSignal is a campus issue reporting dashboard built with **NestJS (TypeScript)** backend, **MySQL (TypeORM)** database, and a **Vanilla HTML/CSS/JS** frontend served from the backend.

---

## Features (Selected)

### 1) Issue Reporting System
**Purpose:** Let students report campus issues (e.g., broken equipment, maintenance needs) with optional images.

**Expected User:** Logged-in student or campus staff.

**Main Functionality:**
- Submit a new issue with text and optional image upload.
- Store issue records in the database, linked to the user.
- Display a feed of reported issues on the dashboard.

**Acceptance Criteria:**
- Users can submit a report with a description and optional image.
- New reports appear immediately in the dashboard issue feed.
- Each report saves user ID, description, timestamp, and image URL when uploaded.

---

### 2) Suggestion & Comment System
**Purpose:** Allow users to add suggestions or comments on issues, optionally including an image.

**Expected User:** Logged-in campus community member.

**Main Functionality:**
- Post a suggestion/comment tied to an issue (or standalone).
- Allow optional image uploads with suggestions.
- Enable users to edit / delete their own suggestions.

**Acceptance Criteria:**
- Users can submit a suggestion with text and optional image.
- Suggestions show up under the related issue with user and timestamp.
- Users can only edit or delete suggestions they created.

---

## What Was Implemented

- **Backend (NestJS + MySQL):** Built REST APIs for issues, suggestions, votes, and authentication using NestJS controllers + services. Integrated TypeORM entities and relations (User, Issue, Suggestion, Vote).
- **Frontend (UI Dashboard):** Created a clean Bento-style dashboard UI with HTML/CSS/JS. Forms allow submitting issues and suggestions, and the UI updates dynamically.
- **Integration:** Implemented JWT authentication (login/register) with token storage, and wired frontend API calls to backend endpoints for CRUD operations. Added image upload handling with multipart/form-data.

---

## Problems / Challenges Encountered

- **Fixing suggestion submission bug:** The frontend was forcing `Content-Type: application/json` when uploading FormData, breaking image upload. Fixed by letting the browser set the multipart header.
- **Handling image upload:** Ensured uploads are saved under `public/uploads` and the backend returns a usable URL.
- **Connecting frontend to backend:** Needed consistent API paths and error handling for failed requests.
- **Managing JWT authentication:** Stored JWT in localStorage, sent it on protected requests, and guarded backend routes.
- **Debugging DB relations:** Used TypeORM relations/cascades and seeded required roles to avoid foreign key issues.

---

## Screenshots

![Screenshot 1](./screenshots/screenshot1.png)
![Screenshot 2](./screenshots/screenshot2.png)
![Screenshot 3](./screenshots/screenshot3.png)
![Screenshot 4](./screenshots/screenshot4.png)
![Screenshot 5](./screenshots/screenshot5.png)
