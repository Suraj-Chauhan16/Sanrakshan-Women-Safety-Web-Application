# Women Safety Backend API

A robust MERN (MongoDB, Express, React, Node.js) backend API for the Women Safety application with complete authentication functionality.

## 🚀 Features

- ✅ User Registration with validation
- ✅ User Login with JWT authentication
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Role-based access control (admin/user)
- ✅ CORS enabled for frontend integration
- ✅ MongoDB integration
- ✅ Error handling and validation
- ✅ Environment configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone and Setup
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory with the following:

```env
MONGODB_URI=mongodb://localhost:27017/women-safety
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/women-safety
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud)** - Update MONGODB_URI in .env

### 4. Run the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "user"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

#### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "priya@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "user"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### 3. Get Current User (Protected)
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+91 9876543210",
    "role": "user",
    "isVerified": false,
    "createdAt": "2026-01-17T10:30:00.000Z"
  }
}
```

---

#### 4. Update User Profile (Protected)
**PUT** `/auth/updateprofile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Priya Sharma Updated",
  "phone": "+91 9876543210"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Priya Sharma Updated",
    "email": "priya@example.com",
    "phone": "+91 9876543210",
    "role": "user"
  }
}
```

---

### Health Check

**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-17T10:30:00.000Z"
}
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   └── authController.js     # Auth logic
├── middleware/
│   └── auth.js              # JWT middleware
├── models/
│   └── User.js              # User schema
├── routes/
│   └── auth.js              # Auth routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## 🔐 Security Features

### Password Security
- Passwords are hashed using bcryptjs (10 salt rounds)
- Passwords are never returned in API responses
- Passwords are excluded from user queries by default

### Authentication
- JWT tokens expire after 7 days
- Tokens must be included in Authorization header
- Token format: `Bearer <token>`

### Validation
- Email format validation
- Password strength requirements (minimum 6 characters)
- Name length validation
- Password confirmation check during registration
- Input sanitization

### Database
- Unique email constraint
- Timestamps for all records
- User roles for access control

## 🧪 Testing with Postman

### 1. Register a New User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 2. Login User
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token_from_login>
```

### 4. Update Profile
```
PUT http://localhost:5000/api/auth/updateprofile
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+91 9876543210"
}
```

## 🔗 Connecting with Frontend

### Update Frontend AuthContext

Update your `frontend/src/contexts/AuthContext.js` to use the backend API:

```javascript
const API_URL = 'http://localhost:5000/api';

// In login function
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// In register function
const response = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password, confirmPassword })
});
```

## 📊 User Schema

```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String (optional),
  role: String (user/admin, default: user),
  isVerified: Boolean (default: false),
  emergencyContacts: Array,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:** 
- Ensure MongoDB is running locally or check MongoDB Atlas connection string
- Verify MONGODB_URI in .env file

### Issue: CORS Error
**Solution:**
- CORS is already enabled in server.js
- Ensure frontend is making requests to `http://localhost:5000/api`

### Issue: JWT Token Invalid
**Solution:**
- Check token format: `Bearer <token>`
- Verify JWT_SECRET matches in .env
- Token expires after 7 days

### Issue: Port 5000 Already in Use
**Solution:**
- Change PORT in .env file
- Or kill process using port 5000

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **nodemon** - Auto-reload during development

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create women-safety-api

# Set environment variables
heroku config:set MONGODB_URI=<your_mongodb_uri>
heroku config:set JWT_SECRET=<your_secret>
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to AWS / DigitalOcean

1. Set up a Node.js server
2. Install MongoDB
3. Clone repository
4. Set environment variables
5. Install dependencies: `npm install`
6. Run: `npm start`
7. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Admin dashboard APIs
- [ ] User profile image upload
- [ ] Emergency contacts CRUD APIs
- [ ] Safety tips API
- [ ] Hotline numbers API
- [ ] Rate limiting
- [ ] Request logging

## 📞 Support

For issues or questions, please refer to the documentation or check the troubleshooting section.

## 📄 License

ISC

---

**Version:** 1.0.0  
**Created:** January 17, 2026  
**Status:** Production Ready ✅
