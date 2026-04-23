import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const user = getUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOperators: 0,
    activeBuses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch total users and active operators
        const usersRes = await axiosInstance.get('/auth/users/');
        const users = usersRes.data.results || usersRes.data;
        const totalUsers = users.length;
        const activeOperators = users.filter(u => u.role === 'operator' && u.is_active).length;

        // Fetch active buses (all approved buses)
        const busesRes = await axiosInstance.get('/buses/');
        const buses = busesRes.data.results || busesRes.data;
        const activeBuses = buses.length;

        setStats({
          totalUsers,
          activeOperators,
          activeBuses,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        // Set default stats if fetch fails
        setStats({
          totalUsers: 0,
          activeOperators: 0,
          activeBuses: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="gradient-bg p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}! 👋</h2>
        <p className="text-primary-100 opacity-90">Here's an overview of the system today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
          <p className="text-4xl font-bold text-slate-800">{loading ? '...' : stats.totalUsers}</p>
        </div>
        <div className="card border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Operators</p>
          <p className="text-4xl font-bold text-slate-800">{loading ? '...' : stats.activeOperators}</p>
        </div>
        <div className="card border-l-4 border-l-purple-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Buses</p>
          <p className="text-4xl font-bold text-slate-800">{loading ? '...' : stats.activeBuses}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;