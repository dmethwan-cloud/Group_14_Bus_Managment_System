import React from 'react';
import { getUser } from '../../utils/auth';

const AdminDashboard = () => {
  const user = getUser();
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="gradient-bg p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}! 👋</h2>
        <p className="text-primary-100 opacity-90">Here's an overview of the system today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
          <p className="text-4xl font-bold text-slate-800">248</p>
        </div>
        <div className="card border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Operators</p>
          <p className="text-4xl font-bold text-slate-800">12</p>
        </div>
        <div className="card border-l-4 border-l-purple-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Buses</p>
          <p className="text-4xl font-bold text-slate-800">45</p>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold border-b border-slate-100 pb-4 mb-4">Recent Bookings</h3>
        <p className="text-slate-500 text-sm">Booking list component will be implemented here by team.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
