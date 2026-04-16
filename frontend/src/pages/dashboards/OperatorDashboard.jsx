import React from 'react';

const OperatorDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Operator Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-indigo-500">
          <p className="text-sm font-medium text-slate-500">My Fleet</p>
          <p className="text-3xl font-bold text-slate-800">5 Buses</p>
        </div>
        <div className="card border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-slate-500">Assigned Conductors</p>
          <p className="text-3xl font-bold text-slate-800">8</p>
        </div>
        <div className="card border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
          <p className="text-3xl font-bold text-slate-800">LKR 45,000</p>
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
