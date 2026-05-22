# ⚡ Quick Start - Backend Setup (5 Minutes)

## Pre-requisites Installed?
- ✅ Node.js (v14+)
- ✅ MongoDB (local or Atlas account)
- ✅ npm/yarn

---

## 🚀 Start Backend in 5 Steps

### Step 1: Install Dependencies (1 minute)
```bash
cd backend
npm install
```

### Step 2: Setup Environment File (30 seconds)
Create `.env` file in `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/women-safety
JWT_SECRET=super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

**Using MongoDB Atlas?**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/women-safety
JWT_SECRET=super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

### Step 3: Start MongoDB (1 minute)
```bash
mongod
```
(Keep this running in separate terminal)

### Step 4: Start Backend Server (30 seconds)
```bash
npm run dev
```

You should see:
```
✓ MongoDB Connected: localhost
Server running on port 5000
```

### Step 5: Test Backend (30 seconds)
Open browser:
```
http://localhost:5000
```

You should see API info. ✅

---

## 🧪 Quick Test

### Using Postman

**Register:**
```
POST http://localhost:5000/api/auth/register

{
  "name": "Test",
  "email": "test@test.com",
  "password": "pass123",
  "confirmPassword": "pass123"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login

{
  "email": "test@test.com",
  "password": "pass123"
}
```

Copy the `token` from response!

**Get User (Protected):**
```
GET http://localhost:5000/api/auth/me

Headers:
Authorization: Bearer <paste_token_here>
```

---

## 🔗 Connect Frontend

Update `frontend/src/contexts/AuthContext.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

Then update fetch calls:
```javascript
fetch(`${API_URL}/auth/login`, ...)
fetch(`${API_URL}/auth/register`, ...)
```

---

## ⚠️ Common Issues

**Port 5000 in use?**
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**MongoDB not found?**
- Start mongod first: `mongod`
- Or use MongoDB Atlas (cloud)

**CORS Error?**
- Backend CORS is enabled
- Check frontend is calling `http://localhost:5000/api`

---

## 📊 File Structure Created

```
backend/
├── config/db.js           ← MongoDB config
├── models/User.js         ← User schema
├── controllers/authController.js ← Logic
├── routes/auth.js         ← Endpoints
├── middleware/auth.js     ← JWT check
├── .env                   ← Secrets
├── package.json           ← Dependencies
└── server.js              ← Main file
```

---

## ✅ Verification Checklist

- [ ] Backend installed (`npm install` done)
- [ ] `.env` file created with correct values
- [ ] MongoDB running (`mongod` or Atlas)
- [ ] Backend running (`npm run dev`)
- [ ] Can access `http://localhost:5000` in browser
- [ ] Can register user in Postman
- [ ] Can login in Postman
- [ ] Can get user with token
- [ ] Frontend updated with API_URL

---

## 🎯 Next Steps

1. Test all endpoints in Postman
2. Update frontend AuthContext.js
3. Test login/register in web app
4. Create more users and test

---

## 📚 Full Documentation

See `README.md` for:
- Detailed API docs
- All endpoints
- Error handling
- Deployment info

---

**Status:** ✅ Ready  
**Time:** ~5 minutes  
**Difficulty:** Easy  

Let's go! 🚀
