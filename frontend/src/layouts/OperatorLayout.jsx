import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const OperatorLayout = () => {
  const user = getUser();
  const location = useLocation();

  const handleLogout = () => logout();

  const navLinks = [
    { name: 'Dashboard', path: '/operator/dashboard' },
    { name: 'My Buses', path: '/operator/buses' },
    { name: 'Seat Layouts', path: '/operator/seat-layouts' },
    { name: 'Assigned Routes', path: '/operator/routes' },
    { name: 'Passenger Lists', path: '/operator/passengers' },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-slate-900 text-slate-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Operator Hub</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path ? 'bg-primary-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-slate-800">Operator Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              {user?.full_name || 'Operator'}
            </span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">
              Log out
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OperatorLayout;
