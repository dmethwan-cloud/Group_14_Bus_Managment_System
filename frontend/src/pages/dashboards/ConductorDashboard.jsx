import React from 'react';
import { getUser } from '../../utils/auth';

const ConductorDashboard = () => {
  const user = getUser();
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome aboard, {user?.full_name?.split(' ')[0] || 'Conductor'}! 🎫</h2>
        <p className="text-amber-100">Ready for today's journey? Here's your schedule.</p>
      </div>

      <div className="card glass-card hover:-translate-y-1 transition-transform border-t-4 border-t-amber-500 mt-[-2rem] relative z-10 mx-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Colombo to Galle</h3>
            <p className="text-slate-500 text-lg font-medium mt-1">Bus: WP-ND 4567 • Express Route</p>
          </div>
          <span className="badge badge-yellow text-sm py-1.5 px-4 mt-4 md:mt-0 font-bold border border-yellow-200">
            Departing in 2H
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-50 p-4 rounded-xl text-center">
            <p className="text-sm text-slate-500">Seats Reserved</p>
            <p className="text-2xl font-bold text-slate-800">42/50</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-center">
            <p className="text-sm text-slate-500">Tickets Scanned</p>
            <p className="text-2xl font-bold text-amber-600">0</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
          <button className="btn-primary w-full sm:flex-1 bg-amber-600 hover:bg-amber-700 py-3 text-lg rounded-xl shadow-md">
            Scan QR Tickets
          </button>
          <button className="btn-secondary w-full sm:flex-1 py-3 text-lg rounded-xl">
            View Passenger List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConductorDashboard;
