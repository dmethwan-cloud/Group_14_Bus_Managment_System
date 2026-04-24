import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { getUser } from '../../utils/auth';

const PassengerBookings = () => {
    const user = getUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('reserved');
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/bookings/');
            setBookings(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to load bookings:', err.response?.data || err.message);
            setBookings([]);
        } finally {
            setLoading(false);
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

    const filteredBookings = bookings
        .filter(b => {
            const matchesSearch = !searchQuery ||
                b.purchase_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.bus_assignment_detail?.route_detail?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.bus_assignment_detail?.bus_detail?.bus_number.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesStatus = false;
            if (filterStatus === 'reserved') {
                // Reserved: Cash payments only
                matchesStatus = b.payment_method === 'cash';
            } else if (filterStatus === 'purchased') {
                // Purchased Tickets: Online payments that are accepted
                matchesStatus = b.payment_method === 'online' && b.payment_status === 'accepted';
            } else if (filterStatus === 'pending') {
                // Pending: Online payments not yet verified
                matchesStatus = b.payment_method === 'online' && b.payment_status === 'pending';
            } else if (filterStatus === 'failed') {
                // Failed: Online payments rejected
                matchesStatus = b.payment_method === 'online' && b.payment_status === 'failed';
            }

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return '✓';
            case 'pending':
                return '⏳';
            case 'failed':
                return '✕';
            default:
                return '?';
        }
    };

    if (selectedBooking) {
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
              <div className="space-y-6 max-w-4xl mx-auto font-custom-passenger">
                <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-2 mb-4"
                >
                    ← Back to Bookings
                </button>

                {/* Booking Header */}
                <div className="bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-emerald-400/20">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Booking Details</h2>
                            <p className="text-emerald-100">Purchase ID: <span className="font-mono font-bold">{selectedBooking.purchase_id}</span></p>
                        </div>
                        <span className={`px-4 py-2 rounded-lg font-bold border ${getStatusColor(selectedBooking.payment_status)}`}>
                            {getStatusIcon(selectedBooking.payment_status)} {(selectedBooking.payment_status || 'pending').toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Trip Details Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">🚌 Trip Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Route</p>
                            <p className="text-xl font-bold text-slate-800 mt-1">{selectedBooking.bus_assignment_detail?.route_detail?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Bus</p>
                            <p className="text-xl font-bold text-slate-800 mt-1">
                                {selectedBooking.bus_assignment_detail?.bus_detail?.bus_number}
                                <span className="text-sm text-slate-500 ml-2">
                                    ({selectedBooking.bus_assignment_detail?.bus_detail?.is_ac ? 'AC' : 'Non-AC'})
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Date</p>
                            <p className="text-xl font-bold text-slate-800 mt-1">📅 {selectedBooking.bus_assignment_detail?.date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Departure Time</p>
                            <p className="text-xl font-bold text-slate-800 mt-1">🕐 {formatTime(selectedBooking.bus_assignment_detail?.departure_time)}</p>
                        </div>
                    </div>
                </div>

                {/* Booking Details Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">🎫 Booking Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/50 backdrop-blur-sm border border-white/40 p-4 rounded-xl shadow-sm">
                            <p className="text-sm text-slate-600 font-semibold uppercase tracking-widest">Seats Booked</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-2">{selectedBooking.seat_count}</p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm border border-white/40 p-4 rounded-xl shadow-sm">
                            <p className="text-sm text-slate-600 font-semibold uppercase tracking-widest">Total Fare</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">LKR {parseFloat(selectedBooking.total_fare).toFixed(2)}</p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm border border-white/40 p-4 rounded-xl shadow-sm">
                            <p className="text-sm text-slate-600 font-semibold uppercase tracking-widest">Payment Method</p>
                            <p className="text-2xl font-bold text-slate-800 mt-2 capitalize">
                                {selectedBooking.payment_method === 'cash' ? '💵 Cash' : '💳 Online'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">💰 Payment Information</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Status</p>
                            <p className={`mt-1 inline-block px-3 py-1 rounded-lg font-bold text-sm border ${getStatusColor(selectedBooking.payment_status)}`}>
                                {(selectedBooking.payment_status || 'pending').toUpperCase()}
                            </p>
                        </div>
                        {selectedBooking.payment_method === 'online' && selectedBooking.payment_reference && (
                            <div>
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Transaction Reference</p>
                                <p className="font-mono font-bold text-slate-700 mt-1">{selectedBooking.payment_reference}</p>
                            </div>
                        )}
                        {selectedBooking.payment_proof && (
                            <div>
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Payment Proof</p>
                                <a
                                    href={selectedBooking.payment_proof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700 font-bold mt-1 inline-block"
                                >
                                    📄 View Proof →
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Dates */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">📅 Timeline</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <p className="text-slate-500 font-semibold">Booked On</p>
                            <p className="font-bold text-slate-700">{new Date(selectedBooking.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-slate-500 font-semibold">Last Updated</p>
                            <p className="font-bold text-slate-700">{new Date(selectedBooking.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }

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
            <div className="space-y-6 max-w-6xl mx-auto font-custom-passenger">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-emerald-400/20">
                <h2 className="text-3xl font-bold mb-2">My Bookings</h2>
                <p className="text-emerald-100">Track and manage all your ticket reservations</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Total Bookings</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{bookings.length}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Confirmed</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">
                        {bookings.filter(b => b.payment_status === 'accepted').length}
                    </p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">
                        {bookings.filter(b => b.payment_status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/40 text-center">
                    <p className="text-sm text-slate-500">Total Spent</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        LKR {bookings.reduce((sum, b) => sum + parseFloat(b.total_fare || 0), 0).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">🔍 Search Bookings</label>
                    <input
                        type="text"
                        placeholder="Search by Purchase ID, Route, or Bus Number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">🏷️ Filter by Status</label>
                    <div className="flex gap-3 flex-wrap">
                        {['reserved', 'purchased', 'pending', 'failed'].map(status => {
                            const labels = {
                                reserved: '💳 Reserved',
                                purchased: '✓ Purchased Tickets',
                                pending: '⏳ Pending Verification',
                                failed: '✕ Failed'
                            };
                            return (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-all ${filterStatus === status
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-white/60 backdrop-blur-sm border border-white/50 text-slate-700 hover:bg-white/90 shadow-sm'
                                        }`}
                                >
                                    {labels[status]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="text-center p-12 text-slate-500">Loading your bookings...</div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xl p-12 rounded-2xl shadow-xl border border-white/40 text-center">
                    <p className="text-5xl mb-3">🎫</p>
                    <p className="text-slate-500 font-medium">No bookings found.</p>
                    {searchQuery && <p className="text-slate-400 text-sm mt-1">Try adjusting your search.</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map(booking => (
                        <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className="bg-white/90 backdrop-blur-xl p-6 rounded-xl border border-white/40 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{booking.bus_assignment_detail?.route_detail?.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${getStatusColor(booking.payment_status)}`}>
                                            {(booking.payment_status || 'pending').toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 mb-2">
                                        🚌 {booking.bus_assignment_detail?.bus_detail?.bus_number} •
                                        📅 {booking.bus_assignment_detail?.date} •
                                        🕐 {formatTime(booking.bus_assignment_detail?.departure_time)}
                                    </p>
                                    <p className="text-sm text-slate-400 font-mono">PUR: {booking.purchase_id}</p>
                                </div>

                                <div className="flex flex-col md:text-right gap-2">
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Seats</p>
                                        <p className="text-2xl font-bold text-slate-800">{booking.seat_count}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Total</p>
                                        <p className="text-2xl font-bold text-emerald-600">LKR {parseFloat(booking.total_fare).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default PassengerBookings;