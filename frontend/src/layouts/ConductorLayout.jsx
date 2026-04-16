import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const ConductorLayout = () => {
  const user = getUser();
  const location = useLocation();

  const handleLogout = () => logout();

  const navLinks = [
    { name: 'My Bus Schedule', path: '/conductor/dashboard' },
    { name: 'Validate Tickets', path: '/conductor/validate' },
    { name: 'Passenger List', path: '/conductor/passengers' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-lg font-bold text-yellow-950">Conductor Portal</h1>
          <button onClick={handleLogout} className="text-sm font-semibold text-yellow-900 hover:text-black">
            Logout ({user?.full_name?.split(' ')[0]})
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  location.pathname === link.path
                    ? 'border-yellow-500 text-yellow-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ConductorLayout;
