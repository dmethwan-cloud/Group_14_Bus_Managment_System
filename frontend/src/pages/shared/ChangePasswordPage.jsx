import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/auth/change-password/', formData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.old_password?.[0] || 
                       err.response?.data?.new_password?.[0] || 
                       'Failed to change password. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Change Password</h2>
        <p className="text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <div className="card">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Current Password</label>
            <input
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="input-label">New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              minLength={8}
              className="input-field"
              placeholder="•••••••• (Min. 8 characters)"
            />
          </div>

          <div>
            <label className="input-label">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
