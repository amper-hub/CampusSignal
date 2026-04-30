# 🧪 ROLE-BASED LOGIN - COMPLETE TEST PLAN

## Pre-Test Checklist

- [ ] Code changes applied to all 5 files
- [ ] `npm install` completed
- [ ] `npm run build` succeeds without errors
- [ ] Database connection verified in `.env`
- [ ] No other login/auth changes in progress

---

## Test Suite 1: Database Initialization

### Test 1.1: Seed Database
**Command**:
```bash
npm run seed
```

**Expected Output**:
```
[SEED] Starting database seed...
[SEED] Created role: user
[SEED] Created role: admin
[SEED] User role ID: 1, Admin role ID: 2
[SEED] Created admin user: admin@gmail.com
[SEED] Database seed completed successfully!
```

**Verification**:
```sql
-- Check roles exist
SELECT * FROM role;
-- Expected: 2 rows (id:1 name:'user', id:2 name:'admin')

-- Check admin user exists
SELECT id, email, roleId FROM user WHERE email='admin@gmail.com';
-- Expected: roleId = 2 (admin)
```

✅ **Pass Criteria**: 
- Script runs without errors
- Both roles created
- Admin user created with roleId = 2

---

## Test Suite 2: Server Startup

### Test 2.1: Start Development Server
**Command**:
```bash
npm run start:dev
```

**Expected Output**:
```
[Nest] ... - 04/26/2026, ... AM     LOG [NestFactory] Starting Nest application...
[Nest] ... - 04/26/2026, ... AM     LOG [InstanceLoader] ... loaded successfully
[Nest] ... - 04/26/2026, ... AM     LOG [RoutesResolver] ...
[Nest] ... - 04/26/2026, ... AM     LOG [NestApplication] Listening on port 3000
```

**Verification**:
- No compilation errors
- No runtime errors
- Server listening on port 3000

✅ **Pass Criteria**: 
- Server starts without errors
- Port 3000 accessible
- No auth-related errors in console

---

## Test Suite 3: Admin Login (CRITICAL)

### Test 3.1: Navigate to Login Page
**Steps**:
1. Open browser: `http://localhost:3000/ui/login.html`
2. Verify page loads

✅ **Pass Criteria**: Login page displays

### Test 3.2: Admin Login with Correct Credentials
**Steps**:
1. Email: `admin@gmail.com`
2. Password: `Admin@12345`
3. Click "Sign In"

**Backend Console Expected**:
```
[AUTH] Login successful: {
  userId: 1,
  email: 'admin@gmail.com',
  role: 'admin',
  roleId: 2
}
```

**Browser Console Expected** (Open with F12):
```
[LOGIN] Response: { 
  access_token: 'eyJhbGc...',
  user: { id: 1, email: 'admin@gmail.com', role: 'admin' }
}
[LOGIN] User: { id: 1, email: 'admin@gmail.com', role: 'admin' }
[LOGIN] Role: admin
[LOGIN] Stored role: admin
[LOGIN] Final role check: admin
[LOGIN] Admin detected - redirecting to admin-dashboard.html
```

**Page Redirect**:
- URL changes to: `/ui/admin-dashboard.html`

**Admin Dashboard Display**:
- Dashboard loads successfully
- Shows stats (Total Issues, Total Suggestions, etc.)
- Top bar shows "CampusSignal Admin"

**localStorage Verification** (In console):
```javascript
localStorage.getItem('token')        // Should be JWT token
localStorage.getItem('role')         // Should be 'admin'
JSON.parse(localStorage.getItem('user'))  // Should have role: 'admin'
```

✅ **Pass Criteria - ALL OF**:
- ✅ Backend logs show `role: 'admin'` (string)
- ✅ Frontend logs show `[LOGIN] Role: admin`
- ✅ Redirects to admin-dashboard.html
- ✅ Admin page loads with content
- ✅ localStorage has role: 'admin'

---

## Test Suite 4: Regular User Login

### Test 4.1: Register New User
**Steps**:
1. Go to: `http://localhost:3000/ui/register.html`
2. Email: `testuser@gmail.com`
3. Password: `TestPass@123`
4. Confirm Password: `TestPass@123`
5. Click "Create Account"

**Backend Console Expected**:
```
[USERS] No roleId provided, defaulting to user role (ID: 1)
[USERS] User created successfully: {
  id: 2,
  email: 'testuser@gmail.com',
  roleId: 1,
  role: 'user'
}
[AUTH] Registration successful: {
  userId: 2,
  email: 'testuser@gmail.com',
  role: 'user'
}
```

**Expected Behavior**:
- Redirects to login page
- New account created in database

**Verification**:
```sql
SELECT id, email, roleId FROM user WHERE email='testuser@gmail.com';
-- Expected: roleId = 1
```

✅ **Pass Criteria**:
- ✅ Backend logs show `role: 'user'` (string)
- ✅ User created with roleId: 1
- ✅ Redirects to login page

### Test 4.2: Login as New User
**Steps**:
1. Email: `testuser@gmail.com`
2. Password: `TestPass@123`
3. Click "Sign In"

**Backend Console Expected**:
```
[AUTH] Login successful: {
  userId: 2,
  email: 'testuser@gmail.com',
  role: 'user',
  roleId: 1
}
```

**Browser Console Expected**:
```
[LOGIN] Response: {
  access_token: '...',
  user: { id: 2, email: 'testuser@gmail.com', role: 'user' }
}
[LOGIN] Role: user
[LOGIN] Stored role: user
[LOGIN] Final role check: user
[LOGIN] Regular user detected - redirecting to home.html
```

**Page Redirect**:
- URL changes to: `/ui/home.html`

**Home Page Display**:
- Home page loads successfully
- User content displays properly

**localStorage Verification**:
```javascript
localStorage.getItem('role')  // Should be 'user'
```

✅ **Pass Criteria - ALL OF**:
- ✅ Backend logs show `role: 'user'` (string)
- ✅ Frontend logs show `[LOGIN] Role: user`
- ✅ Redirects to home.html
- ✅ Home page loads with content
- ✅ localStorage has role: 'user'

---

## Test Suite 5: Admin Page Protection

### Test 5.1: Access Admin Page as Regular User
**Setup**:
- Must be logged in as `testuser@gmail.com` (regular user)
- localStorage.role should be 'user'

**Steps**:
1. In browser address bar, type: `http://localhost:3000/ui/admin-dashboard.html`
2. Press Enter

**Expected Behavior**:
- Page immediately redirects
- URL changes to: `/ui/home.html`
- Never displays admin content

**Browser Console**:
- May show admin page security check
- No error messages

✅ **Pass Criteria**:
- ✅ Redirects immediately (no admin page visible)
- ✅ Returns to home.html
- ✅ No admin content displayed

### Test 5.2: Access All Admin Pages as Regular User
**Steps**: Try accessing each of these URLs as regular user
- `/ui/admin-dashboard.html` → should redirect to `/ui/home.html`
- `/ui/admin-issues.html` → should redirect to `/ui/home.html`
- `/ui/admin-suggestions.html` → should redirect to `/ui/home.html`

✅ **Pass Criteria**:
- ✅ All admin pages redirect
- ✅ Never display admin content to regular users

### Test 5.3: Access Admin Pages as Admin
**Setup**:
- Must be logged in as `admin@gmail.com`
- localStorage.role should be 'admin'

**Steps**: Try accessing each admin page
- `/ui/admin-dashboard.html` → loads successfully
- `/ui/admin-issues.html` → loads successfully
- `/ui/admin-suggestions.html` → loads successfully

✅ **Pass Criteria**:
- ✅ All pages load
- ✅ Content displays properly
- ✅ No redirects

---

## Test Suite 6: Session Persistence

### Test 6.1: Page Reload
**Steps**:
1. Login as admin
2. Navigate to admin dashboard
3. Refresh page (F5)

**Expected**:
- Page loads without re-authentication
- Dashboard content displays
- No redirect to login

### Test 6.2: Open Admin Link
**Steps**:
1. Login as admin
2. Open new tab: `http://localhost:3000/ui/admin-issues.html`

**Expected**:
- Page loads
- Content displays
- No redirect

✅ **Pass Criteria**:
- ✅ Token persists in localStorage
- ✅ Page reloads work
- ✅ New tabs work with existing session

---

## Test Suite 7: Logout & Re-login

### Test 7.1: Logout Flow
**Steps**:
1. Login as any user
2. Click "Logout" button (in top navigation)

**Expected**:
- localStorage cleared
- Redirects to login page
- User session ended

**Verification**:
```javascript
localStorage.getItem('token')  // Should be null
localStorage.getItem('role')   // Should be null
```

### Test 7.2: Re-login After Logout
**Steps**:
1. After logout, login again
2. Should work normally

✅ **Pass Criteria**:
- ✅ Logout clears session
- ✅ Can login again
- ✅ New token issued

---

## Test Suite 8: Edge Cases

### Test 8.1: Invalid Credentials
**Steps**:
1. Go to login page
2. Email: `admin@gmail.com`
3. Password: `WrongPassword`
4. Click "Sign In"

**Expected**:
- Error message: "Invalid credentials"
- Not authenticated
- No redirect

**Backend Console**:
- Should log failed attempt

✅ **Pass Criteria**:
- ✅ Error displayed
- ✅ Not authenticated

### Test 8.2: Non-existent User
**Steps**:
1. Go to login page
2. Email: `nonexistent@gmail.com`
3. Password: `password123`
4. Click "Sign In"

**Expected**:
- Error message: "Invalid credentials"
- Not authenticated

✅ **Pass Criteria**:
- ✅ Error displayed
- ✅ Not authenticated

### Test 8.3: Empty Fields
**Steps**:
1. Go to login page
2. Leave fields empty
3. Click "Sign In"

**Expected**:
- Browser validation (required fields)
- Form not submitted

✅ **Pass Criteria**:
- ✅ Validation works
- ✅ Form not submitted

---

## Test Suite 9: Role String Validation

### Test 9.1: Verify Role is String, Not Object
**Steps**:
1. Login as admin
2. Open browser console (F12)
3. Paste and run:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Type of role:', typeof user.role);
console.log('Role value:', user.role);
console.log('Is string:', typeof user.role === 'string');
```

**Expected Output**:
```
Type of role: string
Role value: admin
Is string: true
```

✅ **Pass Criteria**:
- ✅ Role is string type
- ✅ Role value is 'admin' or 'user'
- ✅ Not object or undefined

---

## Test Suite 10: Database State Verification

### Test 10.1: Verify Roles Table
**Command**:
```sql
SELECT * FROM role ORDER BY id;
```

**Expected**:
```
| id | name  |
|----|-------|
| 1  | user  |
| 2  | admin |
```

### Test 10.2: Verify Users Table
**Command**:
```sql
SELECT id, email, roleId FROM user;
```

**Expected**:
```
| id | email                 | roleId |
|----|----------------------|--------|
| 1  | admin@gmail.com       | 2      |
| 2  | testuser@gmail.com    | 1      |
```

✅ **Pass Criteria**:
- ✅ Roles correctly populated
- ✅ Users have correct roleIds
- ✅ Admin has roleId: 2
- ✅ Regular users have roleId: 1

---

## Test Summary Report

Create this report after running all tests:

```
╔═══════════════════════════════════════════════════╗
║           ROLE-BASED LOGIN TEST REPORT            ║
╠═══════════════════════════════════════════════════╣
║ Test Suite 1: Database Initialization      [__/1] ║
║ Test Suite 2: Server Startup               [__/1] ║
║ Test Suite 3: Admin Login (CRITICAL)       [__/1] ║
║ Test Suite 4: Regular User Login           [__/1] ║
║ Test Suite 5: Admin Page Protection        [__/1] ║
║ Test Suite 6: Session Persistence          [__/1] ║
║ Test Suite 7: Logout & Re-login            [__/1] ║
║ Test Suite 8: Edge Cases                   [__/1] ║
║ Test Suite 9: Role String Validation       [__/1] ║
║ Test Suite 10: Database State              [__/1] ║
╠═══════════════════════════════════════════════════╣
║ TOTAL PASSED:                               [__/10]║
║ TOTAL FAILED:                               [__/10]║
║                                                     ║
║ Status: [ ] PASS [ ] FAIL                         ║
╚═══════════════════════════════════════════════════╝
```

---

## Failure Recovery

If any test fails, follow this checklist:

1. **Check Backend Logs**
   - Look for `[AUTH]`, `[USERS]`, `[SEED]` logs
   - Verify role is always shown as string

2. **Check Frontend Logs**
   - Open F12 developer tools
   - Filter console by `[LOGIN]`
   - Verify role received and decision logged

3. **Check Database**
   - Verify roles exist: `SELECT * FROM role;`
   - Verify users have roleId: `SELECT * FROM user;`
   - If missing, run `npm run seed` again

4. **Check localStorage**
   - In console: `localStorage.getItem('role')`
   - Should be 'admin' or 'user' (string)

5. **Restart Everything**
   - Stop server (Ctrl+C)
   - Clear database if needed
   - Run `npm run seed`
   - Run `npm run start:dev`
   - Try tests again

---

## Notes

- Seed password for admin: `Admin@12345`
- Test user can be any email/password
- All localStorage data is cleared on logout
- Tokens expire after 7 days (unless changed in config)
- Console logs have `[AUTH]`, `[LOGIN]`, etc. prefixes for easy filtering

---

**Test Plan Version**: 1.0
**Last Updated**: 2026-04-26
**Status**: Ready for Testing
