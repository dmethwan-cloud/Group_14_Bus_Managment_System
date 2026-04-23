import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ConductorPaymentVerification = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [verificationReason, setVerificationReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const fetchPendingBookings = async () => {
        try {
            setLoading(true);
            // Fetch all conductor's trips
            const tripsRes = await axiosInstance.get('/bookings/conductor/trips/');
            const trips = tripsRes.data.results || tripsRes.data;

            // Get bookings for each trip (filter pending by conductor)
            const allBookings = [];
            for (const trip of trips) {
                try {
                    const bookingsRes = await axiosInstance.get(`/bookings/conductor/trips/${trip.id}/bookings/`);
                    const tripBookings = bookingsRes.data.results || bookingsRes.data;

                    // Filter only pending bookings
                    const pendingBookings = tripBookings.filter(b => b.payment_status === 'pending');
                    allBookings.push(...pendingBookings.map(b => ({ ...b, trip_id: trip.id, trip_info: trip })));
                } catch (e) {
                    console.error(`Failed to fetch bookings for trip ${trip.id}:`, e);
                }
            }

            setBookings(allBookings);
        } catch (err) {
            console.error('Failed to load trips:', err);
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

    const handleVerifyPayment = async (approved) => {
        if (!selectedBooking) return;

        if (!approved && !verificationReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                payment_status: approved ? 'accepted' : 'failed',
                ...(approved ? {} : { rejection_reason: verificationReason })
            };

            // Use the conductor payment verification endpoint
            await axiosInstance.patch(`/bookings/verify-payment/${selectedBooking.id}/`, payload);

            // Refresh bookings
            await fetchPendingBookings();
            setSelectedBooking(null);
            setVerificationReason('');

            alert(approved ? 'Payment verified successfully!' : 'Booking rejected');
        } catch (err) {
            console.error('Failed to verify payment:', err);
            alert('Error: ' + (err.response?.data?.detail || err.message || 'Unable to process verification'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredBookings = bookings
        .filter(b => {
            const matchesSearch = !searchQuery ||
                b.purchase_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.passenger_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.passenger_email?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesMethod = filterPaymentMethod === 'all' || b.payment_method === filterPaymentMethod;

            return matchesSearch && matchesMethod;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (selectedBooking) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <button
                    onClick={() => {
                        setSelectedBooking(null);
                        setVerificationReason('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 mb-4"
                >
                    ← Back to Pending Payments
                </button>

                {/* Booking Card */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-8 shadow-lg">
                    {/* Header */}
                    <div className="mb-6 pb-6 border-b-2 border-dashed border-blue-300">
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">💳 Payment Verification</h2>
                        <p className="text-slate-500 font-mono text-sm">
                            Booking ID: <span className="font-bold text-blue-600">{selectedBooking.purchase_id}</span>
                        </p>
                    </div>

                    {/* Passenger Info */}
                    <div className="bg-white rounded-xl p-4 mb-6 border border-blue-200">
                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Passenger</p>
                        <p className="text-lg font-bold text-slate-800">{selectedBooking.passenger_name}</p>
                        <p className="text-sm text-slate-500 font-mono">{selectedBooking.passenger_email}</p>
                    </div>

                    {/* Trip Info */}
                    <div className="bg-white rounded-xl p-6 mb-6 border border-blue-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Trip Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Route</p>
                                <p className="font-bold text-slate-800 mt-1">{selectedBooking.trip_info?.route_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Bus</p>
                                <p className="font-bold text-slate-800 mt-1">{selectedBooking.trip_info?.bus_number}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Date</p>
                                <p className="font-bold text-slate-800 mt-1">{selectedBooking.trip_info?.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Time</p>
                                <p className="font-bold text-slate-800 mt-1">{formatTime(selectedBooking.trip_info?.departure_time)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-white rounded-xl p-6 mb-6 border border-blue-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Booking Details</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Seats</p>
                                <p className="text-2xl font-bold text-slate-800 mt-2">{selectedBooking.seat_count}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Total Fare</p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">LKR {parseFloat(selectedBooking.total_fare).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Created</p>
                                <p className="text-sm font-bold text-slate-800 mt-2">{new Date(selectedBooking.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method & Verification */}
                    {selectedBooking.payment_method === 'cash' ? (
                        // Cash Payment Verification
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-amber-900 mb-4">💵 Cash Payment</h3>
                            <p className="text-amber-800 mb-4">
                                The passenger paid <span className="font-bold text-lg">LKR {parseFloat(selectedBooking.total_fare).toFixed(2)}</span> in cash.
                            </p>
                            <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200">
                                <p className="text-sm text-amber-900 font-semibold mb-2">Have you received the cash payment?</p>
                                <p className="text-sm text-amber-700">Please verify that you have collected the full amount from the passenger.</p>
                            </div>
                        </div>
                    ) : (
                        // Online Payment Verification
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-emerald-900 mb-4">💳 Online Payment Proof</h3>
                            {selectedBooking.payment_reference && (
                                <div className="mb-4">
                                    <p className="text-sm text-emerald-700 font-semibold mb-1">Transaction Reference:</p>
                                    <p className="font-mono bg-white p-2 rounded border border-emerald-200">{selectedBooking.payment_reference}</p>
                                </div>
                            )}
                            {selectedBooking.payment_proof ? (
                                <div className="bg-white rounded-lg p-4 border border-emerald-200 mb-4">
                                    <p className="text-sm text-emerald-900 font-semibold mb-3">Payment Proof Document:</p>
                                    <a
                                        href={selectedBooking.payment_proof}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        📄 View Payment Proof (PDF/Image)
                                    </a>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
                                    ⚠️ No payment proof document uploaded
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rejection Reason */}
                    <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            Rejection Reason (if rejecting):
                        </label>
                        <textarea
                            value={verificationReason}
                            onChange={(e) => setVerificationReason(e.target.value)}
                            placeholder="Enter reason for rejection (e.g., 'Incomplete payment', 'Invalid proof', 'Passenger not present')"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                            rows="3"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleVerifyPayment(true)}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? '⏳ Processing...' : '✓ Approve Payment'}
                        </button>
                        <button
                            onClick={() => handleVerifyPayment(false)}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? '⏳ Processing...' : '✕ Reject Payment'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 rounded-2xl text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">💳 Payment Verification</h2>
                <p className="text-blue-100">Review and verify passenger payments (cash & online)</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{bookings.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Cash</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                        {bookings.filter(b => b.payment_method === 'cash').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Online</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {bookings.filter(b => b.payment_method === 'online').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Total Amount</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        LKR {bookings.reduce((sum, b) => sum + parseFloat(b.total_fare || 0), 0).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">🔍 Search Bookings</label>
                    <input
                        type="text"
                        placeholder="Search by Booking ID, Passenger Name, or Email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">💳 Filter by Payment Method</label>
                    <div className="flex gap-3 flex-wrap">
                        {['all', 'cash', 'online'].map(method => (
                            <button
                                key={method}
                                onClick={() => setFilterPaymentMethod(method)}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${filterPaymentMethod === method
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {method === 'all' ? 'All' : method === 'cash' ? '💵 Cash' : '💳 Online'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="text-center p-12 text-slate-500">Loading pending payments...</div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-5xl mb-3">✓</p>
                    <p className="text-slate-500 font-medium">All payments verified!</p>
                    <p className="text-slate-400 text-sm mt-1">There are no pending payments to review.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map(booking => (
                        <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-800">{booking.passenger_name}</h3>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${booking.payment_method === 'cash'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {booking.payment_method === 'cash' ? '💵 Cash' : '💳 Online'}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-2">
                                        {booking.passenger_email}
                                    </p>
                                    <p className="text-sm text-slate-400 font-mono">PUR: {booking.purchase_id}</p>
                                </div>

                                <div className="flex flex-col md:text-right gap-2">
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">Amount</p>
                                        <p className="text-2xl font-bold text-blue-600">LKR {parseFloat(booking.total_fare).toFixed(2)}</p>
                                    </div>
                                    <p className="text-xs text-slate-400">{new Date(booking.created_at).toLocaleDateString()}</p>
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
    );
};

export default ConductorPaymentVerification;