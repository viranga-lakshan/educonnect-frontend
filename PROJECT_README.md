# 🎓 EduConnect - Registration & Authentication System

A modern, full-featured authentication system for the EduConnect educational platform built with Next.js 16, Firebase, and Tailwind CSS.

## 🚀 Features

### ✅ Authentication System
- **User Registration** with role selection (Student/Teacher)
- **User Login** with email/password
- **Firebase Integration** for secure authentication
- **Firestore Database** for user profiles
- **Form Validation** (client-side)
- **Error Handling** with user-friendly messages
- **Role-Based Routing** (Student Dashboard / Teacher Dashboard)

### 🎨 UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic theme detection
- **Reusable Components** - InputField, Button, SelectDropdown, AlertMessage
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Loading States** - Visual feedback during async operations
- **Success/Error Alerts** - Clear user feedback

### 🔐 Security Features
- **Firebase Authentication** - Industry-standard security
- **Password Validation** - Requires uppercase, lowercase, and numbers
- **Email Validation** - Proper email format checking
- **Terms & Conditions** - User agreement checkbox
- **Secure Password Storage** - Handled by Firebase

---

## 📁 Project Structure

```
educonnect-frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.jsx          # Login page
│   │   │   └── register/
│   │   │       └── page.jsx          # Registration page
│   │   ├── dashboard/
│   │   │   ├── student/
│   │   │   │   └── page.jsx          # Student dashboard
│   │   │   └── teacher/
│   │   │       └── page.jsx          # Teacher dashboard
│   │   ├── layout.jsx                 # Root layout with navbar
│   │   ├── page.jsx                   # Home page
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   ├── ui/
│   │   │   ├── AlertMessage.jsx       # Alert component
│   │   │   ├── Button.jsx             # Button component
│   │   │   ├── InputField.jsx         # Input component
│   │   │   └── SelectDropdown.jsx     # Dropdown component
│   │   └── Navbar.jsx                 # Navigation bar
│   └── lib/
│       └── firebaseClient.js          # Firebase configuration
├── .env.example                        # Environment variables template
├── .env.local                          # Your Firebase credentials (DO NOT COMMIT)
├── FIREBASE_SETUP_GUIDE.md            # Complete Firebase setup instructions
├── package.json
└── README.md
```

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/viranga-lakshan/educonnect-frontend.git
cd educonnect-frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `next` - Next.js framework
- `react` & `react-dom` - React libraries
- `firebase` - Firebase SDK
- `tailwindcss` - CSS framework

### 3. Set Up Firebase

📖 **Follow the complete guide**: [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

**Quick Steps:**

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Web app and get the config
4. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

5. Fill in your Firebase credentials in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. (Optional) Enable Firestore Database for user profiles

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Available Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section |
| `/auth/register` | User registration page |
| `/auth/login` | User login page |
| `/dashboard/student` | Student dashboard (protected) |
| `/dashboard/teacher` | Teacher dashboard (protected) |
| `/courses` | Courses page (coming soon) |
| `/posts` | Blog posts page (coming soon) |
| `/about` | About page (coming soon) |
| `/contact` | Contact page (coming soon) |

---

## 🔥 Firebase Configuration

### Authentication Flow

```
1. User Registration
   ↓
2. Firebase Auth creates user account
   ↓
3. User profile saved to Firestore
   ↓
4. Redirect to appropriate dashboard (student/teacher)
```

### Firestore Structure

```javascript
users (collection)
  └── {userId} (document)
      ├── fullName: string
      ├── email: string
      ├── role: "student" | "teacher"
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

---

## 🎯 Form Validation Rules

### Registration Page

| Field | Validation |
|-------|-----------|
| Full Name | Required, min 3 characters |
| Email | Required, valid email format |
| Password | Required, min 6 characters, must contain uppercase, lowercase, and number |
| Confirm Password | Required, must match password |
| Role | Required, must select student or teacher |
| Terms | Required, must be checked |

### Login Page

| Field | Validation |
|-------|-----------|
| Email | Required, valid email format |
| Password | Required |

---

## 🎨 UI Components

### InputField Component

```jsx
<InputField
  label="Email Address"
  name="email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  placeholder="john@example.com"
  required
  icon="📧"
/>
```

### Button Component

```jsx
<Button
  type="submit"
  variant="primary"
  fullWidth
  loading={loading}
>
  Sign In
</Button>
```

### AlertMessage Component

```jsx
<AlertMessage
  type="success"
  message="Registration successful!"
  onClose={() => setAlert(null)}
/>
```

### SelectDropdown Component

```jsx
<SelectDropdown
  label="Role"
  name="role"
  value={role}
  onChange={handleChange}
  options={[
    { value: 'student', label: '🎓 Student' },
    { value: 'teacher', label: '👨‍🏫 Teacher' }
  ]}
/>
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Firebase errors on page load**
- Make sure `.env.local` file exists with correct values
- Restart the dev server after creating `.env.local`

**2. "Firebase App already exists" error**
- This is handled in `firebaseClient.js`
- Try restarting the dev server

**3. Authentication not working**
- Check Firebase Console → Authentication → Sign-in method
- Ensure Email/Password is enabled

**4. Module not found errors**
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

---

## 📦 Dependencies

### Core Dependencies
- **next**: ^16.1.1 - React framework
- **react**: ^19.2.3 - UI library
- **react-dom**: ^19.2.3 - React DOM renderer
- **firebase**: ^11.1.0 - Firebase SDK

### Dev Dependencies
- **tailwindcss**: ^4 - CSS framework
- **eslint**: ^9 - Code linting
- **@tailwindcss/postcss**: ^4 - PostCSS plugin

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Deploy!

### Other Platforms

- **Netlify**: Similar to Vercel, add env vars in settings
- **AWS Amplify**: Add env vars in console
- **Firebase Hosting**: Add env vars to `.env.production`

---

## 🔮 Future Enhancements

- [ ] Google Sign-In integration
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Profile management page
- [ ] Two-factor authentication
- [ ] Social authentication (Facebook, GitHub)
- [ ] Remember me functionality
- [ ] Session management
- [ ] Protected routes middleware

---

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Viranga Lakshan**
- GitHub: [@viranga-lakshan](https://github.com/viranga-lakshan)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## 📞 Support

If you have any questions or need help:

1. Check the [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
2. Search existing [GitHub Issues](https://github.com/viranga-lakshan/educonnect-frontend/issues)
3. Create a new issue if needed

---

**Made with ❤️ for the EduConnect Platform**
