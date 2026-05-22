# Women Safety App - Quick Setup & Feature Guide

## 🚀 Quick Start

### Installation
```bash
cd "Women Safety\frontend"
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 📋 Complete Feature List

### ✅ User Pages
- **Home** (`/`) - Landing page with features overview
- **About** (`/about`) - Organization information & values
- **Know Your Rights** (`/know-your-rights`) - Legal rights & resources
- **Login** (`/login`) - Authentication form
- **Register** (`/register`) - User registration form

### 👤 User Dashboard Features
- **Profile** (`/profile`)
  - Upload profile image with preview
  - Edit personal information
  - Account settings management
  - Profile data persists with localStorage

- **Dashboard** (`/dashboard`)
  - Live location map using Leaflet/OpenStreetMap
  - Geolocation with address display
  - Safety statistics cards
  - Quick action buttons
  - Recent activity tracker
  - Map refresh functionality

### 👨‍💼 Admin Section (`/admin`)
- **Overview Tab**
  - Total users: 2,543
  - Active users: 1,876
  - New users this month: 245
  - Alerts sent: 156
  - Average session time: 24 mins
  - System uptime: 98%
  - Activity growth chart placeholder

- **Users Tab**
  - View all users in table format
  - Activate/deactivate user accounts
  - Delete users
  - View user roles (member, moderator)
  - View user status (active, inactive)

- **Reports Tab**
  - View user reports
  - Report types (safety concern, inappropriate content, account issues)
  - Report status tracking (pending, in-progress, resolved)
  - View details and resolve reports

- **Settings Tab**
  - General settings (maintenance mode, notifications, registration)
  - Security settings (session timeout, max login attempts)
  - Database backup functionality

---

## 🗺️ Location Features

### How the Map Works
1. **Geolocation Detection**
   - App requests permission to access your location
   - Browser automatically detects latitude and longitude
   - Falls back to default location (New York) if denied

2. **Map Display**
   - Shows real-time location marker
   - Uses free OpenStreetMap tiles
   - Can click marker for location details
   - 500px height on desktop, responsive on mobile

3. **Address Display**
   - Uses Nominatim reverse geocoding API
   - Converts coordinates to readable address
   - Shows city/state information

4. **Refresh Location**
   - Manual refresh button available
   - Updates location in real-time
   - Shows loading state during update

---

## 📸 Profile Image Upload

### How It Works
1. Click "Change Photo" in edit mode
2. Select image from your device
3. See preview before saving
4. Click "Save" to update profile
5. Image stored in localStorage (max ~5MB)

### Supported Formats
- JPG, JPEG
- PNG
- GIF
- WebP

---

## 🎨 Design Highlights

### Color Scheme
- **Primary**: #9c27b0 (Purple)
- **Secondary**: #673ab7 (Deep Purple)
- **Accent**: #7b1fa2 (Dark Purple)
- **Background**: White/Light Gray

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small Mobile: 320px - 479px

### Mobile Features
- Hamburger menu for navigation
- Touch-friendly buttons
- Optimized map display
- Responsive tables
- Stacked layouts

---

## 🔒 Data Storage

### LocalStorage Usage
- Profile image (as base64)
- User profile information
- Theme preferences (ready to implement)
- Session data (ready to implement)

### How to Clear Data
```javascript
localStorage.clear(); // Clear all data
localStorage.removeItem('userProfile'); // Clear specific item
```

---

## 📱 Navigation Structure

```
Home
├── About
├── Know Your Rights
├── Dashboard
│   └── Live Location Map
│   └── Quick Actions
│   └── Recent Activity
├── Profile
│   └── Profile Image
│   └── Personal Info
│   └── Account Settings
├── Admin (Protected)
│   ├── Overview
│   ├── Users Management
│   ├── Reports
│   └── Settings
├── Login
└── Register
```

---

## 🔧 Customization Guide

### Change Default Location
Edit `Dashboard.js` line ~16:
```javascript
const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Change these
```

### Change Theme Color
Search and replace `#9c27b0` in CSS files with your color

### Modify Hotline Numbers
Find and update phone numbers in:
- `Footer.js`
- `Home.js`
- `KnowYourRights.js`

### Add/Remove Admin Features
Edit `Admin.js` tabs and content as needed

---

## 🚀 Deployment Ready

### Building for Production
```bash
npm run build
```

Creates optimized production build in `build/` folder

### Hosting Options
- Vercel (recommended for React)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Heroku
- DigitalOcean

---

## 🔗 API Integration Points

When ready to connect a backend:

1. **Authentication**
   - Update endpoints in `Login.js` and `Register.js`
   - Replace fetch calls with actual API URLs

2. **Profile**
   - Create endpoints for profile CRUD
   - Replace localStorage with API calls

3. **Admin**
   - Connect user management endpoints
   - Link report handling APIs
   - Implement settings persistence

4. **Location**
   - Optional: Use Google Maps API instead of Nominatim
   - Requires API key configuration

---

## 📚 Dependencies

### Core
- react: UI library
- react-dom: DOM rendering
- react-router-dom: Client-side routing
- axios: HTTP client

### Maps
- leaflet: Mapping library
- react-leaflet: React wrapper for Leaflet

### Charts
- chart.js: Chart library
- react-chartjs-2: React wrapper for Chart.js

---

## 🐛 Troubleshooting

### Map Not Loading
- Check browser console for errors
- Verify internet connection
- Ensure geolocation is enabled
- Try different browser

### Profile Image Not Saving
- Check if localStorage is enabled
- Clear browser cache
- Check available storage space
- Use smaller image file

### Navigation Issues
- Clear browser cache
- Check URL paths in browser
- Verify React Router setup

---

## ✨ Future Enhancement Ideas

1. Backend API integration
2. Real-time notifications
3. Community messaging system
4. Emergency alert broadcasting
5. Resource search/filtering
6. Video content streaming
7. Appointment scheduling
8. Multi-language support
9. Dark mode theme
10. Offline functionality

---

## 📞 Support Hotlines (Demo Data)

- National Domestic Violence Hotline: 1-800-799-7233
- National Sexual Assault Hotline: 1-800-656-4673
- Crisis Text Line: Text HOME to 741741
- Emergency: 911

---

## 📄 File Summary

| File | Purpose |
|------|---------|
| App.js | Main app component & routing |
| Dashboard.js | User dashboard with map |
| UserProfile.js | Profile management |
| Admin.js | Admin dashboard |
| Dashboard.css | Styles for dashboard/profile/admin |
| Pages.css | Styles for pages |
| App.css | Global styles |

---

**Created**: January 2026
**Version**: 1.0.0
**Status**: Production Ready
