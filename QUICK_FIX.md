# ⚡ Quick Fix: ECONNREFUSED Error

## Problem
```
[vite] http proxy error: /api/auth/signup
AggregateError [ECONNREFUSED]
```

**Backend server nahi chal raha!**

## Solution (3 Steps)

### 1️⃣ Backend Server Start Karein

**New Terminal Window Open Karein** aur yeh command run karein:

```bash
cd server
npm run dev
```

Agar dependencies install nahi hain:
```bash
cd server
npm install
npm run dev
```

### 2️⃣ Verify Server Running

Terminal mein yeh dikhna chahiye:
```
✅ MongoDB connected: localhost
🚀 Server running on port 5000
```

### 3️⃣ Frontend Refresh Karein

Browser mein frontend page refresh karein. Ab error nahi aayega!

---

## ✅ Success Check

1. Backend terminal: `🚀 Server running on port 5000`
2. Browser: `http://localhost:5173` - No proxy errors
3. Signup/Login: Working without errors

---

**Note**: Backend aur Frontend dono alag terminals mein chalne chahiye!

