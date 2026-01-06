# 🔥 Firebase Setup Guide for EduConnect

## Step-by-Step Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: **EduConnect** (or your choice)
4. Disable Google Analytics (optional for now)
5. Click **"Create Project"**
6. Wait for project to be created

---

### Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get Started"**
3. Go to **"Sign-in method"** tab
4. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle **Enable**
   - Click **Save**
5. (Optional for later): Enable Google, Facebook, etc.

---

### Step 3: Register Web App

1. Go to **Project Overview** (home icon)
2. Click the **Web icon** (</>) to add a web app
3. Enter app nickname: **educonnect-frontend**
4. **DO NOT** check "Firebase Hosting" (we're using Vercel/other)
5. Click **"Register app"**
6. Copy the Firebase configuration object (looks like below):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "educonnect-xxxxx.firebaseapp.com",
  projectId: "educonnect-xxxxx",
  storageBucket: "educonnect-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

7. **IMPORTANT**: Save this configuration - you'll need it in Step 5

---

### Step 4: Install Firebase SDK

Open your terminal in the project directory and run:

```bash
npm install firebase
```

This installs the Firebase JavaScript SDK for authentication, Firestore, etc.

---

### Step 5: Create Environment Variables

1. Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

2. Replace the values with your actual Firebase config from Step 3

3. Add `.env.local` to your `.gitignore` (should already be there)

**Why NEXT_PUBLIC_ prefix?**
- Next.js only exposes environment variables to the browser if they start with `NEXT_PUBLIC_`
- Firebase client SDK runs in the browser, so these need to be public

---

### Step 6: Create Firebase Client Configuration

The Firebase client file is already created at `/lib/firebaseClient.js`

This file:
- Initializes Firebase with your config
- Exports the `auth` instance for authentication
- Prevents re-initialization on hot reload

---

### Step 7: (Optional) Enable Firestore Database

If you want to store additional user info (name, role, etc.):

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - Note: Change rules for production later
4. Select a Cloud Firestore location (choose nearest to your users)
5. Click **Enable**

**Firestore Structure Example:**
```
users (collection)
  └── {userId} (document)
      ├── fullName: "John Doe"
      ├── email: "john@example.com"
      ├── role: "student" or "teacher"
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

---

### Step 8: Set Up Firestore Rules (if using Firestore)

Go to **Firestore Database → Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules as needed
  }
}
```

Click **Publish**

---

## ✅ Setup Complete!

Your Firebase is now ready for:
- ✅ User registration with email/password
- ✅ User login
- ✅ Password reset
- ✅ (Optional) Firestore for user profiles

---

## 🚀 Next Steps

1. **Update `.env.local`** with your Firebase credentials
2. **Restart your dev server**: `npm run dev`
3. Test the registration page at: `http://localhost:3000/auth/register`

---

## 🔐 Security Notes

- Never commit `.env.local` to Git
- The `NEXT_PUBLIC_*` variables are safe to expose (they're client-side)
- For production, set these in your hosting platform (Vercel, Netlify, etc.)
- Update Firestore security rules before going to production

---

## 📚 Useful Firebase Documentation

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)

---

## 🐛 Troubleshooting

**Error: "Firebase: Error (auth/api-key-not-valid)"**
- Check your API key in `.env.local`
- Make sure it matches the one from Firebase Console

**Error: "Firebase: Firebase App named '[DEFAULT]' already exists"**
- This is handled in `firebaseClient.js` with the check
- If persists, restart dev server

**Error: "Firebase: Authentication is not enabled"**
- Go to Firebase Console → Authentication → Sign-in method
- Enable Email/Password

---

Need help? Check the Firebase Console for error logs and monitoring.
