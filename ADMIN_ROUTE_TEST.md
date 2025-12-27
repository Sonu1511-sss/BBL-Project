# Admin Route - Quick Test Guide

## ✅ Route is Correctly Set Up

The route `/admin` is properly configured in `App.tsx` and should work.

## 🔍 Step-by-Step Testing

### Step 1: Verify Backend is Running
```bash
cd server
npm run dev
```
Should see: `🚀 Server running on port 5000`

### Step 2: Verify Frontend is Running
```bash
cd client
npm run dev
```
Should see: `Local: http://localhost:5173`

### Step 3: Login as Admin
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: `adminbpl@gmail.com`
   - Password: `Bpl@4321`
3. Click "Login"

### Step 4: Access Admin Dashboard
**Option A:** Click "Admin" link in navbar (top right)

**Option B:** Go directly to: `http://localhost:5173/admin`

## 🐛 Common Issues

### Issue: Redirects to `/login`
**Cause:** Not logged in
**Fix:** Login first with admin credentials

### Issue: Redirects to `/dashboard`
**Cause:** Logged in but not as admin
**Fix:** 
1. Make sure you logged in with `adminbpl@gmail.com`
2. Check browser console for user role
3. Re-run seed script: `cd server && npm run seed:admin`

### Issue: Blank Page / Loading Forever
**Cause:** Backend not running or API error
**Fix:**
1. Check backend is running
2. Check browser console for errors
3. Check Network tab for failed API calls

### Issue: 404 Not Found
**Cause:** Route not registered
**Fix:** 
- Route is already set up correctly
- Try hard refresh: `Ctrl+Shift+R`

## 🔧 Debug Commands

### Check if Admin User Exists
```bash
# In MongoDB shell or check seed script
# Admin should exist with email: adminbpl@gmail.com
```

### Check Browser Console
```javascript
// Open DevTools (F12) and run:
localStorage.getItem('token')
// Should return a JWT token

// Check user in React DevTools
// User should have: { role: 'admin' }
```

### Check Network Requests
1. Open DevTools → Network tab
2. Navigate to `/admin`
3. Look for `/api/auth/me` request
4. Check response - should have `user.role: 'admin'`

## ✅ Expected Behavior

When you navigate to `/admin` as admin:

1. **AdminRoute checks:**
   - ✅ User is logged in
   - ✅ User role is 'admin'
   - ✅ Renders AdminDashboard

2. **AdminDashboard:**
   - ✅ Shows loading spinner briefly
   - ✅ Fetches statistics and courses
   - ✅ Displays Overview tab with:
     - Statistics cards (Users, Courses, Threads, Bookings)
     - Recent courses grid

3. **Tabs Available:**
   - Overview
   - Courses
   - Users
   - Community
   - Mentors

## 🚨 If Still Not Working

1. **Clear Everything:**
   ```javascript
   // In browser console
   localStorage.clear()
   sessionStorage.clear()
   ```
   Then login again

2. **Check Backend Logs:**
   - Look for errors in server terminal
   - Check if MongoDB is connected

3. **Verify Admin User:**
   ```bash
   cd server
   npm run seed:admin
   ```
   This ensures admin user exists

4. **Try Incognito Window:**
   - Open incognito/private window
   - Login and try `/admin`

---

**The route setup is correct. The issue is likely authentication or backend connection.**

