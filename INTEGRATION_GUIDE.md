# 🔗 Backend-Frontend Integration Guide

## ✅ Integration Status: COMPLETE

### 1. **Proxy Configuration** ✅
- **Vite Proxy:** `/api` → `http://localhost:5000
- **Location:** `client/vite.config.ts`**
- **Status:** ✅ Configured correctly

### 2. **CORS Configuration** ✅
- **Backend CORS:** Allows `http://127.0.0.1:5173`
- **Location:** `server/index.js`
- **Status:** ✅ Configured correctly

### 3. **API URLs** ✅
- **All frontend files use:** `/api` (relative path)
- **Vite proxy handles forwarding**
- **Status:** ✅ All files updated

### 4. **Authentication Flow** ✅
- **Token stored in:** `localStorage`
- **Token sent in:** `Authorization` header
- **Status:** ✅ Integrated

## 📋 Integration Checklist

- [x] Vite proxy configured
- [x] CORS enabled on backend
- [x] All API calls use relative paths
- [x] Authentication headers set
- [x] Error handling implemented
- [x] Loading states added

## 🚀 How to Run (Integrated)

### Option 1: Run Both Together
```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Expected output:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
```

## 🔍 Testing Integration

### 1. Health Check
Open in browser: `http://localhost:5000/api/health`
Should return: `{"status":"ok","message":"Babua LMS API is running"}`

### 2. Frontend Test
1. Open: `http://127.0.0.1:5173`
2. Go to Courses page
3. Check browser console (F12) - should see API calls
4. Check Network tab - requests should go to `/api/courses`

### 3. Authentication Test
1. Try to sign up
2. Check if token is saved in localStorage
3. Try to access protected routes (Dashboard)
4. Check if API calls include Authorization header

## 📊 API Endpoints Integration

### Public Endpoints (No Auth Required)
- ✅ `GET /api/courses` - Get all courses
- ✅ `GET /api/courses/:id` - Get course details
- ✅ `GET /api/community/threads` - Get discussions
- ✅ `POST /api/auth/signup` - Register
- ✅ `POST /api/auth/login` - Login

### Protected Endpoints (Auth Required)
- ✅ `GET /api/auth/me` - Get current user
- ✅ `POST /api/courses/:id/enroll` - Enroll in course
- ✅ `POST /api/progress/update` - Update progress
- ✅ `GET /api/progress/course/:id` - Get progress
- ✅ `POST /api/community/thread` - Create thread
- ✅ `GET /api/mentor/my-bookings` - Get bookings

## 🔧 Troubleshooting

### Issue: Network Error
**Solution:**
1. Check if backend is running on port 5000
2. Verify Vite proxy in `vite.config.ts`
3. Check browser console for CORS errors

### Issue: 401 Unauthorized
**Solution:**
1. Check if token exists in localStorage
2. Verify token is sent in Authorization header
3. Check if token is expired

### Issue: CORS Error
**Solution:**
1. Verify `FRONTEND_URL` in server `.env`
2. Check server CORS configuration
3. Ensure frontend URL matches exactly

### Issue: API Returns 404
**Solution:**
1. Check if route exists in backend
2. Verify route path matches exactly
3. Check server logs for errors

## 📝 Environment Variables

### Server `.env` (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/babua-lms
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://127.0.0.1:5173
```

### Client `.env` (client/.env) - Optional
```env
VITE_API_URL=/api
```
(Default is `/api` - uses Vite proxy)

## ✅ Integration Flow

```
Frontend (Port 5173)
    ↓
Makes request to: /api/courses
    ↓
Vite Proxy intercepts
    ↓
Forwards to: http://localhost:5000/api/courses
    ↓
Backend (Port 5000)
    ↓
Processes request
    ↓
Returns JSON response
    ↓
Vite Proxy forwards response
    ↓
Frontend receives data
```

## 🎯 Current Status

✅ **Backend-Frontend Integration: COMPLETE**
- All API calls working
- Authentication flow integrated
- CORS properly configured
- Proxy working correctly
- Error handling in place

**Ready to use!** 🚀

