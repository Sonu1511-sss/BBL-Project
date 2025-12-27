# 🚀 Backend Server Start Guide

## ❌ Error: `ECONNREFUSED`

Yeh error tab aata hai jab **backend server nahi chal raha** ho.

## ✅ Solution: Backend Server Start Karein

### Step 1: Backend Directory Mein Jao

```bash
cd server
```

### Step 2: Dependencies Check Karein

```bash
npm install
```

### Step 3: MongoDB Start Karein

**Option A: Local MongoDB**
```bash
# Windows (if MongoDB is installed as service, it should auto-start)
# Check if running:
Get-Service MongoDB

# If not running, start it:
Start-Service MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- `.env` file mein `MONGODB_URI` set karein
- Example: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/babua-lms`

### Step 4: Backend Server Start Karein

```bash
npm run dev
```

Ya production mode mein:
```bash
npm start
```

### Step 5: Verify Server Running

Browser mein open karein:
- `http://localhost:5000/api/health`
- Ya `http://127.0.0.1:5000/api/health`

Agar response aaye:
```json
{
  "status": "ok",
  "message": "Babua LMS API is running"
}
```

Toh server **successfully running** hai! ✅

## 📋 Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## 🔍 Troubleshooting

### Port 5000 Already in Use?

Agar port 5000 already use ho raha hai:

1. **Different port use karein:**
   - `server/.env` file mein add karein:
     ```env
     PORT=5001
     ```
   - `client/vite.config.ts` mein update karein:
     ```typescript
     target: 'http://localhost:5001'
     ```

2. **Ya existing process kill karein:**
   ```bash
   # Find process on port 5000
   netstat -ano | findstr :5000
   
   # Kill process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

### MongoDB Connection Error?

1. **Local MongoDB:**
   - MongoDB service check karein
   - Default connection: `mongodb://localhost:27017/babua-lms`

2. **MongoDB Atlas:**
   - Connection string verify karein
   - Network access allow karein (0.0.0.0/0 for development)

### Still Getting ECONNREFUSED?

1. ✅ Backend server running hai? (Check terminal)
2. ✅ Port 5000 correct hai? (Check `server/index.js`)
3. ✅ Vite proxy config correct hai? (Check `client/vite.config.ts`)
4. ✅ No firewall blocking? (Windows Firewall check karein)

## 📝 Expected Output

**Backend Terminal:**
```
✅ MongoDB connected: localhost
🚀 Server running on port 5000
```

**Frontend Terminal:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
```

---

**Status**: Backend server start karne ke baad sab errors fix ho jayenge! 🎉
