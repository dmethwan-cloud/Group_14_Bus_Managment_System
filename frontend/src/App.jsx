import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import LandingPage from './pages/LandingPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import OperatorLayout from './layouts/OperatorLayout';
import PassengerLayout from './layouts/PassengerLayout';
import ConductorLayout from './layouts/ConductorLayout';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminUsers from './pages/dashboards/AdminUsers';
import OperatorDashboard from './pages/dashboards/OperatorDashboard';
import PassengerDashboard from './pages/dashboards/PassengerDashboard';
import ConductorDashboard from './pages/dashboards/ConductorDashboard';

// Shared Pages
import ProfilePage from './pages/shared/ProfilePage';
import ChangePasswordPage from './pages/shared/ChangePasswordPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Protected Admin Routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="operators" element={<div className="p-4">Operator Approvals (Placeholder)</div>} />
            <Route path="routes" element={<div className="p-4">Global Routes (Placeholder)</div>} />
            <Route path="bookings" element={<div className="p-4">All Bookings (Placeholder)</div>} />
          </Route>
        </Route>

        {/* ── Protected Operator Routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['operator']} />}>
          <Route path="/operator" element={<OperatorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OperatorDashboard />} />
            <Route path="buses" element={<div className="p-4">My Fleet (Placeholder)</div>} />
            <Route path="seat-layouts" element={<div className="p-4">Seat Layouts (Placeholder)</div>} />
            <Route path="routes" element={<div className="p-4">Assigned Routes (Placeholder)</div>} />
            <Route path="passengers" element={<div className="p-4">Passenger Lists (Placeholder)</div>} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        {/* ── Protected Passenger Routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['passenger']} />}>
          <Route path="/passenger" element={<PassengerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PassengerDashboard />} />
            <Route path="bookings" element={<div className="p-4">My Bookings (Placeholder)</div>} />
            <Route path="tickets" element={<div className="p-4">My Tickets (Placeholder)</div>} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        {/* ── Protected Conductor Routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['conductor']} />}>
          <Route path="/conductor" element={<ConductorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ConductorDashboard />} />
            <Route path="validate" element={<div className="p-4">Validate Tickets (Placeholder)</div>} />
            <Route path="passengers" element={<div className="p-4">Passenger List (Placeholder)</div>} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        {/* Fallback Unauthorized Route */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="flex h-screen items-center justify-center bg-slate-50">
              <div className="text-center card">
                <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-slate-600 mb-6">You do not have permission to view this page.</p>
                <button onClick={() => window.location.href='/login'} className="btn-primary">Return to Login</button>
              </div>
            </div>
          } 
        />
        
        {/* Fallback 404 Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
