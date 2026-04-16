import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Total Users</p>
          <p className="text-3xl font-bold text-slate-800">248</p>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-slate-500">Active Operators</p>
          <p className="text-3xl font-bold text-slate-800">12</p>
        </div>
        <div className="card border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-slate-500">Active Buses</p>
          <p className="text-3xl font-bold text-slate-800">45</p>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Recent Bookings</h3>
        <p className="text-slate-500 text-sm">Booking list component will be implemented here by team.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
