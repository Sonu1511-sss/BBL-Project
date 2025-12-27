# 🔐 Google OAuth Setup Guide

## ✅ Implementation Complete

Google OAuth has been added to both frontend and backend!

## 📋 Setup Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
7. Authorized redirect URIs:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
8. Copy the **Client ID**

### 2. Add Client ID to Frontend

Create `client/.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 3. Install Dependencies

```bash
cd client
npm install
```

This will install `@react-oauth/google` package.

### 4. Backend Configuration (Optional)

If you want to verify tokens on backend, add to `server/.env`:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note:** Current implementation works without backend verification (frontend handles it).

## 🎯 How It Works

1. **User clicks "Continue with Google"**
2. **Google OAuth popup opens**
3. **User authorizes**
4. **Frontend gets access token**
5. **Frontend fetches user info from Google API**
6. **Frontend sends to backend `/api/auth/google`**
7. **Backend creates/updates user and returns JWT**
8. **User is logged in**

## ✅ Features

- ✅ Google login on Login page
- ✅ Google signup on Signup page
- ✅ Automatic account creation if new user
- ✅ Links to existing account if email matches
- ✅ Streak tracking works with Google login
- ✅ Avatar from Google profile

## 🔧 Code Structure

### Frontend
- `client/src/App.tsx` - Wrapped with `GoogleOAuthProvider`
- `client/src/pages/Login.tsx` - Google login button
- `client/src/pages/Signup.tsx` - Google signup button
- `client/src/contexts/AuthContext.tsx` - `loginWithGoogle` function

### Backend
- `server/routes/auth.js` - `/api/auth/google` endpoint
- `server/models/User.js` - Supports `googleId` field

## 🚀 Testing

1. **Set up Google OAuth credentials** (see step 1)
2. **Add Client ID to `client/.env`**
3. **Start frontend**: `cd client && npm run dev`
4. **Start backend**: `cd server && npm run dev`
5. **Test**: Click "Continue with Google" on login/signup page

## ⚠️ Important Notes

1. **Development**: Use `http://localhost:5173` in Google Console
2. **Production**: Update authorized origins/redirects for your domain
3. **Client ID**: Must be set in `.env` file
4. **Backend**: Already supports Google OAuth, no changes needed

## 🐛 Troubleshooting

### "Invalid Client ID"
- Check `VITE_GOOGLE_CLIENT_ID` in `client/.env`
- Verify Client ID in Google Console
- Make sure origins match exactly

### "Redirect URI mismatch"
- Check authorized redirect URIs in Google Console
- Must match exactly: `http://localhost:5173` or `http://127.0.0.1:5173`

### "CORS Error"
- Backend CORS already configured
- Check if backend is running

---

**Status**: ✅ Google OAuth fully integrated and ready to use!

