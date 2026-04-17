import React from 'react';
import { getUser } from '../../utils/auth';

const OperatorDashboard = () => {
  const user = getUser();
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.full_name?.split(' ')[0] || 'Operator'}! 🚌</h2>
        <p className="text-blue-100">Manage your fleet and track performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center hover:-translate-y-1 transition-transform border-t-4 border-t-indigo-500">
          <p className="text-sm font-medium text-slate-500 mb-1">My Fleet</p>
          <p className="text-4xl font-bold text-indigo-600 mb-2">5</p>
          <p className="text-xs text-slate-400">Total Buses</p>
        </div>
        <div className="card text-center hover:-translate-y-1 transition-transform border-t-4 border-t-teal-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Assigned Conductors</p>
          <p className="text-4xl font-bold text-teal-600 mb-2">8</p>
          <p className="text-xs text-slate-400">Active Staff</p>
        </div>
        <div className="card text-center hover:-translate-y-1 transition-transform border-t-4 border-t-orange-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Today's Revenue</p>
          <p className="text-4xl font-bold text-orange-600 mb-2">45k</p>
          <p className="text-xs text-slate-400">LKR</p>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Fleet Status</h3>
        <p className="text-slate-500 text-sm">Bus management list will go here.</p>
      </div>
    </div>
  );
};

export default OperatorDashboard;
