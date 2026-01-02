# 🚀 Quick Start Guide - UniVerse

## Start the Project (Both Servers)

### Option 1: Two Separate Terminals

**Terminal 1 - Backend:**
```bash
cd m:\Project-3200\universe-app\backend
npm run dev
```
✅ Backend running at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd m:\Project-3200\universe-app\frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

---

## Verify Installation

### Check Backend:
Visit: http://localhost:5000
You should see: `{"message": "Welcome to UniVerse API", ...}`

### Check Health:
Visit: http://localhost:5000/api/health
You should see: `{"status": "OK", ...}`

### Check Frontend:
Visit: http://localhost:5173
You should see: Beautiful UniVerse landing page

---

## Available Scripts

### Backend (`backend/`)
- `npm start` - Run production server
- `npm run dev` - Run development server with hot reload

### Frontend (`frontend/`)
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## Project Structure

```
universe-app/
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── App.jsx           # Main component
│   │   ├── index.css         # Tailwind styles
│   │   └── utils/
│   │       └── api.js        # Axios instance
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                   # Express Backend
│   ├── server.js             # Main server file
│   ├── .env                  # Environment variables
│   └── package.json
│
├── README.md                  # Project documentation
├── PHASE1_COMPLETION_REPORT.md
└── QUICK_START.md            # This file
```

---

## Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/universe
GEMINI_API_KEY=your_key_here
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key_here
```

---

## Common Issues & Solutions

### Issue: Port already in use
**Solution:** 
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically use next available port

### Issue: Backend connection failed
**Solution:**
1. Make sure backend is running
2. Check `VITE_API_URL` in `frontend/.env`
3. Verify CORS is enabled in backend

### Issue: Tailwind styles not working
**Solution:**
1. Check `tailwind.config.js` exists
2. Verify `@tailwind` directives in `index.css`
3. Restart dev server

---

## Development Workflow

1. **Start Both Servers** (see commands above)
2. **Make Changes**
   - Frontend: Changes auto-reload
   - Backend: Nodemon auto-restarts
3. **Test in Browser**: http://localhost:5173
4. **Check Backend API**: http://localhost:5000

---

## Next Phase Preview

Phase 2 will include:
- 🔐 Firebase Authentication
- 🤖 Google Gemini AI Integration
- 💾 MongoDB Models & Controllers
- 🛣️ React Router Implementation
- 📱 Additional UI Components

---

**Happy Coding! 🎉**
