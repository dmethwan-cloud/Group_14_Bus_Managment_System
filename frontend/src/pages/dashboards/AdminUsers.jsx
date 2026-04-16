import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/auth/users/');
      // Django REST Framework pagination returns an object with a 'results' array
      if (response.data && response.data.results) {
        setUsers(response.data.results);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await axiosInstance.delete(`/auth/users/${userId}/`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      alert('Error deleting user. Please try again.');
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user for system access?')) return;
    try {
      await axiosInstance.patch(`/auth/users/${userId}/`, { is_active: true });
      setUsers((prev) => prev.map((user) => user.id === userId ? { ...user, is_active: true } : user));
    } catch (err) {
      alert('Error approving user. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Users</h2>
          <p className="text-sm text-slate-500 mt-1">Review, approve, and manage system users.</p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-semibold">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{user.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'operator' ? 'bg-indigo-100 text-indigo-800' :
                      user.role === 'conductor' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 ${user.is_verified ? 'text-green-600' : 'text-slate-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                        {user.is_verified ? 'Verified Email' : 'Pending OTP'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 ${user.is_active ? 'text-blue-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                        {user.is_active ? 'Active' : 'Unapproved'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {!user.is_active && user.is_verified && (user.role === 'operator' || user.role === 'conductor') && (
                        <button 
                          onClick={() => handleApprove(user.id)}
                          className="text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? "Cannot delete other admins" : "Delete user"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
