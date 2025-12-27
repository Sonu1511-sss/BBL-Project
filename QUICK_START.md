# 🚀 Quick Start Guide - Fix ECONNREFUSED Error

## ❌ Error: ECONNREFUSED
This means **backend server is not running**. Vite proxy is trying to connect to `http://localhost:5000` but nothing is listening there.

## ✅ Solution: Start Backend Server

### Step 1: Open a NEW Terminal

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected: localhost:27017
🚀 Server running on port 5000
```

### Step 2: Keep Frontend Running

**Terminal 2 - Frontend (already running):**
```bash
cd client
npm run dev
```

## 🔍 Verify Backend is Running

1. **Check server console** - Should show:
   ```
   ✅ MongoDB connected
   🚀 Server running on port 5000
   ```

2. **Test in browser:**
   - Open: `http://localhost:5000/api/health`
   - Should return: `{"status":"ok",...}`

3. **If MongoDB error:**
   - Make sure MongoDB is running
   - Or use MongoDB Atlas (cloud)

## 📝 Complete Setup

### Terminal 1 - Backend:
```bash
cd "C:\Users\shubham uprade\OneDrive\Desktop\BPL Project\server"
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd "C:\Users\shubham uprade\OneDrive\Desktop\BPL Project\client"
npm run dev
```

## ⚠️ Common Issues

### Issue 1: MongoDB Not Connected
**Solution:**
- Install MongoDB locally, OR
- Use MongoDB Atlas (free cloud)
- Update `server/.env` with connection string

### Issue 2: Port 5000 Already in Use
**Solution:**
- Change port in `server/.env`: `PORT=5001`
- Update Vite proxy: `target: 'http://localhost:5001'`

### Issue 3: Backend Crashes
**Solution:**
- Check server console for errors
- Make sure `.env` file exists in `server/` folder
- Verify MongoDB connection string

## ✅ After Backend Starts

Once backend is running, the frontend will automatically connect and the error will disappear!

**Test:**
1. Backend running ✅
2. Frontend running ✅
3. Try signup/login - should work now!

