import React from 'react';

const PassengerDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Search for a Bus</h2>
      
      <div className="card bg-white p-8">
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
        <button className="btn-primary mt-6 w-full md:w-auto">Search Buses</button>
      </div>

      <h3 className="text-xl font-bold mt-8 text-slate-800">Your Upcoming Trips</h3>
      <div className="card">
        <p className="text-slate-500 text-sm">You have no upcoming trips. Ticket component will be rendered here.</p>
      </div>
    </div>
  );
};

export default PassengerDashboard;
