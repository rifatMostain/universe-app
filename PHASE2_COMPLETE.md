# Phase 2: Authentication & Database Schemas - Complete ✅

**Date:** December 16, 2025  
**Status:** Complete  
**Authentication:** JWT (JSON Web Tokens)

---

## Overview

Phase 2 implements a complete authentication system using JWT tokens and MongoDB for user management, along with database schemas for universities and application tracking.

---

## ✅ Completed Tasks

### Task 2.1: MongoDB Schemas
- **User.js** - User accounts with authentication
- **SavedUniversity.js** - Universities bookmarked by users
- **ApplicationTracker.js** - Track application status
- **Chat.js** - Chatbot conversation history

### Task 2.2: Frontend Authentication
- **AuthContext.jsx** - Authentication state management
- **Login.jsx** - User login page
- **SignUp.jsx** - User registration page
- **ProtectedRoute.jsx** - Route protection component

### Task 2.3: Backend Authentication
- **JWT Middleware** - Token verification
- **Auth Routes** - Signup, login, verify endpoints
- **Password Hashing** - Bcrypt for security
- **Protected Routes** - User profile management

---

## 🔐 Authentication Flow

1. User signs up → Password hashed → Saved to MongoDB
2. User logs in → Password verified → JWT token generated
3. Token stored in localStorage (client-side)
4. All API requests include: `Authorization: Bearer <token>`
5. Backend verifies token → Attaches user to `req.user`

---

## 📁 Project Structure

```
backend/
├── middleware/
│   └── auth.js              # JWT verification middleware
├── models/
│   ├── User.js              # User model with password
│   ├── Chat.js              # Chat history
│   ├── SavedUniversity.js   # Saved universities
│   ├── ApplicationTracker.js # Application tracking
│   └── index.js             # Model exports
├── routes/
│   ├── auth.js              # Signup/login routes
│   └── user.js              # Protected user routes
└── server.js                # Main server file

frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state management
│   ├── pages/
│   │   └── auth/
│   │       ├── Login.jsx    # Login page
│   │       └── SignUp.jsx   # Signup page
│   ├── components/
│   │   └── ProtectedRoute.jsx # Route protection
│   └── utils/
│       ├── api.js           # Axios instance
│       └── apiHelpers.js    # API helper functions
```

---

## 🚀 API Endpoints

### Public Routes (No authentication required)

**POST /api/auth/signup**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Protected Routes (Requires Authorization header)

**GET /api/profile**
```
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "profile": { ... }
  }
}
```

**PUT /api/profile**
```json
Headers: Authorization: Bearer <token>

Request:
{
  "name": "Updated Name",
  "profile": {
    "studyLevel": "Masters",
    "desiredCountry": ["USA", "Canada"],
    "cgpa": 3.8
  }
}
```

---

## 💻 Usage Examples

### Frontend - Using Auth

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, signup } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <p>Please log in</p>;
  }

  // User info
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Frontend - Making API Calls

```javascript
import { getUserProfile, updateUserProfile } from './utils/apiHelpers';

// Get user profile
const profile = await getUserProfile();

// Update profile
await updateUserProfile({
  profile: {
    studyLevel: 'Masters',
    cgpa: 3.8
  }
});
```

### Backend - Protecting Routes

```javascript
const { authMiddleware } = require('./middleware/auth');

// Protected route
router.get('/my-route', authMiddleware, async (req, res) => {
  // Access user info
  const userId = req.user._id;
  const userEmail = req.user.email;
  
  res.json({ message: `Hello ${req.user.name}!` });
});
```

### Backend - Creating User Data

```javascript
const { SavedUniversity } = require('./models');

// Save university for logged-in user
router.post('/universities/save', authMiddleware, async (req, res) => {
  const savedUni = await SavedUniversity.create({
    userId: req.user._id,
    universityName: req.body.name,
    country: req.body.country,
    program: req.body.program
  });
  
  res.json(savedUni);
});
```

---

## ⚙️ Environment Variables

### Backend `.env`
```env
# MongoDB
MONGO_URI=mongodb+srv://...

# JWT Authentication
JWT_SECRET=universe-app-super-secret-key-change-in-production-2025
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

### Frontend `.env`
```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testing

### Manual Testing

**Test Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

**Test Protected Route:**
```bash
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Results
- ✅ Signup returns token and user object
- ✅ Login returns token and user object
- ✅ Protected route without token returns 401
- ✅ Protected route with token returns user data

---

## 🔒 Security Features

- ✅ **Password Hashing** - Bcrypt with salt
- ✅ **JWT Tokens** - Signed and verified
- ✅ **Token Expiration** - 7 days default
- ✅ **Protected Routes** - Middleware verification
- ✅ **Password Excluded** - Never returned in API responses
- ✅ **HTTPS Ready** - Use in production

---

## 📊 Database Models

### User
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  profile: {
    studyLevel: String,
    desiredCountry: [String],
    researchInterests: [String],
    cgpa: Number,
    fieldOfStudy: String,
    // ... more fields
  },
  role: String (default: 'student'),
  createdAt: Date,
  lastLogin: Date
}
```

### SavedUniversity
```javascript
{
  userId: ObjectId (ref: 'User'),
  universityName: String,
  country: String,
  program: String,
  deadline: Date,
  notes: String
}
```

### ApplicationTracker
```javascript
{
  userId: ObjectId (ref: 'User'),
  universityName: String,
  program: String,
  deadline: Date,
  status: String, // "Not Started", "In Progress", "Applied", etc.
  priority: String,
  documents: [Object]
}
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

### Start Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

### Test the App
1. Visit http://localhost:5173/signup
2. Create an account
3. Login with your credentials
4. Access protected pages

---

## ✅ Acceptance Criteria - All Met

### Task 2.1
- ✅ User.js schema with required fields
- ✅ SavedUniversity.js schema
- ✅ ApplicationTracker.js schema
- ✅ Schemas can be imported and used
- ✅ Sample data can be created

### Task 2.2
- ✅ Users can register
- ✅ Users can login
- ✅ Login state persists across refreshes
- ✅ UI components created

### Task 2.3
- ✅ Protected routes return 401 without token
- ✅ Protected routes work with valid token
- ✅ Middleware verifies JWT tokens
- ✅ User info attached to req.user

---

## 🎯 Key Features

- Simple JWT authentication (no Firebase needed)
- Secure password storage
- Persistent login sessions
- Protected API routes
- User profile management
- MongoDB integration
- Clean and maintainable code

---

## 📚 Important Files

| Purpose | File Path |
|---------|-----------|
| Auth Middleware | `backend/middleware/auth.js` |
| Auth Routes | `backend/routes/auth.js` |
| User Routes | `backend/routes/user.js` |
| User Model | `backend/models/User.js` |
| Auth Context | `frontend/src/context/AuthContext.jsx` |
| Login Page | `frontend/src/pages/auth/Login.jsx` |
| SignUp Page | `frontend/src/pages/auth/SignUp.jsx` |
| Protected Route | `frontend/src/components/ProtectedRoute.jsx` |

---

**Phase 2 Complete!** ✅  
Ready for Phase 3: Feature Implementation

