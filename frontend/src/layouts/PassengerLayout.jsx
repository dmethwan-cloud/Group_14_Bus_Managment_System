import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const PassengerLayout = () => {
  const user = getUser();
  const location = useLocation();

  const handleLogout = () => logout();

  const navLinks = [
    { name: 'Search Buses', path: '/passenger/dashboard' },
    { name: 'My Bookings', path: '/passenger/bookings' },
    { name: 'My Tickets', path: '/passenger/tickets' },
    { name: 'Profile Settings', path: '/passenger/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-primary-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold tracking-tight">SmartTicket</h1>
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === link.path ? 'bg-primary-800 text-white' : 'hover:bg-primary-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Hi, {user?.full_name?.split(' ')[0] || 'Passenger'}</span>
              <button 
                onClick={handleLogout} 
                className="bg-primary-600 hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PassengerLayout;
