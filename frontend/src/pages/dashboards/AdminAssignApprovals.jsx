import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400', label: '⏳ Pending' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: '✅ Approved' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400', label: '❌ Rejected' },
};

const AdminAssignApprovals = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const res = await axiosInstance.get('/buses/assignments/all/');
      setAssignments(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setError('Failed to load assignment requests.');
      setAssignments([]); // Reset assignments on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id + newStatus);
    try {
      await axiosInstance.patch(`/buses/assignments/${id}/status/`, { status: newStatus });
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);

  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    approved: assignments.filter(a => a.status === 'approved').length,
    rejected: assignments.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-1">🔍 Bus Assignment Approvals</h2>
        <p className="text-indigo-100 opacity-90">Review and approve or reject bus scheduling requests from operators.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[['all', '📋 All'], ['pending', '⏳ Pending'], ['approved', '✅ Approved'], ['rejected', '❌ Rejected']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
          >
            {label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading assignments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-slate-500 font-medium">No {filter !== 'all' ? filter : ''} assignments found.</p>
          </div>
        ) : (
          filtered.map((assignment) => {
            const sc = STATUS_COLORS[assignment.status] || STATUS_COLORS.pending;
            return (
              <div key={assignment.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Bus + Route Info */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-lg font-bold text-slate-800">
                          🚌 {assignment.bus_detail?.bus_number} — {assignment.bus_detail?.bus_name}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${assignment.bus_detail?.is_ac
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-orange-50 text-orange-700'
                          }`}>
                          {assignment.bus_detail?.is_ac ? '❄️ AC' : '🌡️ Non-AC'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Route */}
                      <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Route</span>
                          <p className="font-semibold text-slate-800 mt-0.5">
                            📍 {assignment.route_detail?.origin} → {assignment.route_detail?.destination}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Date</span>
                          <p className="font-semibold text-slate-800 mt-0.5">📅 {assignment.date}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Departure</span>
                          <p className="font-semibold text-slate-800 mt-0.5">🕐 {assignment.departure_time}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Arrival</span>
                          <p className="font-semibold text-slate-800 mt-0.5">🕑 {assignment.arrival_time}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Seats</span>
                          <p className="font-semibold text-slate-800 mt-0.5">💺 {assignment.bus_detail?.num_seats}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Operator</span>
                          <p className="font-semibold text-slate-800 mt-0.5">👤 {assignment.operator_name}</p>
                        </div>
                      </div>

                      {assignment.reviewed_by_name && (
                        <p className="mt-3 text-xs text-slate-400">
                          Reviewed by <span className="font-semibold text-slate-500">{assignment.reviewed_by_name}</span>
                          {assignment.reviewed_at ? ` on ${new Date(assignment.reviewed_at).toLocaleDateString()}` : ''}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[110px]">
                      {assignment.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(assignment.id, 'approved')}
                          disabled={actionLoading === assignment.id + 'approved'}
                          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm"
                        >
                          {actionLoading === assignment.id + 'approved' ? '...' : '✅ Approve'}
                        </button>
                      )}
                      {assignment.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(assignment.id, 'rejected')}
                          disabled={actionLoading === assignment.id + 'rejected'}
                          className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm"
                        >
                          {actionLoading === assignment.id + 'rejected' ? '...' : '❌ Reject'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminAssignApprovals;