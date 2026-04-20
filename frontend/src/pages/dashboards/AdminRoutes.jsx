import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({
    origin: '', destination: '', fare_ac: '', fare_non_ac: ''
  });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/routes/');
      setRoutes(res.data.results || res.data);
    } catch {
      setError('Failed to load routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.origin.trim() || !form.destination.trim()) {
      setError('From and To fields are required.'); return;
    }
    if (form.origin.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError('Origin and destination cannot be the same.'); return;
    }
    setSubmitting(true);
    try {
      if (editingRoute) {
        await axiosInstance.put(`/routes/${editingRoute.id}/`, form);
        setSuccess('Route updated successfully!');
      } else {
        await axiosInstance.post('/routes/', form);
        setSuccess('Route added successfully!');
      }
      setForm({ origin: '', destination: '', fare_ac: '', fare_non_ac: '' });
      setEditingRoute(null);
      fetchRoutes();
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to save route.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setForm({
      origin: route.origin,
      destination: route.destination,
      fare_ac: route.fare_ac,
      fare_non_ac: route.fare_non_ac,
    });
    setError(''); setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await axiosInstance.delete(`/routes/${id}/`);
      setSuccess('Route deleted.');
      fetchRoutes();
    } catch {
      setError('Failed to delete route.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRoute(null);
    setForm({ origin: '', destination: '', fare_ac: '', fare_non_ac: '' });
    setError(''); setSuccess('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-1">🗺️ Routes Management</h2>
        <p className="text-violet-100 opacity-90">Define bus routes and set fare rates for AC & Non-AC buses.</p>
      </div>

      {/* Add / Edit Route Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {editingRoute ? (
            <><span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm">✏️</span> Edit Route</>
          ) : (
            <><span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm">+</span> Add New Route</>
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📍 From (Origin)
              </label>
              <input
                type="text"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="e.g. Makumbura"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🏁 To (Destination)
              </label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Galle"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ❄️ Fare — AC (LKR per passenger)
              </label>
              <input
                type="number"
                name="fare_ac"
                value={form.fare_ac}
                onChange={handleChange}
                placeholder="e.g. 450.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🌡️ Fare — Non-AC (LKR per passenger)
              </label>
              <input
                type="number"
                name="fare_non_ac"
                value={form.fare_non_ac}
                onChange={handleChange}
                placeholder="e.g. 320.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-800 bg-slate-50 transition-all"
                required
              />
            </div>
          </div>

          {/* Route Name Preview */}
          {form.origin && form.destination && (
            <div className="mb-6 px-4 py-3 bg-violet-50 rounded-xl border border-violet-100">
              <p className="text-sm text-violet-700">
                <span className="font-semibold">Route name will be:</span>{' '}
                <span className="font-bold">{form.origin} to {form.destination}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {submitting ? 'Saving...' : editingRoute ? 'Update Route' : 'Add Route'}
            </button>
            {editingRoute && (
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

      {/* Routes List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">📋 All Routes</h3>
          <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full">
            {routes.length} route{routes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="text-slate-500 font-medium">No routes added yet.</p>
            <p className="text-slate-400 text-sm mt-1">Use the form above to add your first route.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Route Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">AC Fare</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Non-AC Fare</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{route.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">{route.origin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md">{route.destination}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">LKR {parseFloat(route.fare_ac).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">LKR {parseFloat(route.fare_non_ac).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
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

export default AdminRoutes;
