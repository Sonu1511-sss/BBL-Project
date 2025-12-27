# Admin Route Debugging Guide

## Current Route Setup

✅ Route is defined in `App.tsx`:
```tsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

✅ AdminRoute component checks:
1. User is logged in
2. User role is 'admin'
3. Redirects if not authorized

## Common Issues & Solutions

### Issue 1: Not Logged In
**Symptom:** Redirects to `/login`

**Solution:**
1. Go to `/login`
2. Login with admin credentials:
   - Email: `adminbpl@gmail.com`
   - Password: `Bpl@4321`

### Issue 2: Not Admin User
**Symptom:** Redirects to `/dashboard`

**Solution:**
1. Make sure you're logged in as admin
2. Check user role in browser console:
   ```javascript
   // In browser console
   JSON.parse(localStorage.getItem('token') || '{}')
   // Or check the user object in React DevTools
   ```

### Issue 3: Backend Not Running
**Symptom:** API calls fail, can't fetch user data

**Solution:**
```bash
cd server
npm run dev
```

### Issue 4: Frontend Not Running
**Symptom:** Page doesn't load

**Solution:**
```bash
cd client
npm run dev
```

### Issue 5: Token Expired or Invalid
**Symptom:** User not loading, stuck on loading screen

**Solution:**
1. Clear localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```
2. Login again

## Debugging Steps

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed API calls

2. **Check User Object:**
   ```javascript
   // In browser console after login
   const token = localStorage.getItem('token');
   console.log('Token:', token);
   ```

3. **Check API Response:**
   - Open Network tab in DevTools
   - Look for `/api/auth/me` request
   - Check response - should have `user.role: 'admin'`

4. **Verify Admin User Exists:**
   ```bash
   # In MongoDB or check seed script
   # Admin should be: adminbpl@gmail.com
   ```

## Expected Flow

1. User navigates to `/admin`
2. `AdminRoute` component:
   - Checks if `loading` → Shows spinner
   - Checks if `!user` → Redirects to `/login`
   - Checks if `user.role !== 'admin'` → Redirects to `/dashboard`
   - If all pass → Renders `AdminDashboard`

3. `AdminDashboard` component:
   - Checks user role again (safety)
   - Fetches data based on active tab
   - Renders dashboard

## Quick Test

1. **Login as Admin:**
   ```
   Email: adminbpl@gmail.com
   Password: Bpl@4321
   ```

2. **Navigate to Admin:**
   - Click "Admin" in navbar, OR
   - Go to: `http://localhost:5173/admin`

3. **Expected Result:**
   - Should see admin dashboard
   - Should see tabs: Overview, Courses, Users, Community, Mentors

## If Still Not Working

1. Check browser console for errors
2. Verify backend is running on port 5000 (or configured port)
3. Verify frontend is running on port 5173
4. Check Network tab for API call failures
5. Clear browser cache and localStorage
6. Try incognito/private window

---

**Status:** Route setup is correct. Issue is likely authentication or backend connection.

