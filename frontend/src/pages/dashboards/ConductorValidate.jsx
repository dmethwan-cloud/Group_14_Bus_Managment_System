import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ConductorValidate = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loadingPassengers, setLoadingPassengers] = useState(false);
    const [validatedTickets, setValidatedTickets] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSelectTrip = async (trip) => {
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

    const handleValidateTicket = (passengerId) => {
        setValidatedTickets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(passengerId)) {
                newSet.delete(passengerId);
            } else {
                newSet.add(passengerId);
            }
            return newSet;
        });
    };

    const formatTime = (t) => {
        if (!t) return '--';
        const [h, m] = t.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    const filteredPassengers = passengers.filter(p =>
        p.purchase_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user_detail?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user_detail?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!selectedTrip) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-2xl text-white shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">🎫 Ticket Validation</h2>
                    <p className="text-purple-100">Select a trip to validate passenger tickets</p>
                </div>

                {loadingTrips ? (
                    <div className="text-center p-12 text-slate-500">Loading trips...</div>
                ) : trips.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <p className="text-5xl mb-3">🚌</p>
                        <p className="text-slate-500 font-medium">No trips assigned yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {trips.map(trip => {
                            const totalSeats = trip.bus_detail?.num_seats || 0;
                            const availableSeats = trip.available_seats || 0;
                            const bookedSeats = totalSeats - availableSeats;

                            return (
                                <div key={trip.id} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectTrip(trip)}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{trip.route_detail?.name}</h3>
                                            <p className="text-slate-500 mt-1">
                                                🚌 {trip.bus_detail?.bus_number} • {trip.date} at {formatTime(trip.departure_time)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Passengers</p>
                                            <p className="text-2xl font-bold text-purple-600">{bookedSeats}</p>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors">
                                        Open Validation
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <button
                onClick={() => {
                    setSelectedTrip(null);
                    setValidatedTickets(new Set());
                    setSearchQuery('');
                }}
                className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-2"
            >
                ← Back to Trips
            </button>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-1">🎫 Validating Tickets</h2>
                <p className="text-purple-100">
                    {selectedTrip.route_detail?.name} • {selectedTrip.bus_detail?.bus_number} • {selectedTrip.date} at {formatTime(selectedTrip.departure_time)}
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Total Passengers</p>
                    <p className="text-3xl font-bold text-slate-800">{passengers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Validated</p>
                    <p className="text-3xl font-bold text-emerald-600">{validatedTickets.size}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Remaining</p>
                    <p className="text-3xl font-bold text-amber-600">{passengers.length - validatedTickets.size}</p>
                </div>
            </div>

            {/* Search Bar */}
            <div>
                <input
                    type="text"
                    placeholder="🔍 Search by Purchase ID, Name, or Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
            </div>

            {/* Passengers List */}
            {loadingPassengers ? (
                <div className="text-center p-12 text-slate-500">Loading passengers...</div>
            ) : filteredPassengers.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-5xl mb-3">🪑</p>
                    <p className="text-slate-500 font-medium">No passengers found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Purchase ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Passenger</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Seats</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPassengers.map(p => {
                                    const isValidated = validatedTickets.has(p.id);
                                    return (
                                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${isValidated ? 'bg-emerald-50' : ''}`}>
                                            <td className="px-6 py-4 font-mono font-bold text-slate-700">{p.purchase_id}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{p.user_detail?.full_name}</p>
                                                <p className="text-xs text-slate-500">{p.user_detail?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{p.seat_count}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${p.payment_status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {p.payment_status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleValidateTicket(p.id)}
                                                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${isValidated
                                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                                        }`}
                                                >
                                                    {isValidated ? '✓ Validated' : 'Validate'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConductorValidate;