import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const OperatorLayout = () => {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => logout();

  const hasBackground = ['/operator', '/operator/dashboard', '/operator/add-bus', '/operator/assign-buses'].includes(location.pathname);

  const navLinks = [
    { name: 'Dashboard', path: '/operator/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Add Bus', path: '/operator/add-bus', icon: 'M12 4v16m8-8H4' },
    { name: 'Assign Buses', path: '/operator/assign-buses', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'My Profile', path: '/operator/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Change Password', path: '/operator/change-password', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="sidebar text-slate-300">
        <div className="sidebar-header">
          <h1 className="text-xl font-bold text-white tracking-wide">SmartTicket <span className="text-blue-500">Operator</span></h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${location.pathname.startsWith(link.path) ? 'sidebar-link-active !border-blue-500 text-blue-400 bg-blue-500/10' : ''}`}
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Operator Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {user?.full_name?.charAt(0).toUpperCase() || 'O'}
            </div>
            <span className="text-sm font-medium text-slate-600">
              {user?.full_name || 'Operator'}
            </span>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto relative ${
          hasBackground
            ? 'bg-[url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop")] bg-cover bg-center bg-fixed'
            : 'bg-slate-50'
        }`}>
          {hasBackground && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-0"></div>
          )}
          <div className="relative z-10 p-8 h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperatorLayout;