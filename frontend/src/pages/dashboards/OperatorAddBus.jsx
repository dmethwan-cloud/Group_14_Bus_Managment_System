import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const OperatorAddBus = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingBus, setEditingBus] = useState(null);
  const [form, setForm] = useState({
    bus_number: '', bus_name: '', num_seats: '', is_ac: false
  });

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/buses/');
      setBuses(res.data.results || res.data);
    } catch {
      setError('Failed to load your buses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBuses(); }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bus_number.trim() || !form.bus_name.trim() || !form.num_seats) {
      setError('All fields are required.'); return;
    }
    setSubmitting(true);
    try {
      if (editingBus) {
        await axiosInstance.put(`/buses/${editingBus.id}/`, form);
        setSuccess('Bus details updated successfully!');
      } else {
        await axiosInstance.post('/buses/', form);
        setSuccess('Bus added successfully!');
      }
      setForm({ bus_number: '', bus_name: '', num_seats: '', is_ac: false });
      setEditingBus(null);
      fetchBuses();
    } catch (err) {
      const data = err.response?.data;
      if (data?.bus_number) setError('Bus number already exists.');
      else if (data?.bus_name) setError('Bus name already exists.');
      else setError(data?.detail || JSON.stringify(data) || 'Failed to save bus.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setForm({
      bus_number: bus.bus_number,
      bus_name: bus.bus_name,
      num_seats: bus.num_seats,
      is_ac: bus.is_ac,
    });
    setError(''); setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bus? This will also remove its assignments.')) return;
    try {
      await axiosInstance.delete(`/buses/${id}/`);
      setSuccess('Bus deleted successfully.');
      fetchBuses();
    } catch {
      setError('Failed to delete bus.');
    }
  };

  const handleCancelEdit = () => {
    setEditingBus(null);
    setForm({ bus_number: '', bus_name: '', num_seats: '', is_ac: false });
    setError(''); setSuccess('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-1">🚌 My Fleet — Add Bus</h2>
        <p className="text-blue-100 opacity-90">Register your buses and manage your fleet details.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {editingBus ? (
            <><span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">✏️</span> Edit Bus Details</>
          ) : (
            <><span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">+</span> Register New Bus</>
          )}
        </h3>

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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bus Number <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="bus_number"
                value={form.bus_number}
                onChange={handleChange}
                placeholder="e.g. WP-AB-1234"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Must be unique across the system.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bus Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="bus_name"
                value={form.bus_name}
                onChange={handleChange}
                placeholder="e.g. Perera Express"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Must be unique across the system.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Seats <span className="text-red-400">*</span></label>
              <input
                type="number"
                name="num_seats"
                value={form.num_seats}
                onChange={handleChange}
                placeholder="e.g. 52"
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bus Type</label>
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_ac: false })}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                    !form.is_ac
                      ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  🌡️ Non-AC
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_ac: true })}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                    form.is_ac
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  ❄️ AC
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md"
            >
              {submitting ? 'Saving...' : editingBus ? 'Update Bus' : 'Add Bus'}
            </button>
            {editingBus && (
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
      </div>

      {/* Bus List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">🚍 My Registered Buses</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
            {buses.length} bus{buses.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading buses...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">🚌</p>
            <p className="text-slate-500 font-medium">No buses registered yet.</p>
            <p className="text-slate-400 text-sm mt-1">Add your first bus using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bus Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bus Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Added</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 font-mono">{bus.bus_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{bus.bus_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">💺 {bus.num_seats}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bus.is_ac ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {bus.is_ac ? '❄️ AC' : '🌡️ Non-AC'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(bus.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(bus)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bus.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorAddBus;
