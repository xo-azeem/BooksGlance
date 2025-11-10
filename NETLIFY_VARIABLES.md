# Netlify Environment Variables Guide

## Complete List of Required Variables

This document lists all environment variables you need to configure in Netlify for your BooksGlance application.

---

## 🔐 Required Variables

### 1. Firebase Configuration (6 variables)

These are required for Firebase Firestore database operations.

```
VITE_FIREBASE_API_KEY = AIzaSyBBjWoQ2tFLp1MEGp3ZSlu6Jki0ItMM2gY
VITE_FIREBASE_AUTH_DOMAIN = booksglance-358d9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = booksglance-358d9
VITE_FIREBASE_STORAGE_BUCKET = booksglance-358d9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 536756499018
VITE_FIREBASE_APP_ID = 1:536756499018:web:51f73dd923f946e8e8ecb3
```

**Purpose:** Connect your app to Firebase Firestore for storing book data.

**Security:** These are public keys (Firebase is designed this way). Security is handled by Firestore rules.

---

### 2. Upload API Key (1 variable)

This is required for secure file uploads to Hostinger.

```
VITE_UPLOAD_API_KEY = your-secret-api-key-here
```

**Purpose:** Authenticate upload requests to the PHP endpoint on Hostinger.

**Important:** 
- Must match the API key in `uploads.php` on Hostinger
- Use a strong, random string (32+ characters)
- Example: `BOOKSGLANCE_UPLOAD_SECRET_2024_a7f3k9m2p5q8w1x4z6`

**Security:** Mark as "Secret" ✅ - This keeps it hidden in the Netlify UI.

---

## 📋 Complete Variable List (Copy-Paste Ready)

Here's the complete list formatted for easy reference:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBBjWoQ2tFLp1MEGp3ZSlu6Jki0ItMM2gY
VITE_FIREBASE_AUTH_DOMAIN=booksglance-358d9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=booksglance-358d9
VITE_FIREBASE_STORAGE_BUCKET=booksglance-358d9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=536756499018
VITE_FIREBASE_APP_ID=1:536756499018:web:51f73dd923f946e8e8ecb3

# Upload Security
VITE_UPLOAD_API_KEY=your-secret-api-key-here
```

**Total: 7 environment variables**

---

## 🔒 Security Settings

### Mark as Secret ✅
- **VITE_UPLOAD_API_KEY** - Must be marked as Secret (contains sensitive authentication key)

### Can be Public
- **All VITE_FIREBASE_*** variables - These are public by design (Firebase uses security rules, not key secrecy)

---

## 📝 Step-by-Step: Adding Variables in Netlify

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Log in and select your site

2. **Navigate to Environment Variables**
   - Click **Site configuration** (or **Site settings**)
   - Click **Environment variables** in the left sidebar

3. **Add Each Variable**
   For each variable:
   - Click **Add variable**
   - Enter the **Key** (variable name)
   - Enter the **Value** (variable value)
   - **Check "Secret"** for `VITE_UPLOAD_API_KEY` ✅
   - Click **Save**

4. **Add All 7 Variables**
   Add them one by one using the list above.

5. **Verify**
   - Check that all 7 variables are listed
   - `VITE_UPLOAD_API_KEY` should show as masked (****)

6. **Redeploy**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**
   - Wait for deployment to complete

---

## ✅ Verification Checklist

After adding all variables, verify:

- [ ] All 6 Firebase variables are added
- [ ] `VITE_UPLOAD_API_KEY` is added and marked as Secret
- [ ] `VITE_UPLOAD_API_KEY` value matches the key in `uploads.php` on Hostinger
- [ ] All variable names are exactly as shown (case-sensitive)
- [ ] No extra spaces in variable names or values
- [ ] Site has been redeployed after adding variables

---

## 🔍 Variable Details

### Firebase Variables

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `booksglance-358d9.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `booksglance-358d9` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `booksglance-358d9.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `536756499018` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:536756499018:web:...` |

### Upload Security Variable

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_UPLOAD_API_KEY` | API key for upload authentication | `BOOKSGLANCE_UPLOAD_SECRET_2024_...` |

---

## 🚫 Variables NOT Needed

You do **NOT** need these (they were for the old FTP method):

- ~~`HOSTINGER_FTP_HOST`~~ - Not needed (using PHP endpoint)
- ~~`HOSTINGER_FTP_USER`~~ - Not needed (using PHP endpoint)
- ~~`HOSTINGER_FTP_PASSWORD`~~ - Not needed (using PHP endpoint)
- ~~`HOSTINGER_BASE_URL`~~ - Not needed (hardcoded in PHP)
- ~~`HOSTINGER_FTP_PORT`~~ - Not needed (using PHP endpoint)
- ~~`VITE_CLOUDINARY_CLOUD_NAME`~~ - Not needed (switched to Hostinger)
- ~~`VITE_CLOUDINARY_UPLOAD_PRESET`~~ - Not needed (switched to Hostinger)

---

## 🆘 Troubleshooting

### "Upload API key is not configured"
- **Solution**: Add `VITE_UPLOAD_API_KEY` to Netlify
- **Solution**: Redeploy after adding

### "Firebase configuration is missing"
- **Solution**: Add all 6 Firebase variables
- **Solution**: Check for typos in variable names

### Variables not working after adding
- **Solution**: Redeploy your site (variables only load on build)
- **Solution**: Clear cache and redeploy

### API key mismatch error
- **Solution**: Ensure `VITE_UPLOAD_API_KEY` in Netlify matches `$requiredApiKey` in `uploads.php`
- **Solution**: Check for extra spaces or quotes

---

## 📞 Quick Reference

**Total Variables Needed:** 7

**Secret Variables:** 1 (`VITE_UPLOAD_API_KEY`)

**Public Variables:** 6 (all Firebase variables)

**Where to Add:** Netlify Dashboard → Site Settings → Environment Variables

**After Adding:** Must redeploy for changes to take effect

---

## 🔄 Updating Variables

If you need to update a variable:

1. Go to Environment Variables in Netlify
2. Find the variable
3. Click **Edit** (pencil icon)
4. Update the value
5. Click **Save**
6. **Redeploy** your site

---

## 📚 Related Documentation

- `SECURITY_SETUP.md` - Detailed security setup guide
- `NETLIFY_ENV_SETUP.md` - General Netlify environment setup (for FTP method, now deprecated)

---

**Last Updated:** Current setup uses PHP endpoint (no FTP variables needed)

