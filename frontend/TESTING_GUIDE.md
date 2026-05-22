# Testing Guide - Women Safety App

## Quick Start Testing

### 1. **Test Regular User Experience**

#### Step 1: Navigate to Home
- Go to `http://localhost:3001`
- Click "Login / Register" button in navbar

#### Step 2: Register as New User
- In the modal, toggle to "Sign Up"
- Fill in:
  - Full Name: `John Doe`
  - Email: `john@example.com`
  - Phone: `9876543210`
  - Date of Birth: `01/15/1990`
  - City: `New York`
  - Password: `password123`
  - Confirm Password: `password123`
  - Check "I agree to terms"
- Click "Sign Up"

#### Step 3: Verify User Access
After registration, you should see:
- ✅ Dashboard link in navbar
- ✅ Profile link in navbar
- ✅ User name displayed in navbar
- ✅ Logout button in navbar
- ❌ NO Admin link
- Auto-redirect to `/dashboard`

#### Step 4: Test User Pages
- Click "Dashboard" - Should load with map and stats
- Click "Profile" - Should load with profile image and edit options
- Try visiting `/admin` - Should redirect to home page

#### Step 5: Logout
- Click "Logout" button in navbar
- Verify navbar shows "Login / Register" button again
- Check localStorage is cleared

---

### 2. **Test Admin User Experience**

#### Step 1: Login as Admin
- Click "Login / Register" button
- Stay on "Login" form
- Fill in:
  - Email: `admin@example.com`
  - Password: `adminpass123`
  - **CHECK** "Admin Login" checkbox
- Click "Login"

#### Step 2: Verify Admin Access
After login, you should see:
- ✅ Admin link in navbar
- ✅ User name displayed in navbar
- ✅ Logout button in navbar
- ❌ NO Dashboard link
- ❌ NO Profile link
- Auto-redirect to `/admin`

#### Step 3: Test Admin Pages
- Click "Admin" - Should load admin dashboard with tabs
- Try visiting `/dashboard` - Should redirect to home page
- Try visiting `/profile` - Should redirect to home page

#### Step 4: Logout
- Click "Logout"
- Verify navbar shows "Login / Register" button again

---

### 3. **Test Data Persistence**

#### Step 1: Login and Refresh
- Login as regular user
- Refresh page (F5 or Ctrl+R)
- Should still be logged in
- Navbar should show user info

#### Step 2: Admin Login and Refresh
- Login as admin
- Refresh page
- Should still be logged in as admin
- Admin link should still be visible

#### Step 3: Clear Data
- Login as any user
- Open DevTools (F12)
- Go to Application → Local Storage → localhost:3001
- Delete `authUser` key
- Refresh page
- Should be logged out

---

### 4. **Test Modal Functionality**

#### Step 1: Toggle Between Forms
- Click "Login / Register"
- You should be on Login form
- Click "Don't have an account? Sign up" link
- Should switch to Register form
- Click "Already have an account? Login" link
- Should switch back to Login form

#### Step 2: Admin Checkbox
- Open Login form
- See "Admin Login" checkbox
- Check/uncheck it
- Should toggle between user and admin modes

#### Step 3: Close Modal
- Click X button → Modal closes
- Click "Login / Register" again → Modal opens
- Click outside modal → Modal closes
- Click "Login / Register" again → Modal opens

---

### 5. **Test Form Validation**

#### Step 1: Email Validation
- Try registering with invalid email (e.g., `notanemail`)
- Should show error message
- Fix email and submit again

#### Step 2: Password Validation
- Try registering with short password (less than 6 chars)
- Should show error
- Try password mismatch in confirm password
- Should show error

#### Step 3: Required Fields
- Try submitting register form with empty fields
- Should show "This field is required" errors

#### Step 4: Terms Acceptance
- Try registering without checking terms
- Should show error
- Check terms and submit

---

### 6. **Test Responsive Design**

#### Step 1: Desktop (1200px+)
- Open DevTools (F12)
- Click device toggle
- Select "Desktop" or disable device mode
- Navbar should show all links in top bar
- Modal should be centered and have 2-column layout

#### Step 2: Tablet (768px - 1199px)
- Click device toggle
- Select iPad or similar
- Hamburger menu might appear
- Modal should stack elements

#### Step 3: Mobile (320px - 767px)
- Click device toggle
- Select iPhone or similar
- Hamburger menu should be visible
- Modal should be full-width
- All form fields should be readable

---

### 7. **Test Navigation**

#### Step 1: Unlogged Navigation
- Home page shows "Login / Register" CTA
- Click About page - no protected content
- Click Know Your Rights - no protected content

#### Step 2: User Navigation
- Login as regular user
- Home page shows "Go to Dashboard" button
- Click Dashboard link - works
- Click Profile link - works
- Try Admin link (if visible) - should redirect
- Try /admin URL directly - should redirect to home

#### Step 3: Admin Navigation
- Login as admin
- Click Admin link - works
- Try Dashboard link (if visible) - should redirect
- Try /dashboard URL directly - should redirect to home

---

### 8. **Test Error Handling**

#### Step 1: Network Errors
- Try registering, then turn off internet
- Should show error (or request should fail)

#### Step 2: Duplicate Registration
- Register as `test@example.com`
- Try registering again with same email
- (Currently will just create new entry - in production, backend will prevent this)

#### Step 3: Wrong Password
- Login with email and wrong password
- (Currently will login anyway - in production, backend will validate)

---

## Test Credentials

### For Testing Admin
```
Email: admin@example.com (any email works)
Password: adminpass123 (any password works)
Admin Login: ✅ CHECK this box
```

### For Testing User
```
Email: user@example.com (any email works)
Password: password123 (any password works)
Admin Login: ❌ DON'T check this box
```

---

## Common Issues & Solutions

### Issue 1: Modal Won't Open
- **Solution**: Check if JavaScript is enabled
- Check browser console for errors (F12 → Console)

### Issue 2: Can't See Form Fields
- **Solution**: Check if modal is styled correctly
- Open DevTools and check if AuthModal.css is loaded
- Check z-index values in CSS

### Issue 3: Logout Not Working
- **Solution**: Check if logout button is visible
- Check browser console for errors
- Verify localStorage is being cleared

### Issue 4: Redirect Not Working
- **Solution**: Check if React Router is properly configured in App.js
- Verify ProtectedUserRoute and ProtectedAdminRoute are working
- Check browser console for routing errors

### Issue 5: Form Validation Not Working
- **Solution**: Check if useAuth hook is imported correctly
- Verify form validation logic in AuthModal.js
- Check for console errors

---

## Browser DevTools Checklist

### Console Tab (F12 → Console)
- [ ] No errors showing
- [ ] No warnings except deprecation warnings
- [ ] Check for missing CSS/JS files

### Application Tab (F12 → Application)
- [ ] Local Storage shows `authUser` key when logged in
- [ ] Local Storage is cleared when logged out
- [ ] User object contains: name, email, role, timestamp

### Network Tab (F12 → Network)
- [ ] CSS files loading (AuthModal.css, App.css, etc.)
- [ ] JS files loading (AuthContext, AuthModal, etc.)
- [ ] No 404 errors for resources

### Performance Tab (F12 → Performance)
- [ ] Modal opens smoothly
- [ ] No jank during animations
- [ ] Form validation is responsive

---

## Expected Timeline

| Action | Expected Result | Time |
|--------|-----------------|------|
| Click Login/Register | Modal appears | <100ms |
| Type in form | Real-time validation | <50ms |
| Click Submit | Form validates & redirects | <200ms |
| Refresh page | User stays logged in | <500ms |
| Click Logout | Session cleared | <100ms |
| Toggle login/register | Form switches | <50ms |
| Modal animation | Smooth fade in | 300ms |

---

## Success Criteria Checklist

### Authentication ✓
- [ ] Can register as new user
- [ ] Can login as existing user
- [ ] Can login as admin with checkbox
- [ ] Can logout successfully
- [ ] Data persists after refresh
- [ ] Data clears on logout

### Authorization ✓
- [ ] Users can access Dashboard/Profile
- [ ] Users cannot access Admin panel
- [ ] Admins can access Admin panel
- [ ] Admins cannot access Dashboard/Profile
- [ ] Unauthorized access redirects to home

### UI/UX ✓
- [ ] Modal opens/closes smoothly
- [ ] Form validation shows errors
- [ ] Navbar updates based on login state
- [ ] Responsive on mobile/tablet/desktop
- [ ] All buttons and links work
- [ ] Logout button is visible when logged in

### Performance ✓
- [ ] App loads quickly
- [ ] Modal opens instantly
- [ ] Form submission is fast
- [ ] No lag on refresh
- [ ] Animations are smooth

---

## Debugging Tips

### Check User Role in Console
```javascript
// Open DevTools Console and type:
JSON.parse(localStorage.getItem('authUser'))
// Should show: { name: "...", email: "...", role: "user" or "admin", ... }
```

### Force Logout for Testing
```javascript
// Open DevTools Console and type:
localStorage.removeItem('authUser')
// Then refresh page
```

### Check Current Route
```javascript
// App.js prints current route in useEffect
// Check console for route changes
```

### Test Protected Routes
```
Not logged in:
- /dashboard → redirects to /
- /admin → redirects to /
- /profile → redirects to /

Logged in as user:
- /dashboard → works
- /profile → works
- /admin → redirects to /

Logged in as admin:
- /admin → works
- /dashboard → redirects to /
- /profile → redirects to /
```

---

## Notes for Future Development

1. Currently uses localStorage (not secure)
2. No backend validation
3. Any password is accepted
4. No email verification
5. Anyone can claim to be admin by checking checkbox
6. In production, implement:
   - Backend authentication
   - JWT tokens
   - Password hashing
   - Email verification
   - Secure session management
