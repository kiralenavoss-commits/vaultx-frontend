import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus, Gift } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill referral code from URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.referralCode
      );
      toast.success('🎉 Welcome to VaultX! Your $5 bonus has been credited!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-black font-black">VX</span>
            </div>
            <span className="text-2xl font-black text-yellow-400">VaultX</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Create Your Account</h1>
          <p className="text-gray-400 text-sm">Join and get a free $5 welcome bonus instantly</p>
        </div>

        {/* Bonus Banner */}
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 mb-6 flex items-center gap-3">
          <Gift className="text-yellow-400 shrink-0" size={20} />
          <p className="text-yellow-400 text-sm font-semibold">
            🎁 Free $5 signup bonus credited instantly to your account!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username <span className="text-yellow-400">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address <span className="text-yellow-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password <span className="text-yellow-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Confirm Password <span className="text-yellow-400">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Referral Code <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Enter referral code"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account & Claim $5
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-gray-600 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Login link */}
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-4">
          <Link to="/" className="text-gray-600 text-sm hover:text-yellow-400 transition">
            ← Back to Home
          </Link>
        </p>

      </div>
    </div>
  );
}