import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract email from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axiosInstance.post('/auth/verify-otp/', { email, otp });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || err.response.data.message || 'Verification failed. Please check your PIN.');
      } else {
        setError('A network error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div>
          <div className="mx-auto w-16 h-16 bg-blue-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Verify your Email
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            We sent a 6-digit PIN to your email address.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
              Email verified successfully! Redirecting to setup your account...
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="input-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field bg-slate-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!new URLSearchParams(location.search).get('email')}
              />
            </div>

            <div>
              <label htmlFor="otp" className="input-label">6-Digit Verification PIN</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only allow numbers
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success || otp.length !== 6 || !email}
              className="btn-primary w-full flex justify-center py-3 text-lg"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-slate-600">
            Didn't receive the PIN?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Try registering again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
