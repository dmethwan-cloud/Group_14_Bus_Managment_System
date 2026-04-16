import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password2: '',
    role: 'passenger', // Default role; operators/conductors must be approved by admin later
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (formData.password !== formData.password2) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register/', formData);
      setSuccessMsg(response.data.message || 'Registration successful! Proceeding to verification...');
      setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`), 3500);
    } catch (err) {
      if (err.response && err.response.data) {
         // Naive extraction of first error message
         const errorList = Object.values(err.response.data).flat();
         setError(errorList[0] || 'Registration failed.');
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
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Join the Smart Bus E-Ticketing System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {successMsg}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="input-label">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="input-label">Email Address</label>
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
              <label htmlFor="role" className="input-label">Account Type</label>
              <select
                id="role"
                name="role"
                className="input-field"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="passenger">Passenger</option>
                <option value="operator">Bus Operator</option>
                <option value="conductor">Conductor</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Bus Operators and Conductors require Admin approval.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="input-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password2" className="input-label">Confirm</label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password2}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || successMsg}
              className="btn-primary w-full flex justify-center py-3 text-lg"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
