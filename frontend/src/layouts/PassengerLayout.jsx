import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const PassengerLayout = () => {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => logout();

  const navLinks = [
    { name: 'Search Buses', path: '/passenger/dashboard', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { name: 'My Bookings', path: '/passenger/bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'My Profile', path: '/passenger/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Change Password', path: '/passenger/change-password', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="sidebar text-slate-300">
        <div className="sidebar-header">
          <h1 className="text-xl font-bold text-white tracking-wide">SmartTicket <span className="text-emerald-500">Passenger</span></h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${location.pathname.startsWith(link.path) ? 'sidebar-link-active !border-emerald-500 text-emerald-400 bg-emerald-500/10' : ''}`}
            >
              <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main 
        className="flex-1 flex flex-col overflow-hidden bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/bus_home_bg.png')" }}
      >
        <div className="absolute inset-0 bg-slate-900/40 z-0 pointer-events-none"></div>
        
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8 z-10 border-b border-white/20">
          <h2 className="text-xl font-semibold text-slate-800">Passenger Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {user?.full_name?.charAt(0).toUpperCase() || 'P'}
            </div>
            <span className="text-sm font-medium text-slate-800">
              {user?.full_name || 'Passenger'}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PassengerLayout;