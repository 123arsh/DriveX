# DriveX Authentication - Quick Reference & Deployment Checklist

## 🔴 Critical Issue Summary

### The Main Problem
Admin authentication was failing with "Network Error" because:
- **Frontend URL**: `https://drivex07.onrender.com/secure-admin-panel/api`
- **Backend expects**: `/api/secure-admin-panel`
- Result: Requests hitting wrong endpoint (404 error)

### The Fix
Changed admin frontend URL structure to match backend:
- **New Frontend URL**: `https://drivex07.onrender.com/api/secure-admin-panel` ✅

---

## 📋 Pre-Deployment Checklist

### Render Backend Dashboard
- [ ] Go to `https://dashboard.render.com`
- [ ] Select `drivex-backend` service
- [ ] Check **Environment** tab has these variables set:
  - [ ] `MONGODB_URI` = `mongodb+srv://rental:rental%40123R@cluster0.ijcuubw.mongodb.net/?appName=Cluster0`
  - [ ] `JWT_SECRET` = (your secret hash)
  - [ ] `JWT_REFRESH_SECRET` = (your secret hash)
  - [ ] `NODE_ENV` = `production`
  - [ ] `ADMIN_EMAILS` = `thearsh7973@gmail.com`
- [ ] Click **Deploy** (or wait for auto-deploy from GitHub push)
- [ ] Monitor logs for errors

### Vercel Frontend Dashboard
- [ ] Go to `https://vercel.com`
- [ ] Select `drive-x-frontend` project
- [ ] Check **Settings** → **Environment Variables**:
  - [ ] `VITE_API_URL` = `https://drivex07.onrender.com/api`
  - [ ] `VITE_RAZORPAY_KEY_ID` = (test key)
- [ ] Redeploy if needed
- [ ] Wait for deployment to complete

### Vercel Admin Dashboard
- [ ] Go to `https://vercel.com`
- [ ] Select `drive-x-admin` project
- [ ] Check **Settings** → **Environment Variables**:
  - [ ] `VITE_ADMIN_API_URL` = `https://drivex07.onrender.com/api/secure-admin-panel` ✅ **FIXED**
- [ ] Redeploy if needed
- [ ] Wait for deployment to complete

---

## 🧪 Testing After Deployment

### 1. Test User Authentication
```
1. Go to https://drive-x-frontend-*.vercel.app
2. Click "Create account"
3. Fill in: First Name, Last Name, Email, Mobile, Password
4. Click "Create Account"
5. Expected: Should redirect to /booking with token stored in localStorage
```

**Verify in Browser DevTools:**
- [ ] Console shows no errors
- [ ] localStorage has `drivex-access-token` and `drivex-user`
- [ ] API request to `/api/auth/signup` successful (200 or 201)

### 2. Test User Login
```
1. Go to https://drive-x-frontend-*.vercel.app
2. Enter email and password from previous signup
3. Click "Sign In"
4. Expected: Should redirect to /booking with token
```

**Verify:**
- [ ] API request to `/api/auth/login` successful (200)
- [ ] localStorage updated with new token

### 3. Test Admin OTP Request
```
1. Go to https://drive-x-admin-*.vercel.app
2. Enter email: thearsh7973@gmail.com
3. Click "Request OTP"
4. Expected: Success message shown
```

**Verify:**
- [ ] No errors in console
- [ ] API request to `/api/secure-admin-panel/auth/login` successful (200)
- [ ] In Render logs, you see OTP code generated

### 4. Test Admin OTP Verify
```
1. After OTP request, check Render logs for OTP code
2. Enter OTP code from logs
3. Click "Verify OTP"
4. Expected: Should redirect to /dashboard with admin token
```

**Verify:**
- [ ] API request to `/api/secure-admin-panel/auth/verify` successful (200)
- [ ] localStorage has `drivex-admin-token` and `drivex-admin-user`

### 5. Test Error Handling
- [ ] Invalid credentials → Shows "Invalid credentials"
- [ ] Non-existent email → Shows "Invalid credentials"
- [ ] Wrong OTP → Shows "OTP invalid"
- [ ] Server down → Shows "Endpoint not found. Server may be unavailable."
- [ ] CORS blocked → Shows "CORS error: Request blocked by server"

---

## 🌐 API Endpoint Reference

### User Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/signup` | POST | Create new user account |
| `/api/auth/login` | POST | Login with email/password |
| `/api/auth/refresh` | POST | Get new access token using refresh token |

### Admin Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/secure-admin-panel/auth/login` | POST | Request OTP for admin |
| `/api/secure-admin-panel/auth/verify` | POST | Verify OTP and get admin token |
| `/api/secure-admin-panel/dashboard` | GET | Get admin dashboard data (requires auth) |

### Health Check
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/` | GET | Check if API is running |

---

## 🔍 Common Issues & Solutions

### Issue: "Network Error: Unable to reach the server"
**Causes (in order of likelihood):**
1. Backend not deployed/running on Render
2. MONGODB_URI not set in Render environment
3. Database connection failed
4. Frontend VITE_API_URL is incorrect

**Fix:**
- Check Render logs: `https://dashboard.render.com/services/drivex-backend`
- Verify MongoDB URI is correct
- Verify frontend VITE_API_URL matches

### Issue: "Endpoint not found. Server may be unavailable."
**Cause:** Backend API path is wrong (404 error)

**Fix:**
- User routes: `/api/auth/signup` (not `/auth/signup`)
- Admin routes: `/api/secure-admin-panel/auth/login` (not `/secure-admin-panel/api/auth/login`)

### Issue: Admin OTP page shows error immediately
**Causes:**
1. `VITE_ADMIN_API_URL` not set in Vercel
2. `VITE_ADMIN_API_URL` has wrong path
3. CORS blocking the request

**Fix:**
- Check Vercel admin project settings
- Verify URL is `https://drivex07.onrender.com/api/secure-admin-panel`
- Check browser DevTools Network tab for blocked request

### Issue: Request timeout after 30 seconds
**Cause:** Render server is starting up (cold start) or is down

**Fix:**
- This is normal on first request
- Check Render logs for errors
- If persistent, check database connection

---

## 📝 Files Changed

| File | Change |
|------|--------|
| `admin/.env` | Fixed admin API URL path ✅ |
| `admin/.env.example` | Updated example ✅ |
| `admin/vercel.json` | Fixed Vercel config ✅ |
| `frontend/src/services/api.js` | Enhanced error handling & timeout |
| `admin/src/services/adminApi.js` | Enhanced error handling & timeout |
| `backend/src/app.js` | Enhanced CORS config |
| `backend/src/server.js` | Improved logging |
| `backend/src/config/db.js` | Better error logging |
| `backend/src/middlewares/errorHandler.js` | Enhanced error responses |

---

## 🚀 Deployment Steps

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: Authentication API URL path and deployment config"
   git push origin main
   ```

2. **Wait for auto-deployment:**
   - Render backend: ~2-5 minutes
   - Vercel frontend: ~1-2 minutes
   - Vercel admin: ~1-2 minutes

3. **Monitor logs:**
   - Render: https://dashboard.render.com
   - Vercel: https://vercel.com/dashboard

4. **Test after deployment completes**

---

## 📞 Support

If issues persist:

1. **Check Render logs:** https://dashboard.render.com/services/drivex-backend
2. **Check Vercel logs:** https://vercel.com/dashboard
3. **Check browser DevTools:** Network tab for API requests
4. **Verify environment variables** are set on both platforms
5. **Check MongoDB connection** in Render logs

---

**Last Updated:** 2026-06-04  
**Status:** ✅ Ready for Deployment
