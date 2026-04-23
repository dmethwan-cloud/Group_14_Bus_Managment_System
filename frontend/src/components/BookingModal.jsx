import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const BookingModal = ({ assignment, onClose, onSuccess }) => {
  const [seatCount, setSeatCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const farePerSeat = assignment.bus_detail?.is_ac 
    ? parseFloat(assignment.route_detail?.fare_ac || 0)
    : parseFloat(assignment.route_detail?.fare_non_ac || 0);
  const totalFare = farePerSeat * seatCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (seatCount < 1 || seatCount > assignment.available_seats) {
      setError(`Please select between 1 and ${assignment.available_seats} seats.`);
      return;
    }
    if (paymentMethod === 'online' && (!paymentReference || !paymentProof)) {
      setError('Reference number and payment proof are required for online payment.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('bus_assignment', assignment.id);
      formData.append('seat_count', seatCount);
      formData.append('payment_method', paymentMethod);
      
      if (paymentMethod === 'online') {
        formData.append('payment_reference', paymentReference);
        formData.append('payment_proof', paymentProof);
      }

      const res = await axiosInstance.post('/bookings/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'object') {
        setError(Object.values(msg).flat().join(' '));
      } else {
        setError('Failed to book tickets. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Book Tickets</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Trip Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm space-y-1">
            <p><span className="font-semibold text-slate-500">Route:</span> {assignment.route_detail?.name}</p>
            <p><span className="font-semibold text-slate-500">Bus:</span> {assignment.bus_detail?.bus_number} ({assignment.bus_detail?.is_ac ? 'AC' : 'Non-AC'})</p>
            <p><span className="font-semibold text-slate-500">Date & Time:</span> {assignment.date} at {assignment.departure_time}</p>
          </div>

          {/* Seat Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Seats (Max: {assignment.available_seats})</label>
            <input 
              type="number" 
              min="1" 
              max={assignment.available_seats} 
              value={seatCount}
              onChange={(e) => setSeatCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              required
            />
          </div>

          {/* Total Fare */}
          <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <span className="font-semibold text-emerald-800">Total Fare:</span>
            <span className="text-xl font-bold text-emerald-700">LKR {totalFare.toFixed(2)}</span>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input type="radio" name="payment" value="cash" className="hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                💵 Pay Cash
              </label>
              <label className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input type="radio" name="payment" value="online" className="hidden" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                💳 Online Payment
              </label>
            </div>
          </div>

          {/* Online Payment Details */}
          {paymentMethod === 'online' && (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reference / Transaction Number</label>
                <input 
                  type="text" 
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  placeholder="e.g. TR-123456789"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Payment Proof</label>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.pdf,.gif,.webp"
                  onChange={(e) => setPaymentProof(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Max size: 5MB. Formats: JPG, PNG, PDF, WEBP.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
