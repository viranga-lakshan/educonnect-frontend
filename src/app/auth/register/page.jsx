'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseClient';
import InputField from '@/components/ui/InputField';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

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

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Store additional user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Success - show message and redirect
      setAlert({ 
        type: 'success', 
        message: 'Registration successful! Redirecting...' 
      });

      // Redirect based on role
      setTimeout(() => {
        if (formData.role === 'teacher') {
          router.push('/dashboard/teacher');
        } else {
          router.push('/dashboard/student');
        }
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle Firebase errors
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please login instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      setAlert({ type: 'error', message: errorMessage });
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: '🎓 Student' },
    { value: 'teacher', label: '👨‍🏫 Teacher' },
  ];

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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Alert Message */}
            <AlertMessage
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: '', message: '' })}
            />

            {/* Full Name */}
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="John Doe"
              required
              icon="👤"
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

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
              icon="🔒"
            />

            {/* Role Selection */}
            <SelectDropdown
              label="I am a..."
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              error={errors.role}
              required
              placeholder="Select your role"
            />

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
                disabled
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

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By creating an account, you agree to our community guidelines and user policies.
        </p>
      </div>
    </div>
  );
}
