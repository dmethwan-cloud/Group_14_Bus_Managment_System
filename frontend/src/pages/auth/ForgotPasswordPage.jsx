import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({ otp: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/forgot-password/', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Failed to send OTP. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/auth/reset-password/', { email, ...formData });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.otp?.[0] || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Password Reset!'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {step === 1 && 'Enter your email to receive a 6-digit OTP.'}
            {step === 2 && `We've sent a 6-digit code to ${email}`}
            {step === 3 && 'Your password has been successfully reset.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="input-label">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="input-field"
                placeholder="passenger@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <div className="text-center text-sm">
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Back to Login</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div>
              <label htmlFor="otp" className="input-label">6-Digit OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                className="input-field text-center text-2xl tracking-widest uppercase font-mono"
                placeholder="000000"
                value={formData.otp}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="input-label">New Password</label>
              <input
                name="new_password"
                type="password"
                required
                minLength="8"
                className="input-field"
                placeholder="••••••••"
                value={formData.new_password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="input-label">Confirm Password</label>
              <input
                name="confirm_password"
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <button onClick={() => navigate('/login')} className="btn-primary w-full py-3">
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
