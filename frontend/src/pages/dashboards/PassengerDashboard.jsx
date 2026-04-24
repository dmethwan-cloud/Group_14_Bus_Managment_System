import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import axiosInstance from '../../api/axiosInstance';
import BookingModal from '../../components/BookingModal';

const PassengerDashboard = () => {
  const user = getUser();
  const [routes, setRoutes] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  // Bookings state
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch routes and bookings
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axiosInstance.get('/routes/');
        const data = res.data.results || res.data;
        setRoutes(data);
        // Build unique origins + destinations
        const uniqueOrigins = [...new Set(data.map(r => r.origin))].sort();
        const uniqueDestinations = [...new Set(data.map(r => r.destination))].sort();
        setOrigins(uniqueOrigins);
        setDestinations(uniqueDestinations);
      } catch {
        // silently fail — search won't work but layout still renders
      } finally {
        setLoadingRoutes(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get('/bookings/');
        setBookings(res.data.results || res.data);
      } catch {
        console.error('Failed to load bookings');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchRoutes();
    fetchBookings();
  }, []);

  // Filter destinations based on selected origin
  const availableDestinations = from
    ? routes.filter(r => r.origin === from).map(r => r.destination)
    : destinations;

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    setTo(''); // reset destination on origin change
    setResults([]); setSearched(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to) return;
    setSearching(true);
    setSearched(false);
    setResults([]);
    try {
      const params = new URLSearchParams({ from, to });
      if (date) params.append('date', date);
      const res = await axiosInstance.get(`/buses/search/?${params}`);
      setResults(res.data.results || res.data);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setSearching(false);
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

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          .font-custom-passenger {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}
      </style>
      <div className="space-y-6 max-w-5xl mx-auto font-custom-passenger">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-emerald-400/20">
        <h2 className="text-3xl font-bold mb-1">Hello, {user?.full_name?.split(' ')[0] || 'Traveler'}! 🚍</h2>
        <p className="text-emerald-100">Search available buses and plan your journey.</p>
      </div>

      {/* Search Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-9 h-9 bg-emerald-100/80 text-emerald-700 rounded-xl flex items-center justify-center shadow-sm">🔍</span>
          Search for a Bus
        </h3>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* From */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">📍 From</label>
              <select
                value={from}
                onChange={handleFromChange}
                className="w-full px-4 py-3 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-800 bg-white/70 backdrop-blur-sm transition-all"
                required
                disabled={loadingRoutes}
              >
                <option value="">{loadingRoutes ? 'Loading...' : '-- Select Origin --'}</option>
                {origins.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">🏁 To</label>
              <select
                value={to}
                onChange={(e) => { setTo(e.target.value); setResults([]); setSearched(false); }}
                className="w-full px-4 py-3 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-800 bg-white/70 backdrop-blur-sm transition-all"
                required
                disabled={!from || loadingRoutes}
              >
                <option value="">{!from ? '-- Select origin first --' : '-- Select Destination --'}</option>
                {availableDestinations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">📅 Date (Optional)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-800 bg-white/70 backdrop-blur-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={searching || !from || !to}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {searching ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Searching...</>
            ) : (
              <>🔍 Search Buses</>
            )}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {(searched || searching) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">
              {searching ? 'Searching...' : `Available Buses ${from && to ? `— ${from} to ${to}` : ''}`}
            </h3>
            {!searching && searched && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                {results.length} bus{results.length !== 1 ? 'es' : ''} found
              </span>
            )}
          </div>

          {searching ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl border border-white/40">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-700 font-medium">Finding available buses...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl border border-white/40">
              <p className="text-5xl mb-4">🚌</p>
              <p className="text-slate-800 font-bold text-lg">No buses available</p>
              <p className="text-slate-600 text-sm mt-2">
                No approved buses found for <strong>{from} → {to}</strong>
                {date ? ` on ${date}` : ''}. Try a different date or route.
              </p>
            </div>
          ) : (
            results.map((bus) => (
              <div
                key={bus.id}
                className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
              >
                {/* Bus Card Header */}
                <div className={`px-6 py-3 flex items-center gap-3 ${bus.bus_detail?.is_ac ? 'bg-blue-600' : 'bg-orange-500'}`}>
                  <span className="text-white font-bold text-lg">🚌</span>
                  <span className="text-white font-bold">{bus.bus_detail?.bus_number}</span>
                  <span className="text-white/80 text-sm">—</span>
                  <span className="text-white font-medium">{bus.bus_detail?.bus_name}</span>
                  <span className="ml-auto px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                    {bus.bus_detail?.is_ac ? '❄️ AC' : '🌡️ Non-AC'}
                  </span>
                </div>

                {/* Bus Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Route */}
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Route</p>
                      <p className="font-semibold text-slate-800 text-sm">
                        {bus.route_detail?.origin}
                        <span className="text-slate-400 mx-1">→</span>
                        {bus.route_detail?.destination}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Date</p>
                      <p className="font-semibold text-slate-800 text-sm">📅 {bus.date}</p>
                    </div>

                    {/* Times */}
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Departure</p>
                      <p className="font-bold text-emerald-700 text-sm">🕐 {formatTime(bus.departure_time)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Arrival</p>
                      <p className="font-bold text-blue-700 text-sm">🕑 {formatTime(bus.arrival_time)}</p>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">💺 Available Seats:</span>
                        <span className="font-bold text-slate-800 text-lg">{bus.available_seats}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">{bus.bus_detail?.is_ac ? '❄️ AC Fare:' : '🌡️ Non-AC Fare:'}</span>
                        <span className="font-bold text-emerald-700">
                          LKR {bus.bus_detail?.is_ac
                            ? parseFloat(bus.route_detail?.fare_ac || 0).toFixed(2)
                            : parseFloat(bus.route_detail?.fare_non_ac || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBus(bus)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Upcoming Trips */}
      {!searched && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden">
          <div className="px-8 py-5 border-b border-white/30 flex items-center justify-between bg-white/40">
            <h3 className="text-lg font-bold text-slate-800">🗓️ Your Upcoming Trips</h3>
          </div>

          {loadingBookings ? (
            <div className="p-8 text-center text-slate-500">Loading trips...</div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-5xl mb-3">🎟️</p>
              <p className="text-slate-500 font-medium">No upcoming trips yet.</p>
              <p className="text-slate-400 text-sm mt-1">Search for a bus above to book your first trip!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/50">
              {bookings.map((b) => (
                <div key={b.id} className="p-6 hover:bg-white/60 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-slate-800 text-lg">
                          {b.bus_assignment_detail?.route_detail?.name}
                        </span>
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${b.payment_status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            b.payment_status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                          {(b.payment_status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mb-1">
                        🚌 {b.bus_assignment_detail?.bus_detail?.bus_number}
                        ({b.bus_assignment_detail?.bus_detail?.is_ac ? 'AC' : 'Non-AC'})
                      </p>
                      <p className="text-sm text-slate-500">
                        📅 {b.bus_assignment_detail?.date} • {formatTime(b.bus_assignment_detail?.departure_time)}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Purchase ID</p>
                      <p className="font-mono font-bold text-slate-700 mb-2">{b.purchase_id}</p>
                      <p className="text-sm">
                        <span className="font-semibold text-slate-600">{b.seat_count} Seats</span> •
                        <span className="font-bold text-emerald-600 ml-1">LKR {b.total_fare}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedBus && (
        <BookingModal
          assignment={selectedBus}
          onClose={() => setSelectedBus(null)}
          onSuccess={(newBooking) => {
            setSelectedBus(null);
            setBookings([newBooking, ...bookings]);
            setSearched(false); // Reset to show bookings view
            setFrom(''); setTo(''); // Reset search
            alert(`Booking successful! Your Purchase ID is ${newBooking.purchase_id}`);
          }}
        />
      )}
    </div>
    </>
  );
};

export default PassengerDashboard;