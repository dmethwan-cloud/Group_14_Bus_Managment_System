import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { setTokens, setUser, getDashboardPath } from '../../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login/', formData);
      const { access, refresh, user } = response.data;

      // Store tokens and user details
      setTokens(access, refresh);
      setUser(user);

      // Redirect based on role
      const redirectPath = getDashboardPath(user.role);
      navigate(redirectPath);
    } catch (err) {
      if (err.response && err.response.data) {
        // Display API errors
        const errorMsg = err.response.data.detail || err.response.data.non_field_errors?.[0] || 'Login failed. Please check your credentials.';
        setError(errorMsg);
      } else {
        setError('A network error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/bus_home_bg.png')" }}
    >
      <div className="absolute inset-0 bg-slate-900/40 z-0 pointer-events-none"></div>
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-100 relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to access the Smart Bus System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="input-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="passenger@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="input-label">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 mb-1.5">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3 text-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;