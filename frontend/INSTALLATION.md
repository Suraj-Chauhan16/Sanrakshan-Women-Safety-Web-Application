# Installation & Testing Guide

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **Git** (optional, for version control)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

---

## 📦 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd "C:\Users\krishna\Desktop\Women Safety\frontend"
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages from `package.json`:
- react
- react-dom
- react-router-dom
- leaflet
- react-leaflet
- chart.js
- react-chartjs-2
- axios

**Expected time**: 2-5 minutes (first time)

### Step 3: Verify Installation
```bash
npm --version
node --version
```

Both should return version numbers without errors.

### Step 4: Start Development Server
```bash
npm start
```

Expected output:
```
Compiled successfully!
You can now view women-safety-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 5: Open in Browser
The app will automatically open at `http://localhost:3000`
If not, manually navigate to that URL.

---

## ✅ Testing Checklist

### 1. Navigation Testing
- [ ] Click all navbar links (Home, About, Know Your Rights, Dashboard, Profile, Admin, Login, Register)
- [ ] Verify each page loads correctly
- [ ] Check hamburger menu on mobile (resize browser to <768px)
- [ ] Test back/forward browser buttons

### 2. Home Page Testing
- [ ] Page loads with hero section
- [ ] Feature cards display correctly
- [ ] Registration and Login buttons work
- [ ] Links to other pages function

### 3. About Page Testing
- [ ] Content displays properly
- [ ] Contact information visible
- [ ] Values section shows correctly
- [ ] Responsive layout works

### 4. Know Your Rights Testing
- [ ] All sections load (Constitutional, Workplace, etc.)
- [ ] Emergency hotline numbers visible
- [ ] Content is readable and well-formatted
- [ ] Links work if any

### 5. Registration Form Testing
- [ ] All input fields appear
- [ ] Form validation works:
  - [ ] Required field validation
  - [ ] Email format validation
  - [ ] Password matching validation
  - [ ] Terms acceptance required
- [ ] Submit button works
- [ ] Success/error messages display

### 6. Login Form Testing
- [ ] Email and password fields visible
- [ ] Form validation works
- [ ] Forgot password link visible
- [ ] Link to register page works
- [ ] Submit button functions

### 7. Profile Page Testing
- [ ] User information displays
- [ ] Profile image shows (or placeholder if none)
- [ ] Edit button toggles edit mode
- [ ] Image upload works:
  - [ ] Click "Change Photo"
  - [ ] Select image from computer
  - [ ] Preview displays
  - [ ] Save button works
  - [ ] Data persists (refresh page, data should remain)
- [ ] Edit fields:
  - [ ] Can edit name
  - [ ] Can edit email
  - [ ] Can edit phone
  - [ ] Can edit city
  - [ ] Can edit date of birth
  - [ ] Can edit bio
- [ ] Save changes work
- [ ] Cancel button restores original data
- [ ] Account settings section visible

### 8. Dashboard Page Testing (CRITICAL - Maps Section)
- [ ] Page loads without errors
- [ ] Welcome section displays
- [ ] Statistics cards show:
  - [ ] Current Location
  - [ ] Safety Status
  - [ ] Community count
  - [ ] Resources count
- [ ] **Map Display** (Most Important):
  - [ ] Browser requests geolocation permission
  - [ ] Accept permission in browser prompt
  - [ ] Map loads and displays
  - [ ] Your location appears as a marker
  - [ ] Address shows below map
  - [ ] Can click marker for popup
  - [ ] Popup shows coordinates
  - [ ] "Refresh Location" button works
  - [ ] Map responds to zoom/pan
- [ ] Quick Actions cards:
  - [ ] All 4 action cards visible
  - [ ] Buttons are clickable
  - [ ] Proper styling applied
- [ ] Recent Activity section:
  - [ ] Activity items display
  - [ ] Icons show correctly
  - [ ] Time stamps visible

### 9. Admin Panel Testing
- [ ] Admin page loads
- [ ] Tab navigation works:
  - [ ] Overview tab
  - [ ] Users tab
  - [ ] Reports tab
  - [ ] Settings tab
- **Overview Tab**:
  - [ ] Statistics cards display
  - [ ] Correct values shown
  - [ ] Chart placeholder visible
- **Users Tab**:
  - [ ] User table displays
  - [ ] User data visible
  - [ ] Status badges colored correctly
  - [ ] Role badges display
  - [ ] Activate/Deactivate buttons work
  - [ ] Delete buttons function
  - [ ] Add New User button visible
- **Reports Tab**:
  - [ ] Report cards display
  - [ ] Report status badges show
  - [ ] Action buttons present
  - [ ] Report details visible
- **Settings Tab**:
  - [ ] Settings sections load
  - [ ] Checkboxes work
  - [ ] Number inputs work
  - [ ] Buttons are functional

### 10. Responsive Design Testing
Test on different screen sizes:
- [ ] Desktop (1200px+) - Normal layout
- [ ] Tablet (768px-1199px) - Adjusted layout
- [ ] Mobile (480px-767px) - Mobile layout with hamburger
- [ ] Small Mobile (320px-479px) - Minimal layout

Use browser DevTools (F12) → Device Toolbar to test.

### 11. Map Permission Testing
- [ ] **First Visit**: Browser should request location permission
- [ ] **Allow**: Map shows real location
- [ ] **Deny**: Shows default location (New York)
- [ ] **Reset Permission**: 
  - Firefox: Menu → Settings → Privacy → Permissions → Location
  - Chrome: Click lock icon in address bar → Permissions → Location
  - Safari: Safari → Preferences → Privacy → Location Services

### 12. Image Upload Testing
- [ ] Select small image file (~100KB)
- [ ] Preview displays before save
- [ ] Can see actual image in profile
- [ ] Refresh page - image persists
- [ ] Try different image formats (JPG, PNG)
- [ ] Test with large image (should still work, just slower)

### 13. Form Submission Testing
- [ ] **Registration**:
  - [ ] Blank fields show error
  - [ ] Invalid email shows error
  - [ ] Mismatched passwords show error
  - [ ] Valid form submits without error
  - [ ] Success message appears

- [ ] **Login**:
  - [ ] Empty fields show error
  - [ ] Invalid email shows error
  - [ ] Valid form submits
  - [ ] Success message appears

### 14. Data Persistence Testing
- [ ] Add profile information
- [ ] Upload profile image
- [ ] Refresh page (F5)
- [ ] Data should still be there
- [ ] Edit profile
- [ ] Refresh again
- [ ] Changes should persist
- [ ] Clear browser cache
- [ ] Data might be cleared (expected)

### 15. Error Handling Testing
- [ ] Disable internet, try location access
- [ ] Browser shows appropriate error message
- [ ] App doesn't crash
- [ ] Can still browse other pages
- [ ] Re-enable internet, refresh works

---

## 🔧 Troubleshooting Common Issues

### Issue 1: npm install fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install

# If still fails, delete node_modules and try again
rm -r node_modules
npm install
```

### Issue 2: Port 3000 already in use
**Solution**:
```bash
# Use different port
set PORT=3001 && npm start  # Windows
PORT=3001 npm start         # Mac/Linux
```

### Issue 3: Module not found errors
**Solution**:
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### Issue 4: Geolocation not working
**Solution**:
1. Check browser permissions
2. Use HTTPS (required for geolocation in some cases)
3. Try different browser
4. Check browser console (F12) for errors

### Issue 5: Map not displaying
**Solution**:
1. Check internet connection (maps require CDN)
2. Clear browser cache
3. Try different browser
4. Check browser console for errors
5. Verify Leaflet CSS is loaded

### Issue 6: Styles not applying
**Solution**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check for CSS file loading errors in console
4. Restart development server

---

## 🚀 Performance Testing

### Check Build Size
```bash
npm run build
```

This creates an optimized production build. Check the `build/` folder size.

### Performance Metrics
- Page load time: Should be < 3 seconds
- Map load time: Should be < 2 seconds
- Profile image upload: Should be instant
- Form submission: Should respond immediately

---

## 📋 Browser Developer Tools (F12)

### Essential Checks
1. **Console Tab**: No error messages (warnings are OK)
2. **Network Tab**: All resources load successfully
3. **Application Tab**: LocalStorage shows profile data
4. **Lighthouse**: Run audit for performance metrics

---

## ✨ Success Criteria

Your setup is complete when:
- ✅ App starts without errors
- ✅ All pages load and navigate correctly
- ✅ Map displays your location
- ✅ Profile image upload works
- ✅ Admin panel is accessible
- ✅ Forms validate correctly
- ✅ Data persists on refresh
- ✅ Responsive design works on all screen sizes
- ✅ No console errors

---

## 📝 Next Steps

1. **Development**:
   - Start making changes to files
   - App auto-reloads on save
   - Check console for errors

2. **Production Build**:
   ```bash
   npm run build
   ```

3. **Deployment**:
   - Upload `build/` folder to hosting service
   - Set up environment variables if needed
   - Configure backend API endpoints

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review browser console (F12) for error messages
3. Check `FEATURES.md` for feature-specific info
4. Review `README.md` for architecture details

---

**Happy Testing! 🎉**

For questions about specific features, see FEATURES.md
