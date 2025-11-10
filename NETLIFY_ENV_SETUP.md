# Netlify Environment Variables Setup Guide

## Overview
This guide explains how to add environment variables in Netlify for the Hostinger file upload functionality.

## What You Need

For Hostinger file uploads, you need these 4 environment variables:

1. **HOSTINGER_FTP_HOST** - Your Hostinger FTP server address
2. **HOSTINGER_FTP_USER** - Your FTP username
3. **HOSTINGER_FTP_PASSWORD** - Your FTP password
4. **HOSTINGER_BASE_URL** - Your website's public URL
5. **HOSTINGER_FTP_PORT** (Optional) - FTP port (default: 21, use 990 for FTPS)

## Step-by-Step Instructions

### Step 1: Get Your Hostinger FTP Credentials

1. Log in to your **Hostinger Control Panel** (hPanel)
2. Go to **Files** → **FTP Accounts** (or **File Manager**)
3. Find your FTP account details:
   - **FTP Host**: Usually `ftp.yourdomain.com` or an IP address like `185.230.63.107`
   - **FTP Username**: Your FTP username (often your domain name or cPanel username)
   - **FTP Password**: Your FTP password
   - **Port**: Usually `21` for FTP or `990` for FTPS

**Note**: If you don't have an FTP account, create one in Hostinger's FTP Accounts section.

### Step 2: Get Your Base URL

Your base URL is simply your website's domain:
- Example: `https://yourdomain.com`
- Example: `https://www.yourdomain.com`

Make sure to include `https://` and no trailing slash.

### Step 3: Add Variables to Netlify

1. **Go to Netlify Dashboard**
   - Visit [https://app.netlify.com](https://app.netlify.com)
   - Log in to your account

2. **Select Your Site**
   - Click on your site from the dashboard

3. **Navigate to Site Settings**
   - Click on **Site configuration** (or **Site settings**) in the top menu
   - Or click the **Site settings** button

4. **Go to Environment Variables**
   - In the left sidebar, click on **Environment variables**
   - Or go to: **Site configuration** → **Environment variables**

5. **Add Each Variable**
   - Click the **Add variable** button
   - For each variable, enter:
     - **Key**: The variable name (e.g., `HOSTINGER_FTP_HOST`)
     - **Value**: The actual value (e.g., `ftp.yourdomain.com`)
     - **Check the "Secret" checkbox** ✅ (recommended for security)
   - Click **Save**

6. **Repeat for All Variables**
   Add these variables (5th one is optional):
   ```
   HOSTINGER_FTP_HOST = ftp.yourdomain.com
   HOSTINGER_FTP_USER = your_ftp_username
   HOSTINGER_FTP_PASSWORD = your_ftp_password
   HOSTINGER_BASE_URL = https://yourdomain.com
   HOSTINGER_FTP_PORT = 21 (optional, defaults to 21)
   ```

### Step 4: Redeploy Your Site

**Important**: After adding environment variables, you must redeploy for them to take effect.

1. Go to the **Deploys** tab in your Netlify dashboard
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for the deployment to complete

Alternatively, push a new commit to trigger a redeploy.

## Example Configuration

Here's what your Netlify environment variables should look like:

**Example 1: Using IP Address (Your Configuration)**
```
HOSTINGER_FTP_HOST = 45.130.228.117
HOSTINGER_FTP_USER = u378761108
HOSTINGER_FTP_PASSWORD = your_ftp_password_here
HOSTINGER_BASE_URL = https://booksglance.com
HOSTINGER_FTP_PORT = 21
```

**Note**: Remove `ftp://` from the host - use only the IP address or domain name.

**Example 2: Using Domain Name**
```
HOSTINGER_FTP_HOST = ftp.yourdomain.com
HOSTINGER_FTP_USER = username@yourdomain.com
HOSTINGER_FTP_PASSWORD = YourSecurePassword123
HOSTINGER_BASE_URL = https://booksglance.com
HOSTINGER_FTP_PORT = 21
```

**Important Notes:**
- For FTP Host, use **only the IP or domain** (without `ftp://` prefix)
- Port 21 is the default for regular FTP
- Port 990 is for FTPS (secure FTP)

## Important Notes

### Security
- ✅ **Always mark variables as "Secret"** - This hides the values in the Netlify UI
- ✅ **Never commit credentials to Git** - They're already in `.gitignore`
- ✅ **Use strong FTP passwords** - Change them regularly

### FTP Host Formats
Your FTP host might be one of these formats:
- `ftp.yourdomain.com`
- `yourdomain.com`
- An IP address like `185.230.63.107`
- With port: `ftp.yourdomain.com:21`

**Note**: If your FTP host includes a port, you can add it like: `ftp.yourdomain.com:21`

### Testing Your Configuration

After setting up, test by:
1. Going to your admin portal (`/admin`)
2. Try uploading a book with an image
3. Check the browser console for any errors
4. Check Netlify function logs for detailed error messages

## Troubleshooting

### "Server configuration error - FTP credentials not set"
- **Solution**: Make sure all 4 variables are added and marked as Secret
- **Solution**: Redeploy your site after adding variables

### "FTP connection failed"
- **Check**: FTP host is correct (try with/without `ftp.` prefix)
- **Check**: FTP username and password are correct
- **Check**: FTP port (some Hostinger accounts use port 21, others use 990 for FTPS)
- **Check**: Firewall isn't blocking FTP connections

### "Permission denied" or "Directory not found"
- **Check**: The `public_html/uploads` folder exists on Hostinger
- **Check**: FTP user has write permissions to that folder
- **Solution**: Create the `uploads` folder manually via Hostinger File Manager

### Files upload but can't access them
- **Check**: `HOSTINGER_BASE_URL` is correct (should match your actual domain)
- **Check**: Files are in `public_html/uploads` (not just `uploads`)
- **Check**: File permissions are set to `644` or `755` on Hostinger

## How It Works

1. **User uploads image** in admin portal
2. **Client converts** image to base64
3. **Netlify Function** receives the request
4. **Function connects** to Hostinger via FTP using credentials
5. **File is uploaded** to `public_html/uploads/{bookId}.{ext}`
6. **Function returns** the public URL: `https://yourdomain.com/uploads/{bookId}.{ext}`
7. **Book data** is saved to Firebase with the image URL

## Need Help?

If you're still having issues:
1. Check Netlify function logs (Site → Functions → View logs)
2. Check browser console for detailed error messages
3. Verify FTP credentials work by testing with an FTP client (FileZilla, etc.)
4. Ensure the `uploads` folder exists and has proper permissions

