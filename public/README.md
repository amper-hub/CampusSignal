# CampusSignal Frontend - Setup Guide

## Overview

This frontend is a clean, Vanilla HTML/CSS/JavaScript application served directly from your NestJS backend at `http://localhost:3000`.

## Files Created

The following files have been created in your `public/` folder:

- **index.html** - Main HTML structure with forms and dashboard UI
- **styles.css** - Mobile-friendly, clean CSS styling
- **script.js** - JavaScript for handling authentication, API calls, and issue management

## Features

### Authentication
- User registration with email and password
- User login with JWT token storage
- Token persisted in localStorage for session continuity
- Logout functionality

### Issue Management
- Submit new issues with category, building, room, and description
- Optional image upload support
- View all issues in a clean card-based layout
- Issue details modal with full description and suggestions

### Voting System
- Agree/Disagree voting on issues
- Vote counts displayed on issue cards
- Real-time vote updates

### Suggestions/Comments
- View suggestions and comments per issue
- Display in issue detail modal

## API Endpoints Used

The frontend communicates with these NestJS backend endpoints:

```
POST   /auth/register        - Register new user
POST   /auth/login           - User login (returns JWT token)
GET    /issues               - Fetch all issues
POST   /issues               - Submit new issue
POST   /votes                - Submit a vote on an issue
```

## Backend Configuration

Your `main.ts` has been updated to:
- Enable CORS for frontend API calls
- Allow requests from any origin (change in production)

Your `app.module.ts` has been updated to:
- Import `ServeStaticModule` from `@nestjs/serve-static`
- Serve static files from the `public/` directory
- Automatically serve `index.html` at `http://localhost:3000`

## How to Run

1. **Install dependencies** (already done):
   ```bash
   npm install @nestjs/serve-static
   ```

2. **Start the development server**:
   ```bash
   npm run start:dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

## How It Works

### User Flow

1. **Registration/Login**: User registers or logs in with email and password
2. **Dashboard**: After login, user sees the dashboard with:
   - Issue submission form
   - List of all issues
3. **Issue Submission**: User fills out category, location, description, and optional image
4. **Voting**: User can vote on issues (Agree/Disagree)
5. **View Details**: Click on issue card to see full details and suggestions

### JWT Authentication

- JWT token received from `/auth/login` is stored in localStorage
- Token is included in the `Authorization: Bearer <token>` header for all authenticated requests
- Token is sent with every request to protected endpoints (GET /issues, POST /issues, POST /votes)

## JavaScript Architecture

### Main Functions

- `handleRegister()` - Processes user registration
- `handleLogin()` - Processes user login and JWT storage
- `handleLogout()` - Clears token and returns to login page
- `handleIssueSubmit()` - Submits new issue to backend
- `loadIssues()` - Fetches all issues from backend
- `submitVote()` - Submits vote on an issue
- `openIssueModal()` - Displays full issue details in modal

### Utility Functions

- `toggleAuthForms()` - Toggle between register and login forms
- `displayIssues()` - Renders issue cards to UI
- `createIssueCard()` - Generates HTML for individual issue card
- `parseCategory()` - Converts category codes to readable emoji labels
- `getStatusClass()` - Maps issue status to CSS class

## Customization

### API Base URL

If your backend is running on a different URL, update the `API_BASE_URL` in `script.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000'; // Change this if needed
```

### Categories

Add or modify issue categories in `index.html` (issueCategory select) and in `parseCategory()` function in `script.js`.

### Styling

All CSS is in `styles.css`. Key color scheme:
- Primary: `#667eea` (Blue)
- Accent: `#764ba2` (Purple)
- Success: `#27ae60` (Green)
- Error: `#e74c3c` (Red)

## Mobile Responsiveness

The design is fully responsive with breakpoints at:
- **768px** - Tablet layout adjustments
- **480px** - Mobile layout adjustments

## Error Handling

- Network errors are caught and displayed to users
- Form validation messages guide users
- Error messages auto-clear after 4 seconds
- Failed API calls show meaningful error text

## Security Notes

- CORS is currently set to allow all origins - update this in production
- JWT token is stored in localStorage (consider using HTTP-only cookies in production)
- Passwords are sent to backend for hashing (implement HTTPS in production)

## Troubleshooting

### "Failed to load issues" error
- Ensure JWT token is valid
- Check that backend is running on port 3000
- Verify CORS is enabled in main.ts

### Forms not submitting
- Check browser console for error messages
- Ensure all required fields are filled
- Verify API_BASE_URL is correct

### Images not uploading
- Image upload uses data URLs for now
- For production, implement multipart/form-data upload

## Next Steps

- Test all features against your backend endpoints
- Add more issue categories as needed
- Implement image upload to proper backend storage
- Add user profile page
- Add issue filtering and search
- Add pagination for long issue lists
