import React from 'react';

const ConductorDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Today's Schedule</h2>
      <div className="card border-t-4 border-t-yellow-500">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Colombo to Galle</h3>
            <p className="text-slate-600 font-medium">Bus: WP-ND 4567</p>
          </div>
          <span className="badge badge-yellow text-sm py-1 px-3">Departing in 2H</span>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
          <button className="btn-primary flex-1">View Passengers</button>
          <button className="btn-secondary flex-1">Scan Tickets</button>
        </div>
      </div>
    </div>
  );
};

export default ConductorDashboard;
