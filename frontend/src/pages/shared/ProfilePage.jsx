import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { getUser, setUser } from '../../utils/auth';

const ProfilePage = () => {
  const [user, setLocalUser] = useState(getUser());
  const [formData, setFormData] = useState({ full_name: user?.full_name || '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Optionally fetch fresh user data here
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosInstance.patch('/auth/me/', formData);
      const updatedUser = response.data;
      setLocalUser(updatedUser);
      setUser(updatedUser); // Update local storage
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold drop-shadow-sm">My Profile</h2>
        <p className="opacity-80">Manage your account information</p>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div>
              <label className="input-label">Email Address (Read Only)</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input-field bg-slate-100 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="input-label">Account Role</label>
              <div className="pt-2">
                <span className="badge badge-blue capitalize text-sm px-4 py-1">{user.role}</span>
              </div>
            </div>

            <div>
              <label className="input-label">Account Status</label>
              <div className="pt-2">
                {user.is_active ? 
                  <span className="badge badge-green capitalize text-sm px-4 py-1">Active</span> : 
                  <span className="badge badge-red capitalize text-sm px-4 py-1">Inactive</span>
                }
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
