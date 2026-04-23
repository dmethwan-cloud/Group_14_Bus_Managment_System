import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { getUser } from '../../utils/auth';

const OperatorDashboard = () => {
  const user = getUser();
  const [busCount, setBusCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch buses for this operator
        const busRes = await axiosInstance.get('/buses/?mine=1');
        setBusCount(busRes.data.count || busRes.data.length || 0);
      } catch (err) {
        setBusCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.full_name?.split(' ')[0] || 'Operator'}! 🚌</h2>
        <p className="text-blue-100">Manage your fleet and track performance.</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="card text-center hover:-translate-y-1 transition-transform border-t-4 border-t-indigo-500">
          <p className="text-sm font-medium text-slate-500 mb-1">My Fleet</p>
          <p className="text-4xl font-bold text-indigo-600 mb-2">{loading ? '...' : busCount}</p>
          <p className="text-xs text-slate-400">Total Buses</p>
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