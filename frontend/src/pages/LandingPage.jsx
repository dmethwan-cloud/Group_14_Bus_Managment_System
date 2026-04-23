import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/bus_home_bg.png')" }}>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/60 z-0 pointer-events-none"></div>
      {/* ── Navbar ── */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">SmartBus</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 font-semibold text-sm hover:text-primary-600 transition-colors">
                Log In
              </Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm shadow-md shadow-primary-500/20">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-grow relative z-10">
        <section className="relative pt-16 sm:pt-24 lg:pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-left lg:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
                  Book your next journey <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 drop-shadow-sm">in seconds.</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-200 mb-8 leading-relaxed drop-shadow">
                  Experience the fastest, most reliable way to book bus tickets across the country. Choose your seat, pay securely, and board with ease.
                </p>
              </div>

              {/* Hero Image */}
              <div className="hidden lg:flex items-center justify-center">
                <img
                  src="/images/hero-bus.jpg"
                  alt="Modern bus"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>


        {/* ── Features Section ── */}
        <section className="py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white drop-shadow-md">Why SmartBus?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:-translate-y-2 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-300 mb-6 shadow-inner border border-blue-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">Fast and Easy Bookings</h3>
                <p className="text-slate-300 leading-relaxed">Book your bus tickets in just a few clicks. Our streamlined process saves you time and hassle.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:-translate-y-2 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 mb-6 shadow-inner border border-indigo-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">Search Routes</h3>
                <p className="text-slate-300 leading-relaxed">Easily find buses for your preferred destinations. View schedules, availability, and route details instantly.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:-translate-y-2 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-300 mb-6 shadow-inner border border-purple-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">Secure E-Tickets</h3>
                <p className="text-slate-300 leading-relaxed">Your tickets are safely stored digitally. Simply show your e-ticket on your mobile device when boarding.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900/80 backdrop-blur-md text-slate-400 py-12 text-center text-sm border-t border-slate-800 relative z-10">
        <p>© 2026 Smart Bus E-Ticketing System — Group 14 Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;