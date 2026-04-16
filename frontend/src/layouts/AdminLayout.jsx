import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const AdminLayout = () => {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => logout();

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Bus Operators', path: '/admin/operators' },
    { name: 'Routes & Buses', path: '/admin/routes' },
    { name: 'All Bookings', path: '/admin/bookings' },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary-700">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${location.pathname === link.path ? 'sidebar-link-active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800">System Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Welcome, {user?.full_name || 'Admin'}
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-4 rounded-md">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
