# Emergency Contact Feature - Integration Guide

## Overview
This document explains how the Emergency Contact Management feature integrates with the existing Women Safety application.

## Architecture

### File Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── EmergencyContact.js (NEW - Main component)
│   │   ├── EmergencyContact.css (NEW - Styling)
│   │   ├── Home.js (existing)
│   │   ├── About.js (existing)
│   │   ├── KnowYourRights.js (existing)
│   │   ├── UserProfile.js (existing)
│   │   ├── Login.js (existing)
│   │   ├── Register.js (existing)
│   │   ├── Admin.js (existing)
│   │   └── Pages.css (existing)
│   ├── components/
│   │   ├── Navbar.js (UPDATED - Added link)
│   │   ├── Footer.js (existing)
│   │   └── AuthModal.js (existing)
│   ├── contexts/
│   │   └── AuthContext.js (existing)
│   ├── App.js (UPDATED - Added route & import)
│   ├── App.css (existing)
│   └── index.js (existing)
```

## Changes Made

### 1. App.js
**Import Added:**
```javascript
import EmergencyContact from './pages/EmergencyContact';
```

**Route Added:**
```javascript
<Route path="/emergency-contact" element={<ProtectedUserRoute element={<EmergencyContact />} />} />
```

**Protection Level:** Regular users only (not admins)

### 2. Navbar.js
**Navigation Link Added:**
```javascript
{user && !isAdmin() && (
  <>
    <li><Link to="/emergency-contact" onClick={() => setIsMenuOpen(false)}>Emergency Contacts</Link></li>
    <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
  </>
)}
```

**Visibility Rules:**
- Shows only for logged-in users
- Hides for admin users
- Positioned after "Know Your Rights" link
- Before "Profile" link

### 3. New Component: EmergencyContact.js
**Dependencies:**
- React (useState, useEffect)
- AuthContext (for user authentication)
- Pages.css (base page styling)
- EmergencyContact.css (component styling)

**Key Functions:**
1. `handleAddContact()` - Add new emergency contact
2. `handleEditContact()` - Edit existing contact
3. `handleDeleteContact()` - Delete contact
4. `handleInputChange()` - Handle form input changes
5. `validateForm()` - Validate form data
6. `saveContactsToLocalStorage()` - Persist data to browser storage
7. `loadContactsFromLocalStorage()` - Load data on component mount

## Data Flow

### Adding a Contact:
```
User fills form → validateForm() → 
Create contact object with ID and timestamp → 
Update state → saveContactsToLocalStorage() → 
Display success message → Reset form
```

### Editing a Contact:
```
User clicks Edit → formData populated with existing data → 
User modifies fields → validateForm() → 
Update contact in array → saveContactsToLocalStorage() → 
Display success message
```

### Deleting a Contact:
```
User clicks Delete → Confirmation dialog → 
Remove from array → saveContactsToLocalStorage() → 
Update counter and progress bar → Display success message
```

### Data Persistence:
```
Component mounts → Check localStorage for `emergency-contacts-{userId}` → 
Load contacts into state → Display UI
```

## Authentication Integration

### Protected Route
The Emergency Contact page uses the existing `ProtectedUserRoute` component:
- Checks if user is logged in
- Redirects to home if not authenticated
- Redirects to home if user is admin
- Only regular users can access

### User Context
Uses the existing `AuthContext` to:
- Get current user object
- Access user ID for data isolation
- Check if user is admin
- Get auth status

## Data Storage

### LocalStorage Structure:
```javascript
// Key format: emergency-contacts-{userId}
// Value: JSON string of contacts array

localStorage.getItem('emergency-contacts-user123')
// Returns:
[
  {
    id: 1705431234567,
    name: "Priya Sharma",
    relationship: "Sister",
    phone: "+91 9876543210",
    email: "priya@email.com",
    createdAt: "2026-01-17T10:30:00.000Z",
    updatedAt: "2026-01-17T10:30:00.000Z"
  },
  // ... more contacts
]
```

### Data Isolation:
- Each user has their own localStorage key using `user.id`
- Users cannot access other users' contacts
- Contacts persist across sessions
- Clearing browser cache deletes contacts

## Styling Integration

### CSS Cascade:
1. Base styles from `Pages.css` (common page styles)
2. Component-specific styles from `EmergencyContact.css`
3. Responsive design with media queries
4. Color scheme matches app theme (gradients, purple/pink)

### CSS Classes:
- `.emergency-contact-page` - Main container
- `.emergency-contact-section` - Content section
- `.contact-form-container` - Form wrapper
- `.contacts-list` - Contacts container
- `.contact-card` - Individual contact
- `.tips-section` - Tips grid
- Various utility classes for buttons, alerts, etc.

## Component Lifecycle

### Mount:
1. Component initializes with empty state
2. useEffect runs after render
3. Checks if user exists
4. Loads contacts from localStorage
5. Updates state to display contacts

### State Updates:
1. Form input → `handleInputChange()` → Update formData state
2. Add contact → `handleAddContact()` → Update contacts state
3. Update localStorage → Triggers re-render
4. UI displays updated contacts

### User Logout:
1. Navigation link disappears
2. Direct URL access redirected to home
3. Data remains in localStorage (for when user logs back in)

## Navigation Flow

### Before Login:
```
Home → About → Know Your Rights → [Login/Register]
```

### After Login (Regular User):
```
Home → About → Know Your Rights → Emergency Contacts → Profile
```

### After Login (Admin User):
```
Home → About → Know Your Rights → Admin → [Logout]
(Emergency Contacts link not visible)
```

## Error Handling

### Validation Errors:
1. Form validation returns false
2. Error message set in state
3. Display red alert with error text
4. Form remains open for correction

### Form Validation Rules:
- Name: Required, max 50 characters
- Relationship: Required, must be from dropdown
- Phone: Required, minimum 10 characters with numbers
- Email: Optional, must be valid if provided

### Data Loss Prevention:
- Confirm dialog before deletion
- Form doesn't auto-clear if validation fails
- User feedback for all operations

## Performance Considerations

### Optimization:
- Lightweight component (no external API calls)
- LocalStorage used (instant access)
- Minimal re-renders (specific state updates)
- Lazy loading not needed (simple data size)

### Limitations:
- LocalStorage limited to ~5-10MB per domain
- 5 contacts × ~300 bytes = ~1.5KB per user
- No performance concerns with current design

## Security Considerations

### Client-Side Only:
- Data stored in browser localStorage
- No server-side validation currently
- Not encrypted at rest
- Vulnerable to XSS if compromised

### Recommendations:
1. Implement server-side storage
2. Add data encryption
3. Server-side validation
4. HTTPS for data transmission
5. Consider backup mechanism

## Browser Compatibility

### Required Features:
- ES6 JavaScript
- React 16.8+ (hooks)
- localStorage API
- CSS Grid & Flexbox

### Tested On:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancement Points

### Possible Extensions:
1. Server-side storage (database integration)
2. Cloud backup/sync
3. Contact sharing between users
4. Emergency alert notifications
5. Location sharing
6. Media attachments
7. Contact groups/categories
8. Contact search/filtering
9. Export to CSV
10. Integration with device contacts
11. QR code sharing
12. Multi-language support

## Maintenance & Troubleshooting

### Common Issues:

**Issue: Contacts not saving**
- Check if localStorage is enabled
- Check browser storage limit
- Verify user is logged in
- Check browser console for errors

**Issue: Form validation not working**
- Clear browser cache
- Verify all fields have proper names
- Check for JavaScript errors

**Issue: Link not appearing in navbar**
- Verify user is logged in
- Verify user is not an admin
- Check Navbar.js for proper Link setup

**Issue: Data disappearing after logout**
- This is expected behavior (data in localStorage)
- Logging back in with same account retrieves data

### Debug Tips:
1. Check localStorage: `localStorage.getItem('emergency-contacts-{userId}')`
2. Check console for errors: `F12` → Console tab
3. Test form validation independently
4. Test localStorage API in browser console
5. Verify authentication status

## Dependencies
- React: UI framework
- react-router-dom: Routing (Link component)
- AuthContext: Authentication state

## No External APIs
- No fetch/axios calls
- No backend integration required
- Works completely offline (except login/register)
- Suitable for MVP/prototype phase

## Version History
- v1.0 - Initial release
  - Add/Edit/Delete contacts
  - LocalStorage persistence
  - Form validation
  - Responsive design
  - Tips section
