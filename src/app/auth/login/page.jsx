'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,signOut } from 'firebase/auth';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseClient';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';
import SelectDropdown from '@/components/ui/SelectDropdown';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
const [profileLoading, setProfileLoading] = useState(false);
const [profileAlert, setProfileAlert] = useState({ type: '', message: '' });
const [pendingUid, setPendingUid] = useState('');

const [profileData, setProfileData] = useState({
  batch: '',
  contactNo: '',
  email: '',
  fullName: '',
  nic: '',
  role: '',
  stream: '',
});

const [profileErrors, setProfileErrors] = useState({});
const roleOptions = [
  { value: 'student', label: '🎓 Student' },
  { value: 'teacher', label: '👨‍🏫 Teacher' },
];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    // Validate form
    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Please fix the errors above' });
      return;
    }

    setLoading(true);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Success - show message and redirect
        setAlert({ 
          type: 'success', 
          message: 'Login successful! Redirecting...' 
        });

        // Redirect based on role
        setTimeout(() => {
          if (userRole === 'teacher') {
            router.push('/dashboard/teacher');
          } else {
            router.push('/dashboard/student');
          }
        }, 1500);
      } else {
        throw new Error('User profile not found');
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // Handle Firebase errors
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please register first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      setAlert({ type: 'error', message: errorMessage });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () =>{

    setLoading(true);
    setAlert({ type: '', message: '' });
    const provider = new GoogleAuthProvider();
    try{
      const result = await signInWithPopup(auth,provider);
      const user = result.user;

      const token = await user.getIdToken();
      console.log("Google OAuth Token:",token);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => {
          if (userRole === 'teacher') {
            router.push('/dashboard/teacher');
          } else {
            router.push('/dashboard/student');
          }
        }, 1500);
      } else {
        setAlert({ type: 'info', message: 'Welcome! Please complete your profile.' });
      setPendingUid(user.uid);
setProfileData({
  batch: '',
  contactNo: '',
  email: user.email ?? '',
  fullName: user.displayName ?? '',
  nic: '',
  role: '',
  stream: '',
});
setProfileErrors({});
setProfileAlert({ type: 'info', message: 'Welcome! Please complete your profile.' });
setIsProfileModalOpen(true);
setLoading(false);
return;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setAlert({ type: 'error', message: 'Google login failed. Please try again.' });
      setLoading(false);
    }
  }


  //pop up modal starts from here


  const handleProfileChange = (e) => {
  const { name, value } = e.target;
  setProfileData((prev) => ({ ...prev, [name]: value }));
  if (profileErrors[name]) {
    setProfileErrors((prev) => ({ ...prev, [name]: '' }));
  }
};

const validateProfile = () => {
  const next = {};

  if (!profileData.fullName.trim()) next.fullName = 'Full name is required';
  if (!profileData.email.trim()) next.email = 'Email is required';
  if (!profileData.role) next.role = 'Role is required';
  if (!profileData.nic.trim()) next.nic = 'NIC is required';

  if (!profileData.contactNo) {
    next.contactNo = 'Contact number is required';
  } else if (!/^\d+$/.test(String(profileData.contactNo))) {
    next.contactNo = 'Contact number must be digits only';
  }

  if (profileData.role === 'student') {
    if (!profileData.batch.trim()) next.batch = 'Batch is required for students';
    if (!profileData.stream.trim()) next.stream = 'Stream is required for students';
  }

  setProfileErrors(next);
  return Object.keys(next).length === 0;
};

const handleProfileCancel = async () => {
  // optional but recommended: user is signed in already, so sign them out if they cancel
  await signOut(auth);
  setIsProfileModalOpen(false);
  setPendingUid('');
  setProfileAlert({ type: '', message: '' });
  setProfileErrors({});
};

const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setProfileAlert({ type: '', message: '' });

  if (!validateProfile()) {
    setProfileAlert({ type: 'error', message: 'Please fix the errors above.' });
    return;
  }

  setProfileLoading(true);
  try {
    const now = new Date().toISOString();

    await setDoc(
      doc(db, 'users', pendingUid),
      {
        batch: profileData.batch,
        contactNo: Number(profileData.contactNo),
        email: profileData.email,
        fullName: profileData.fullName,
        nic: profileData.nic,
        role: profileData.role,
        stream: profileData.stream,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    setIsProfileModalOpen(false);

    if (profileData.role === 'teacher') router.push('/dashboard/teacher');
    else router.push('/dashboard/student');
  } catch (err) {
    console.error('Profile save error:', err);
    setProfileAlert({ type: 'error', message: err.message || 'Failed to save profile.' });
    setProfileLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              EduConnect
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Alert Message */}
            <AlertMessage
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: '', message: '' })}
            />

            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              required
              icon="📧"
            />

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
              icon="🔒"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Sign-In (Optional - Coming Soon) */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google Sign-In (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Having trouble logging in?{' '}
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Contact Support
          </Link>
        </p>
      </div>
      {isProfileModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-gray-900/50" onClick={handleProfileCancel} />
    <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Complete your profile
      </h3>

      <AlertMessage
        type={profileAlert.type}
        message={profileAlert.message}
        onClose={() => setProfileAlert({ type: '', message: '' })}
      />

      <form onSubmit={handleProfileSubmit} className="space-y-2">
        <InputField
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleProfileChange}
          error={profileErrors.fullName}
          required
          icon="👤"
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={profileData.email}
          onChange={handleProfileChange}
          error={profileErrors.email}
          required
          icon="📧"
        />

        <SelectDropdown
          label="Role"
          name="role"
          value={profileData.role}
          onChange={handleProfileChange}
          options={roleOptions}
          error={profileErrors.role}
          required
          placeholder="Select your role"
        />

        <InputField
          label="NIC"
          name="nic"
          value={profileData.nic}
          onChange={handleProfileChange}
          error={profileErrors.nic}
          required
          icon="🪪"
        />

        <InputField
          label="Contact No"
          name="contactNo"
          type="number"
          value={profileData.contactNo}
          onChange={handleProfileChange}
          error={profileErrors.contactNo}
          required
          icon="📞"
        />

        <InputField
          label="Batch"
          name="batch"
          value={profileData.batch}
          onChange={handleProfileChange}
          error={profileErrors.batch}
          placeholder={profileData.role === 'student' ? 'Required for students' : 'Optional'}
        />

        <InputField
          label="Stream"
          name="stream"
          value={profileData.stream}
          onChange={handleProfileChange}
          error={profileErrors.stream}
          placeholder={profileData.role === 'student' ? 'Required for students' : 'Optional'}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleProfileCancel} fullWidth>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={profileLoading} fullWidth>
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
    
  );
}
