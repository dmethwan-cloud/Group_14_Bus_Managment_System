import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ConductorPassengers = () => {
    const [trips, setTrips] = useState([]);
    const [allPassengers, setAllPassengers] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loadingPassengers, setLoadingPassengers] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            setLoadingTrips(true);
            const res = await axiosInstance.get('/bookings/conductor/trips/');
            setTrips(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to load trips');
        } finally {
            setLoadingTrips(false);
        }
    };

    useEffect(() => {
        const fetchAllPassengers = async () => {
            if (trips.length === 0) return;

            setLoadingPassengers(true);
            try {
                const passengersData = [];
                for (const trip of trips) {
                    const res = await axiosInstance.get(`/bookings/conductor/trips/${trip.id}/bookings/`);
                    const passengers = res.data.results || res.data;
                    passengersData.push(...passengers.map(p => ({
                        ...p,
                        tripId: trip.id,
                        tripInfo: trip
                    })));
                }
                setAllPassengers(passengersData);
            } catch (err) {
                console.error('Failed to load passengers');
            } finally {
                setLoadingPassengers(false);
            }
        };

        fetchAllPassengers();
    }, [trips]);

    const formatTime = (t) => {
        if (!t) return '--';
        const [h, m] = t.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    const filteredPassengers = allPassengers
        .filter(p => {
            const matchesSearch = !searchQuery ||
                p.purchase_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.user_detail?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.user_detail?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tripInfo?.route_detail?.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTrip = !selectedTrip || p.tripId === selectedTrip;

            return matchesSearch && matchesTrip;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.user_detail?.full_name.localeCompare(b.user_detail?.full_name);
            } else if (sortBy === 'date') {
                return new Date(b.tripInfo?.date) - new Date(a.tripInfo?.date);
            } else if (sortBy === 'seats') {
                return b.seat_count - a.seat_count;
            }
            return 0;
        });

    return (
        <>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                .font-custom-conductor {
                  font-family: 'Plus Jakarta Sans', sans-serif;
                }
              `}
            </style>
        <div className="space-y-6 max-w-7xl mx-auto font-custom-conductor">
            <div className="bg-gradient-to-r from-blue-500/90 to-cyan-600/90 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-blue-400/20">
                <h2 className="text-3xl font-bold mb-2">👥 All Passengers</h2>
                <p className="text-blue-100">View all passengers across your assigned trips</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Total Trips</p>
                    <p className="text-3xl font-bold text-slate-800">{trips.length}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Total Passengers</p>
                    <p className="text-3xl font-bold text-blue-600">{allPassengers.length}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Total Seats Booked</p>
                    <p className="text-3xl font-bold text-purple-600">
                        {allPassengers.reduce((sum, p) => sum + p.seat_count, 0)}
                    </p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600">
                        LKR {allPassengers.reduce((sum, p) => sum + parseFloat(p.total_fare || 0), 0).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">🔍 Search Passengers</label>
                    <input
                        type="text"
                        placeholder="Search by Purchase ID, Name, Email, or Route..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">🚌 Filter by Trip</label>
                        <select
                            value={selectedTrip || ''}
                            onChange={(e) => setSelectedTrip(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-4 py-3 border border-slate-200/60 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="">All Trips</option>
                            {trips.map(trip => (
                                <option key={trip.id} value={trip.id}>
                                    {trip.route_detail?.name} • {trip.date}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">📊 Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200/60 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="date">Latest Trips First</option>
                            <option value="name">Passenger Name (A-Z)</option>
                            <option value="seats">Most Seats</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Passengers List */}
            {loadingTrips || loadingPassengers ? (
                <div className="text-center p-12 text-slate-200">Loading passengers...</div>
            ) : filteredPassengers.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xl p-12 rounded-2xl shadow-xl border border-white/40 text-center">
                    <p className="text-5xl mb-3">🪑</p>
                    <p className="text-slate-800 font-bold text-lg">No passengers found.</p>
                    {searchQuery && <p className="text-slate-600 text-sm mt-1">Try adjusting your search criteria.</p>}
                </div>
            ) : (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/40 border-b border-white/40">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Purchase ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Passenger Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Route</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Seats</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Fare (LKR)</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/50">
                                {filteredPassengers.map(p => (
                                    <tr key={p.id} className="hover:bg-white/60 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{p.purchase_id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{p.user_detail?.full_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{p.user_detail?.email}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-700">{p.tripInfo?.route_detail?.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {p.tripInfo?.date} • {formatTime(p.tripInfo?.departure_time)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700 text-center">{p.seat_count}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">LKR {parseFloat(p.total_fare).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-lg border inline-block ${p.payment_status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {(p.payment_status || 'pending').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default ConductorPassengers;