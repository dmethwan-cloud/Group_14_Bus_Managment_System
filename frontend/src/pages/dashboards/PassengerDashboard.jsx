import React from 'react';
import { getUser } from '../../utils/auth';

const PassengerDashboard = () => {
  const user = getUser();
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Hello, {user?.full_name?.split(' ')[0] || 'Traveler'}! 🚍</h2>
        <p className="text-emerald-100">Where are we heading today?</p>
      </div>

      <div className="card glass-card !p-8 mt-[-2rem] relative z-10 mx-6 shadow-xl border-t-4 border-emerald-500">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Search for a Bus</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="input-label">From</label>
            <input type="text" className="input-field" placeholder="E.g. Colombo" />
          </div>
          <div>
            <label className="input-label">To</label>
            <input type="text" className="input-field" placeholder="E.g. Kandy" />
          </div>
          <div>
            <label className="input-label">Date</label>
            <input type="date" className="input-field" />
          </div>
        </div>
        <button className="btn-primary mt-6 tracking-wide w-full md:w-auto px-8 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500">
          Search Buses
        </button>
      </div>

      <div className="pt-4">
        <h3 className="text-xl font-bold mb-4 text-slate-800">Your Upcoming Trips</h3>
        <div className="card border-l-4 border-slate-300 bg-slate-50">
          <p className="text-slate-500 text-sm">You have no upcoming trips. Ticket component will be rendered here.</p>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
