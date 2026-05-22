# 🚀 Backend Setup Guide - Step by Step

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/ (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install MongoDB

#### Option A: Local MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Follow installation guide for your OS
- Start MongoDB service

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to `.env` file

---

## Backend Setup Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

Wait for all packages to install (~2-3 minutes)

### Step 2: Configure Environment Variables

Create `.env` file in backend folder:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/women-safety
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/women-safety?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

### Step 3: Start MongoDB

**If using local MongoDB:**
```bash
mongod
```
(Keep this running in a separate terminal)

**If using MongoDB Atlas:**
- No need to start locally, it's in the cloud

### Step 4: Start Backend Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║  Women Safety Backend API                      ║
║  Server running on port 5000                   ║
║  Environment: development                      ║
╚════════════════════════════════════════════════╝
```

### Step 5: Test Backend

Open in browser or Postman:
```
http://localhost:5000
```

You should see:
```json
{
  "success": true,
  "message": "Women Safety Backend API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## Testing with Postman

### 1. Download Postman
- Download from: https://www.postman.com/downloads/

### 2. Import Collection
- Open Postman
- Click "Import"
- Select `POSTMAN_COLLECTION.json` from backend folder
- Click "Import"

### 3. Test Endpoints

#### Test 1: Register User
```
POST http://localhost:5000/api/auth/register

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

#### Test 2: Login User
```
POST http://localhost:5000/api/auth/login

{
  "email": "test@example.com",
  "password": "password123"
}
```

Expected Response: (Same as register with token)

#### Test 3: Get Current User (Protected)
```
GET http://localhost:5000/api/auth/me

Header:
Authorization: Bearer <token_from_login>
```

#### Test 4: Update Profile
```
PUT http://localhost:5000/api/auth/updateprofile

Header:
Authorization: Bearer <token_from_login>

{
  "name": "Updated Name",
  "phone": "+91 9876543210"
}
```

---

## Connecting Frontend to Backend

### Update AuthContext.js

In `frontend/src/contexts/AuthContext.js`, update the API URL:

```javascript
// Add at top of file
const API_URL = 'http://localhost:5000/api';

// Update login function
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Update register function
const response = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password, confirmPassword })
});

// Update getCurrentUser function
const response = await fetch(`${API_URL}/auth/me`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Troubleshooting

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Problem: "MongoDB Connection Error"
**Check:**
1. Is MongoDB running? (`mongod` command)
2. Is MONGODB_URI correct in `.env`?
3. For MongoDB Atlas: Check username/password in connection string

### Problem: "JWT Token not working"
**Check:**
1. Token format: `Bearer <token>` (with space)
2. Token is not expired (7 days)
3. JWT_SECRET matches in `.env`

### Problem: "Email already exists"
**Solution:**
- Use a different email
- Or delete the user from MongoDB manually

### Problem: "CORS Error in Frontend"
**Check:**
- Backend is running on `http://localhost:5000`
- Frontend is making request to `http://localhost:5000/api`
- CORS is enabled in `server.js`

---

## MongoDB Management

### View Data with MongoDB Compass

1. Download MongoDB Compass from: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse database: `women-safety`
4. View collection: `users`

### Delete All Users (for testing)
```javascript
// In MongoDB CLI
use women-safety
db.users.deleteMany({})
```

---

## Running Both Frontend and Backend

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```

Now:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

---

## File Structure Summary

```
Women Safety/
├── frontend/          (React app)
│   └── src/
│       └── contexts/
│           └── AuthContext.js (connects to backend)
│
└── backend/           (Node.js/Express)
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── authController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── auth.js
    ├── .env
    ├── package.json
    └── server.js
```

---

## Next Steps

1. ✅ Install Node.js
2. ✅ Install MongoDB (local or Atlas)
3. ✅ Setup `.env` file
4. ✅ Run `npm install`
5. ✅ Start backend with `npm run dev`
6. ✅ Test with Postman
7. ✅ Connect frontend to backend
8. ✅ Test login/register flow

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Check if port is available
netstat -an | grep 5000  (Mac/Linux)
netstat -ano | findstr :5000  (Windows)

# View logs
npm run dev 2>&1 | tee server.log
```

---

## Support

- Check README.md for detailed API documentation
- Check server.js for configuration
- Check console output for error messages
- Use Postman for testing endpoints

---

**Status:** ✅ Ready to Use  
**Version:** 1.0.0  
**Created:** January 17, 2026
