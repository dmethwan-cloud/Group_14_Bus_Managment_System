import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import axiosInstance from '../../api/axiosInstance';

const ConductorDashboard = () => {
  const user = getUser();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loadingPassengers, setLoadingPassengers] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axiosInstance.get('/bookings/conductor/trips/');
        setTrips(res.data.results || res.data);
      } catch (err) {
        console.error('Failed to load trips');
      } finally {
        setLoadingTrips(false);
      }
    };
    fetchTrips();
  }, []);

  const handleViewPassengers = async (trip) => {
    setSelectedTrip(trip);
    setLoadingPassengers(true);
    setPassengers([]);
    try {
      const res = await axiosInstance.get(`/bookings/conductor/trips/${trip.id}/bookings/`);
      setPassengers(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load passengers');
    } finally {
      setLoadingPassengers(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return '--';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  if (selectedTrip) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
        <button 
          onClick={() => setSelectedTrip(null)}
          className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-2 mb-4"
        >
          ← Back to Schedule
        </button>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Trip Passenger List</h2>
          <p className="text-slate-500 font-medium">
            🚌 {selectedTrip.bus_detail?.bus_number} — {selectedTrip.route_detail?.name}
          </p>
          <p className="text-slate-500 text-sm">📅 {selectedTrip.date} at {formatTime(selectedTrip.departure_time)}</p>
        </div>

        {loadingPassengers ? (
          <div className="text-center p-12 text-slate-500">Loading passengers...</div>
        ) : passengers.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-5xl mb-3">🪑</p>
            <p className="text-slate-500 font-medium">No bookings for this trip yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Purchase ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Passenger</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Seats</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {passengers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{p.purchase_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{p.user_detail?.full_name}</p>
                      <p className="text-xs text-slate-500">{p.user_detail?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{p.seat_count}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${
                        p.payment_status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {p.payment_status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome aboard, {user?.full_name?.split(' ')[0] || 'Conductor'}! 🎫</h2>
        <p className="text-amber-100">Ready for today's journey? Here's your schedule.</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">🗓️ Your Assigned Trips</h3>
        {loadingTrips ? (
          <div className="text-center p-12 text-slate-500">Loading your schedule...</div>
        ) : trips.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-5xl mb-3">🚌</p>
            <p className="text-slate-500 font-medium">No trips assigned yet.</p>
            <p className="text-slate-400 text-sm mt-1">Check back later or contact your operator.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map(trip => {
              const totalSeats = trip.bus_detail?.num_seats || 0;
              const availableSeats = trip.available_seats || 0;
              const bookedSeats = totalSeats - availableSeats;

              return (
                <div key={trip.id} className="card glass-card hover:-translate-y-1 transition-transform border-t-4 border-t-amber-500 shadow-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{trip.route_detail?.name}</h3>
                      <p className="text-slate-500 text-lg font-medium mt-1">
                        Bus: {trip.bus_detail?.bus_number} • {trip.date} at {formatTime(trip.departure_time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <p className="text-sm text-slate-500">Seats Reserved</p>
                      <p className="text-2xl font-bold text-slate-800">{bookedSeats}/{totalSeats}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => handleViewPassengers(trip)}
                      className="btn-primary w-full sm:flex-1 bg-amber-600 hover:bg-amber-700 py-3 text-lg rounded-xl shadow-md"
                    >
                      View Passenger List
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConductorDashboard;
