# Fix 500 Error - Courses Endpoint

## Problem
Getting 500 Internal Server Error when fetching courses.

## Possible Causes

1. **MongoDB not connected** - Most common issue
2. **No courses in database** - Database is empty
3. **Database connection string wrong**

## Solutions

### Solution 1: Check MongoDB Connection

**Check if MongoDB is running:**
```bash
# Windows
# Check if MongoDB service is running in Services

# Or try to connect:
mongosh
# or
mongo
```

**If MongoDB is not installed/running:**
- Install MongoDB locally, OR
- Use MongoDB Atlas (cloud)

### Solution 2: Seed the Database

If MongoDB is connected but database is empty, seed courses:

```bash
cd server
npm run seed
```

This will create sample courses in the database.

### Solution 3: Check .env File

Make sure `server/.env` has correct MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/babua-lms
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/babua-lms
```

### Solution 4: Test Database Connection

1. Check server console - should see:
   ```
   ✅ MongoDB connected: localhost:27017
   ```

2. If you see error:
   ```
   ❌ MongoDB connection error: ...
   ```
   Then MongoDB is not connected.

## Quick Fix Steps

1. **Start MongoDB:**
   ```bash
   # Windows - Start MongoDB service
   # Or use MongoDB Atlas
   ```

2. **Check server logs:**
   - Look for "✅ MongoDB connected" message
   - If not, MongoDB is not running

3. **Seed database:**
   ```bash
   cd server
   npm run seed
   ```

4. **Restart server:**
   ```bash
   cd server
   npm run dev
   ```

5. **Test API:**
   - Open: `http://localhost:5000/api/courses`
   - Should return: `{"courses": [...]}`

## Improved Error Handling

I've updated the code to:
- ✅ Check MongoDB connection before querying
- ✅ Return better error messages
- ✅ Handle empty database gracefully
- ✅ Show connection status

## Status Check

After fixes, you should see:
- ✅ Server console: "✅ MongoDB connected"
- ✅ API returns: `{"courses": [...]}` (even if empty array)
- ✅ No 500 errors

---

**Note:** If you don't have MongoDB installed, you can use MongoDB Atlas (free tier) for development.

