# Emergency Contact Management - Testing Guide

## Pre-requisites
- React application should be running
- User should be logged in to access the Emergency Contact page
- Browser localStorage should be enabled

## Test Scenarios

### 1. Navigation Test
- [ ] Verify "Emergency Contacts" link appears in navbar for logged-in users
- [ ] Verify "Emergency Contacts" link does NOT appear for logged-out users
- [ ] Verify "Emergency Contacts" link does NOT appear for admin users
- [ ] Clicking the link navigates to `/emergency-contact` route

### 2. Page Load Test
- [ ] Page loads with hero section showing title and description
- [ ] Contact counter shows "0/5" on first visit
- [ ] Progress bar is empty on first visit
- [ ] Empty state with "No Emergency Contacts Yet" message is displayed
- [ ] Tips section is visible at the bottom

### 3. Add Contact Test
- [ ] Click "+ Add Emergency Contact" button
- [ ] Form appears with fields: Name, Relationship, Phone, Email
- [ ] Try submitting with empty name → Error message appears
- [ ] Try submitting with no relationship → Error message appears
- [ ] Try submitting with no phone → Error message appears
- [ ] Try submitting with invalid phone (less than 10 digits) → Error message
- [ ] Try submitting with invalid email → Error message appears
- [ ] Fill all required fields with valid data
- [ ] Click "Add Contact" → Success message appears
- [ ] Contact appears in contacts list
- [ ] Counter updates to "1/5"
- [ ] Progress bar fills 20%

### 4. Multiple Contacts Test
- [ ] Add 5 different contacts
- [ ] After 5 contacts, "+ Add Emergency Contact" button should disappear
- [ ] Counter shows "5/5"
- [ ] Progress bar is full
- [ ] Try refreshing page → all 5 contacts still appear

### 5. Edit Contact Test
- [ ] Click "✏️ Edit" on a contact
- [ ] Form appears with existing contact data pre-filled
- [ ] Form title changes to "Edit Contact"
- [ ] Button text changes to "Update Contact"
- [ ] Modify the contact information
- [ ] Click "Update Contact" → Success message appears
- [ ] Changes are reflected in the contact card
- [ ] Refreshing page shows updated information

### 6. Delete Contact Test
- [ ] Click "🗑️ Delete" on a contact
- [ ] Confirmation dialog appears asking "Are you sure?"
- [ ] Click "OK" → Contact is deleted, success message appears
- [ ] Contact is removed from list
- [ ] Counter decreases (e.g., 5/5 becomes 4/5)
- [ ] "+ Add Emergency Contact" button reappears if below 5 contacts

### 7. Form Cancel Test
- [ ] Click "Add Emergency Contact"
- [ ] Start filling form
- [ ] Click "Cancel" button
- [ ] Form disappears
- [ ] No contact is added

### 8. Contact Card Functionality Test
- [ ] Click phone number link on a contact card
- [ ] System opens phone dialer with the number
- [ ] Click email link (if email exists)
- [ ] System opens email client with the address

### 9. Data Persistence Test
- [ ] Add a contact
- [ ] Refresh the page
- [ ] Contacts still appear
- [ ] Add another contact
- [ ] Logout and login again
- [ ] Same contacts appear
- [ ] User data is isolated (different user sees different contacts)

### 10. Responsive Design Test
- [ ] Desktop (1200px+): Contacts display in grid of multiple columns
- [ ] Tablet (768px-1200px): Contacts display in 2 columns
- [ ] Mobile (320px-768px): Contacts display in single column
- [ ] Form fields stack vertically on all sizes
- [ ] Buttons are touch-friendly on mobile

### 11. Validation Rules Test
- [ ] Name accepts text up to 50 characters
- [ ] Relationship dropdown has all 9 options
- [ ] Phone accepts numbers and special characters (+, -, space, parentheses)
- [ ] Email validation follows standard email format
- [ ] Empty email field is acceptable

### 12. Error & Success Messages Test
- [ ] Error messages appear in red with warning icon
- [ ] Success messages appear in green with checkmark
- [ ] Messages auto-dismiss after 3 seconds
- [ ] Multiple messages don't stack (new message replaces old)

### 13. Relationship Options Test
- [ ] Dropdown contains all 9 relationship types:
  - [ ] Friend
  - [ ] Family
  - [ ] Parent
  - [ ] Sibling
  - [ ] Spouse
  - [ ] Relative
  - [ ] Colleague
  - [ ] Neighbor
  - [ ] Other

### 14. Contact Limit Test
- [ ] Add exactly 5 contacts
- [ ] Try adding 6th contact
- [ ] Error message: "You can only add up to 5 emergency contacts"
- [ ] Delete one contact
- [ ] "+ Add Emergency Contact" button reappears
- [ ] Can add another contact

### 15. Tips Section Test
- [ ] "Choose Reliable People" tip is visible
- [ ] "Keep Numbers Updated" tip is visible
- [ ] "Inform Your Contacts" tip is visible
- [ ] "Diverse Network" tip is visible
- [ ] Tips cards have hover effects
- [ ] Tips cards are responsive on mobile

### 16. Access Control Test
- [ ] Logout
- [ ] Try accessing `/emergency-contact` directly
- [ ] Should be redirected to home page
- [ ] Login as regular user
- [ ] Can access emergency contact page
- [ ] Login as admin user
- [ ] Cannot access emergency contact page (redirected)

## Sample Test Data

### Contact 1
- Name: Priya Sharma
- Relationship: Sister
- Phone: +91 9876543210
- Email: priya@email.com

### Contact 2
- Name: Amit Kapoor
- Relationship: Friend
- Phone: 8765432109
- Email: amit.kapoor@email.com

### Contact 3
- Name: Mrs. Sharma
- Relationship: Mother
- Phone: (91) 7654-32109
- Email: (leave empty)

### Contact 4
- Name: Local Police Station
- Relationship: Other
- Phone: +91-11-2345-6789
- Email: (leave empty)

### Contact 5
- Name: Sarah Patel
- Relationship: Colleague
- Phone: 9876-543-2100
- Email: sarah.p@company.com

## Known Limitations & Notes
1. Data is stored in browser localStorage only (not on server)
2. Clearing browser cache will delete saved contacts
3. Contacts are user-specific and encrypted at localStorage level
4. No backup/export feature currently available
5. Limited to 5 contacts per user

## Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Considerations
- Page should load instantly
- Adding/editing/deleting should be instantaneous
- No lag when switching between form and list views
- Smooth animations without stuttering
