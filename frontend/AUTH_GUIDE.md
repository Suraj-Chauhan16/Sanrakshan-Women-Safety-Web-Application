# Authentication System & Role-Based Access Control

## Overview

The Women Safety app now features a complete authentication system with role-based access control that separates user and admin experiences.

---

## Authentication Flow

### 1. Login/Registration Modal
- **Single Button**: "Login / Register" button in navbar
- **Toggle Between Forms**: Easily switch between login and registration
- **Admin Mode**: Checkbox to login as admin
- **Data Persistence**: User data stored in localStorage

### 2. User Types

#### Regular User
- Can access: Home, About, Know Your Rights
- Can access: Dashboard, Profile
- **Cannot access**: Admin panel
- **Role**: "user"

#### Admin User
- Can access: Home, About, Know Your Rights
- Can access: Admin panel
- **Cannot access**: Dashboard, Profile
- **Role**: "admin"

---

## How It Works

### AuthContext
Located in `/src/contexts/AuthContext.js`, this context manages:

```javascript
- user: Current logged-in user object
- login(): Authenticate user as regular user or admin
- register(): Create new user account (always regular user)
- logout(): Clear user session
- isAdmin(): Check if user is admin
- isLoggedIn(): Check if user is authenticated
```

### Protected Routes
App.js implements two types of protected routes:

```javascript
<ProtectedUserRoute> - For /dashboard, /profile
<ProtectedAdminRoute> - For /admin
```

**If user tries to access**:
- Admin panel as regular user → Redirects to home
- Dashboard as admin → Redirects to home
- Protected page when not logged in → Redirects to home

---

## User Flow

### First Time Visitor
1. Sees "Login / Register" button in navbar
2. Clicks button → Auth modal opens
3. Can toggle between login and register
4. **New user**: Fills register form → Auto-logged in as regular user
5. **Existing user**: Fills login form → Select admin or user mode

### After Login (Regular User)
```
Navbar shows:
- Home, About, Know Your Rights
- Dashboard, Profile
- User name + Logout button
```

### After Login (Admin User)
```
Navbar shows:
- Home, About, Know Your Rights
- Admin
- User name + Logout button
```

### After Logout
```
Back to:
- Home, About, Know Your Rights
- Login / Register button
```

---

## Testing the System

### Test as Regular User
1. Click "Login / Register"
2. **Register**: 
   - Fill all fields
   - Make sure "Admin Login" checkbox is unchecked
   - Click "Sign Up"
   - Should see Dashboard & Profile in navbar
   - Access /admin → Redirects to home

3. **Login**:
   - Email: any email
   - Password: any password
   - Keep "Admin Login" unchecked
   - Click "Login"
   - Should see Dashboard & Profile

### Test as Admin User
1. Click "Login / Register"
2. **Login**:
   - Email: any email
   - Password: any password
   - Check "Admin Login" checkbox
   - Click "Login"
   - Should see Admin in navbar (not Dashboard/Profile)
   - Access /dashboard → Redirects to home

### Test Data Persistence
1. Login as user
2. Refresh page → Still logged in
3. Clear localStorage → Logged out
4. Login as admin
5. Refresh page → Still logged as admin
6. Click Logout → Navbar shows login button again

---

## File Structure

### New Files
```
src/
├── contexts/
│   └── AuthContext.js (Authentication context)
└── components/
    ├── AuthModal.js (Login/Register modal)
    └── AuthModal.css (Modal styling)
```

### Updated Files
```
src/
├── App.js (Protected routes)
├── App.css (Navbar button styles)
├── index.css (Global styles)
├── components/
│   └── Navbar.js (Conditional rendering based on auth)
└── pages/
    └── Home.js (Auth modal integration)
```

---

## Key Features

### ✅ Features Implemented

1. **Combined Auth Modal**
   - Single button opens login/register modal
   - Easy toggle between forms
   - Admin login option with checkbox

2. **Role-Based Navigation**
   - Different navbar for users vs admins
   - User name displayed in navbar
   - Logout button for authenticated users

3. **Protected Routes**
   - Dashboard & Profile only for regular users
   - Admin panel only for admin users
   - Automatic redirects for unauthorized access

4. **Data Persistence**
   - User data saved in localStorage
   - Persists across page refreshes
   - Can be cleared with logout

5. **Smart Redirects**
   - Non-logged-in users redirected from protected pages
   - Admins can't access user pages
   - Users can't access admin pages

---

## LocalStorage Data Structure

### User Object Stored
```javascript
{
  name: "John Doe",          // From login/register
  email: "john@example.com", // From login/register
  role: "user",              // "user" or "admin"
  loginTime: "2024-01-16T...", // ISO timestamp
  joinDate: "2024-01-16T..."   // For registered users
}
```

---

## API Integration Ready

Current implementation uses localStorage. When backend is ready:

1. **Login API**
   ```javascript
   POST /api/auth/login
   Body: { email, password }
   Response: { token, user }
   ```

2. **Register API**
   ```javascript
   POST /api/auth/register
   Body: { name, email, password, ... }
   Response: { token, user }
   ```

3. **Update Login Handler**
   ```javascript
   // In AuthModal.js - handleLoginSubmit()
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(loginForm)
   });
   const data = await response.json();
   login(data.user.email, data.user.password, data.user.role);
   ```

---

## Security Notes

### Current Implementation (Development)
- Uses localStorage (not secure for production)
- No password encryption
- No JWT tokens
- For demonstration only

### For Production
1. Use HTTPS only
2. Implement JWT tokens
3. Use httpOnly cookies for tokens
4. Add password hashing (bcrypt)
5. Add CSRF protection
6. Implement rate limiting
7. Add email verification
8. Add refresh tokens
9. Implement OAuth (Google, Facebook)
10. Add 2FA support

---

## User Experience

### Login/Register Button
```
Desktop:
- White button with purple text in navbar
- Hover: White text with transparent background

Mobile:
- Same button in hamburger menu
- Menu closes after interaction
```

### User Info Display
```
When logged in, navbar shows:
- User name | Logout button

On mobile:
- Stacked vertically in menu
- Full-width buttons
```

### Modal Behavior
```
- Opens when "Login/Register" clicked
- Closes on success (auto-redirect)
- Can close with X button
- Click outside also closes
- Form validation before submit
```

---

## Error Handling

### Validation Messages
- Required fields
- Invalid email format
- Password mismatch
- Password too short
- Terms not accepted

### Redirect Messages
- None (automatic, silent redirects)
- Admin trying to access user page → home
- User trying to access admin page → home
- Not logged in accessing protected page → home

---

## Future Enhancements

1. **Profile Completion**
   - Redirect users to complete profile after registration
   - Profile completion form

2. **Email Verification**
   - Send verification email after registration
   - Verify email before allowing login

3. **Password Reset**
   - Forgot password link in login form
   - Email-based password reset

4. **Two-Factor Authentication**
   - OTP via email/SMS
   - Authenticator app support

5. **Social Login**
   - Google OAuth
   - Facebook OAuth
   - GitHub OAuth

6. **Remember Me**
   - Auto-login on next visit
   - Session management

7. **Role Management**
   - Admin can create other admins
   - Moderator role
   - Custom roles

8. **Activity Logging**
   - Track login/logout
   - Track user actions
   - Audit logs

---

## Testing Checklist

- [ ] Click "Login/Register" button
- [ ] Modal opens correctly
- [ ] Toggle between login and register
- [ ] Admin checkbox works
- [ ] Form validation works
- [ ] Can register as regular user
- [ ] Can login as regular user
- [ ] Can login as admin
- [ ] Dashboard shows for regular user
- [ ] Admin panel shows for admin
- [ ] Can't access admin as regular user
- [ ] Can't access dashboard as admin
- [ ] Data persists on refresh
- [ ] Logout removes data
- [ ] Navbar updates correctly
- [ ] Mobile menu works
- [ ] Redirects work

---

## Support

For questions about the authentication system, check:
1. AuthContext.js - Context logic
2. AuthModal.js - UI implementation
3. App.js - Route protection
4. Navbar.js - Conditional rendering
