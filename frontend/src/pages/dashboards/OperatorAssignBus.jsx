import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const STATUS_CONFIG = {
  pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  icon: '⏳', label: 'Pending Review' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✅', label: 'Approved' },
  rejected: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    icon: '❌', label: 'Rejected' },
};

const OperatorAssignBus = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [form, setForm] = useState({
    bus: '', route: '', departure_time: '', arrival_time: '', date: '', conductor: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busRes, routeRes, assignRes, condRes] = await Promise.all([
        axiosInstance.get('/buses/'),
        axiosInstance.get('/routes/'),
        axiosInstance.get('/buses/assignments/'),
        axiosInstance.get('/auth/conductors/'),
      ]);
      setBuses(busRes.data.results || busRes.data);
      setRoutes(routeRes.data.results || routeRes.data);
      setAssignments(assignRes.data.results || assignRes.data);
      setConductors(condRes.data.results || condRes.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bus || !form.route || !form.departure_time || !form.arrival_time || !form.date) {
      setError('All fields are required.'); return;
    }
    setSubmitting(true);
    try {
      if (editingAssignment) {
        await axiosInstance.put(`/buses/assignments/${editingAssignment.id}/`, form);
        setSuccess('Schedule updated! It has been reset to Pending — awaiting admin re-approval.');
      } else {
        await axiosInstance.post('/buses/assignments/', form);
        setSuccess('Assignment submitted! Awaiting admin approval.');
      }
      setForm({ bus: '', route: '', departure_time: '', arrival_time: '', date: '', conductor: '' });
      setEditingAssignment(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setForm({
      bus: assignment.bus,
      route: assignment.route,
      departure_time: assignment.departure_time,
      arrival_time: assignment.arrival_time,
      date: assignment.date,
      conductor: assignment.conductor || '',
    });
    setError(''); setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment request?')) return;
    try {
      await axiosInstance.delete(`/buses/assignments/${id}/`);
      setSuccess('Assignment deleted.');
      fetchData();
    } catch {
      setError('Failed to delete assignment.');
    }
  };

  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setForm({ bus: '', route: '', departure_time: '', arrival_time: '', date: '', conductor: '' });
    setError(''); setSuccess('');
  };

  const selectedBus = buses.find(b => b.id === parseInt(form.bus));
  const selectedRoute = routes.find(r => r.id === parseInt(form.route));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-1">📅 Assign Buses to Routes</h2>
        <p className="text-teal-100 opacity-90">Schedule your buses on routes. Admin approval required before going live.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          {editingAssignment ? (
            <><span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">✏️</span> Edit Schedule</>
          ) : (
            <><span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">+</span> New Assignment</>
          )}
        </h3>

        {editingAssignment && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            ⚠️ <strong>Note:</strong> Editing will reset the status back to <strong>Pending</strong> and require admin re-approval.
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}

        {buses.length === 0 && !loading ? (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
            ℹ️ You need to <strong>add a bus first</strong> before assigning it. Go to the <em>Add Bus</em> tab.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">🚌 Select Bus</label>
                <select
                  name="bus"
                  value={form.bus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                  required
                >
                  <option value="">-- Select your bus --</option>
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.bus_number} — {b.bus_name} ({b.is_ac ? 'AC' : 'Non-AC'}, {b.num_seats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">🗺️ Select Route</label>
                <select
                  name="route"
                  value={form.route}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                  required
                >
                  <option value="">-- Select a route --</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">📅 Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🕐 Departure</label>
                  <input
                    type="time"
                    name="departure_time"
                    value={form.departure_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🕑 Arrival</label>
                  <input
                    type="time"
                    name="arrival_time"
                    value={form.arrival_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">🧑‍✈️ Assign Conductor (Optional)</label>
                <select
                  name="conductor"
                  value={form.conductor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                >
                  <option value="">-- Leave Unassigned --</option>
                  {conductors.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview Card */}
            {selectedBus && selectedRoute && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                <p className="text-sm text-teal-700 font-semibold mb-1">📋 Assignment Preview</p>
                <p className="text-sm text-teal-800">
                  <strong>{selectedBus.bus_number}</strong> ({selectedBus.is_ac ? '❄️ AC' : '🌡️ Non-AC'}) will run on{' '}
                  <strong>{selectedRoute.name}</strong>
                  {form.date && ` on ${form.date}`}
                  {form.departure_time && form.arrival_time && ` from ${form.departure_time} to ${form.arrival_time}`}.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md"
              >
                {submitting ? 'Submitting...' : editingAssignment ? 'Update Schedule' : 'Submit Assignment'}
              </button>
              {editingAssignment && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">📋 My Assignment Requests</h3>
          <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full">
            {assignments.length} request{assignments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-slate-500 font-medium">No assignments submitted yet.</p>
            <p className="text-slate-400 text-sm mt-1">Use the form above to assign a bus to a route.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {assignments.map((assignment) => {
              const sc = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.pending;
              return (
                <div key={assignment.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="font-bold text-slate-800">
                          🚌 {assignment.bus_detail?.bus_number} — {assignment.bus_detail?.bus_name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                          assignment.bus_detail?.is_ac ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {assignment.bus_detail?.is_ac ? '❄️ AC' : '🌡️ Non-AC'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Route</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{assignment.route_detail?.name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Date</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{assignment.date}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Departure</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{assignment.departure_time}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Arrival</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{assignment.arrival_time}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Conductor</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{assignment.conductor_name || 'Unassigned'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
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

export default OperatorAssignBus;
