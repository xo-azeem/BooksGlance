# Secure Upload Setup Guide

## Overview
This guide explains how to secure the upload endpoint so only admins can upload files.

## Security Architecture

1. **API Key** stored in Netlify (not visible to public)
2. **PHP Endpoint** validates the API key
3. **Client** sends API key with each upload request
4. **Only authorized requests** are processed

## Step 1: Generate a Strong API Key

Generate a secure random string for your API key. You can use:
- Online generator: https://randomkeygen.com/
- Or use this format: `BOOKSGLANCE_UPLOAD_SECRET_2024_` + random string

**Example API Key:**
```
BOOKSGLANCE_UPLOAD_SECRET_2024_a7f3k9m2p5q8w1x4z6
```

**Important:** Make it long and random! At least 32 characters.

## Step 2: Update PHP File on Hostinger

1. **Log in to Hostinger File Manager**
   - Go to your Hostinger hPanel
   - Navigate to **File Manager**
   - Go to `public_html` folder

2. **Edit `uploads.php`**
   - Find the line: `$requiredApiKey = "BOOKSGLANCE_UPLOAD_SECRET_2024";`
   - Replace with your generated API key:
     ```php
     $requiredApiKey = "YOUR_GENERATED_API_KEY_HERE";
     ```
   - **Save the file**

## Step 3: Add API Key to Netlify

1. **Go to Netlify Dashboard**
   - Visit [https://app.netlify.com](https://app.netlify.com)
   - Log in and select your site

2. **Navigate to Environment Variables**
   - Click **Site configuration** (or **Site settings**)
   - Click **Environment variables** in the left sidebar

3. **Add the API Key Variable**
   - Click **Add variable**
   - **Key**: `VITE_UPLOAD_API_KEY`
   - **Value**: Your generated API key (same as in PHP file)
   - **Check "Secret" checkbox** ✅ (IMPORTANT!)
   - Click **Save**

4. **Verify the Variable**
   - Make sure it shows as `VITE_UPLOAD_API_KEY` with masked value
   - The value should match exactly what you put in `uploads.php`

## Step 4: Redeploy Your Site

**Critical:** After adding the environment variable, you MUST redeploy:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete

## Step 5: Test the Upload

1. Go to your admin portal (`/admin`)
2. Try uploading a book image
3. It should work if the API keys match
4. If you get "Unauthorized" error, check:
   - API keys match exactly in both places
   - You redeployed after adding the variable
   - No extra spaces in the API key

## Security Checklist

- [ ] Generated a strong, random API key (32+ characters)
- [ ] Updated `uploads.php` with the API key on Hostinger
- [ ] Added `VITE_UPLOAD_API_KEY` to Netlify (marked as Secret)
- [ ] Verified API keys match exactly in both places
- [ ] Redeployed the site after adding the variable
- [ ] Tested upload functionality

## How It Works

1. **Admin opens admin portal** → Client code loads
2. **Admin uploads image** → Client gets API key from Netlify env variable
3. **Request sent to PHP** → Includes API key in the request
4. **PHP validates key** → Compares with stored key
5. **If valid** → File uploaded
6. **If invalid** → Returns 401 Unauthorized error

## Important Security Notes

### ✅ What's Protected
- API key is stored in Netlify (server-side, not in client bundle)
- PHP endpoint validates every request
- Invalid requests are rejected immediately

### ⚠️ What's Still Public
- The PHP endpoint URL is public (but protected by API key)
- Anyone can see the endpoint exists, but can't use it without the key

### 🔒 Additional Security (Optional)

If you want even more security, you can:

1. **Restrict by IP** (in `uploads.php`):
   ```php
   $allowedIPs = ['your.ip.address.here'];
   if (!in_array($_SERVER['REMOTE_ADDR'], $allowedIPs)) {
       http_response_code(403);
       echo json_encode(["error" => "Forbidden: IP not allowed"]);
       exit;
   }
   ```

2. **Add rate limiting** to prevent abuse

3. **Use HTTPS only** (already enforced)

## Troubleshooting

### "Upload API key is not configured"
- **Solution**: Add `VITE_UPLOAD_API_KEY` to Netlify environment variables
- **Solution**: Redeploy after adding the variable

### "Unauthorized: Invalid or missing API key"
- **Check**: API keys match exactly in PHP file and Netlify
- **Check**: No extra spaces or quotes
- **Check**: You redeployed after adding the variable

### Upload works but shows error
- **Check**: Browser console for detailed error
- **Check**: PHP file permissions (should be 644)
- **Check**: `uploads/` folder permissions (should be 755)

## Quick Reference

**Netlify Variable:**
```
VITE_UPLOAD_API_KEY = your-secret-api-key-here
```

**PHP File Location:**
```
Hostinger: public_html/uploads.php
```

**PHP Variable:**
```php
$requiredApiKey = "your-secret-api-key-here";
```

**Both must match exactly!**

