You are a senior full-stack developer and UI/UX designer (NestJS + TypeORM + MySQL + HTML/CSS/JS).

Redesign the entire **CampusSignal UI** (inside the `ui/` folder) to match a **modern dark-themed interface** similar to the provided reference design.

Extend the system by including **Admin Dashboard UI pages** with full backend integration.

---

## **Design Requirements**

### Theme

* Dark UI (black / deep navy)
* Neon green / lime accent color
* Clean, modern typography
* Rounded inputs, cards, and buttons
* Soft shadows and glow effects

---

## **UI Folder Structure**

```id="ui-structure-full"
ui/
 ├── login.html
 ├── register.html
 ├── home.html
 ├── report.html
 ├── profile.html
 ├── admin-dashboard.html
 ├── admin-issues.html
 └── admin-suggestions.html
```

---

## **Login Page (Default Page)**

### Layout (Split Screen)

* Left:

  * Logo: CampusSignal
  * Tagline:

    * Your campus.
    * Your voice.
    * Heard.
* Right:

  * Login form (email + password)
  * Sign In button (green highlight)
  * “Sign up free” link

### Behavior

* This must load at:

```
http://localhost:3000
```

---

## **Register Page**

* Same style as login
* Fields:

  * Email
  * Password
  * Confirm Password

---

## **Home Page**

### Navbar

* Home
* Make a Report
* Profile

### Feed

Each post card:

* Title
* Description
* Image
* Status:

  * 🟢 Green → has admin feedback
  * 🔴 Red → no feedback
* Comment count
* Comment section (view + add)

---

## **Report Page**

### Forms

**Report Issue**

* Title
* Description
* Upload Image
* Submit → `/issues`

**Suggestion**

* Title
* Description
* Upload Image
* Submit → `/suggestions`

---

## **Profile Page**

* User info (email, role)
* My Reports
* My Suggestions

---

# 🔥 ADMIN UI FEATURES

---

## **Admin Dashboard Page (admin-dashboard.html)**

### Purpose

Show system analytics

### Content

* Total Issues
* Total Suggestions
* Total Users
* Issues with Feedback
* Pending Issues

### UI Style

* Dashboard cards (grid layout)
* Icons + numbers
* Clean spacing

### Data Source

* GET `/admin/reports/summary`

---

## **Admin Issues Page (admin-issues.html)**

### Content

List of all issues

Each card shows:

* Title
* Description
* Image preview
* Status
* Existing feedback

### Actions

* Add/Edit Feedback
* Update status:

  * pending
  * reviewed
  * resolved

### API

* GET `/admin/issues`
* PATCH `/admin/issues/:id/feedback`

---

## **Admin Suggestions Page (admin-suggestions.html)**

### Content

List of all suggestions

Each item shows:

* Title
* Description
* Image
* Feedback

### Actions

* Add/Edit Feedback

### API

* GET `/admin/suggestions`
* PATCH `/admin/suggestions/:id/feedback`

---

## **Admin Feedback Form**

```html id="admin-feedback-ui"
<form>
  <textarea placeholder="Write feedback..."></textarea>
  <select>
    <option value="pending">Pending</option>
    <option value="reviewed">Reviewed</option>
    <option value="resolved">Resolved</option>
  </select>
  <button type="submit">Submit</button>
</form>
```

---

## **Styling Requirements**

* Consistent with main UI
* Use:

  * Card layouts
  * Grid system
  * Neon green highlights
* Hover effects and transitions

---

## **Frontend Behavior**

* Use `fetch()` for API calls
* Store JWT in `localStorage`
* Redirect:

  * Login → Home
  * Admin login → Admin Dashboard
* Protect routes:

  * Non-auth users → redirect to login
  * Non-admin users → block admin pages

---

## **Backend Integration**

* Base URL:

```
http://localhost:3000
```

* Use endpoints:

  * `/auth/login`
  * `/issues`
  * `/suggestions`
  * `/comments`
  * `/admin/*`

---

## **Serve UI from NestJS**

* Use `ServeStaticModule`
* Serve `/ui` folder
* Default route `/` → `login.html`

---

## **Acceptance Criteria**

* UI matches modern dark theme (like reference)
* Login page loads at localhost:3000
* Admin pages are accessible only by admin
* Feedback updates reflect in user UI (green/red dot)
* Dashboard shows correct counts
* All pages are connected to backend

---

## **Output Requirements**

* Full HTML for all pages (including admin)
* CSS styling
* JavaScript (API integration)
* Instructions for NestJS static serving
