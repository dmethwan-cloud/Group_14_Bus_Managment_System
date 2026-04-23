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
            <div className="flex items-center gap-6">
              <Link to="/about-us" className="text-slate-600 font-semibold text-sm hover:text-primary-600 transition-colors">
                About Us
              </Link>
              <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
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

        {/* ── Our Services Section ── */}
        <section className="py-24 relative z-10 bg-slate-900/40 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">Our Services</h2>
              <p className="mt-4 text-lg text-slate-300 drop-shadow max-w-2xl mx-auto">
                We've built a comprehensive suite of tools to make your journey as smooth as possible from start to finish.
              </p>
            </div>

            <div className="space-y-24">
              {/* Service 1: Booking */}
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 p-1 rounded-3xl w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500 shadow-2xl shadow-blue-500/20">
                    <div className="bg-slate-900/90 backdrop-blur-xl p-6 md:p-8 rounded-[23px] border border-white/10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full"></div>
                       <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-5">
                          <div className="text-white font-bold text-lg">Colombo</div>
                          <div className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm">Direct</div>
                          <div className="text-white font-bold text-lg">Kandy</div>
                       </div>
                       <div className="flex justify-between items-center mb-8">
                          <div className="text-slate-400 text-sm">Departure<br/><span className="text-white text-xl font-semibold">10:00 AM</span></div>
                          <div className="text-slate-400 text-sm text-right">Seat<br/><span className="text-white text-xl font-semibold">14A</span></div>
                       </div>
                       <div className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-3.5 rounded-xl text-center text-white font-semibold shadow-lg shadow-blue-600/40 cursor-pointer">
                          Confirm Booking
                       </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 text-left">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl text-blue-400 mb-6 border border-blue-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">Seamless Ticket Booking</h3>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    Search across hundreds of routes, compare prices, and book your preferred seat in seconds. Our interactive seat selection makes it incredibly easy to travel exactly how you want.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-slate-300"><span className="text-blue-400 mr-3">✓</span> Interactive seat maps</li>
                    <li className="flex items-center text-slate-300"><span className="text-blue-400 mr-3">✓</span> Instant email confirmations</li>
                  </ul>
                </div>
              </div>

              {/* Service 2: Management */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-1 rounded-3xl w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500 shadow-2xl shadow-purple-500/20">
                    <div className="bg-slate-900/90 backdrop-blur-xl p-6 md:p-8 rounded-[23px] border border-white/10 space-y-4 relative overflow-hidden">
                       <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
                       <h4 className="text-white font-bold text-lg mb-4">My Dashboard</h4>
                       
                       <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mr-4 border border-green-500/30">✓</div>
                          <div className="flex-grow">
                            <div className="text-white font-semibold">Trip to Galle</div>
                            <div className="text-slate-400 text-sm">Completed • Oct 12</div>
                          </div>
                          <div className="text-slate-500">→</div>
                       </div>
                       
                       <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mr-4 border border-purple-500/30">🕒</div>
                          <div className="flex-grow">
                            <div className="text-white font-semibold">Trip to Jaffna</div>
                            <div className="text-slate-400 text-sm">Upcoming • Nov 24</div>
                          </div>
                          <div className="text-slate-500">→</div>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 text-left">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/20 rounded-2xl text-purple-400 mb-6 border border-purple-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">Manage Your Bookings</h3>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    Never lose track of a trip again. Your personalized dashboard keeps all your past and upcoming travels perfectly organized in one secure place.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-slate-300"><span className="text-purple-400 mr-3">✓</span> View detailed itineraries</li>
                    <li className="flex items-center text-slate-300"><span className="text-purple-400 mr-3">✓</span> Download e-tickets anytime</li>
                  </ul>
                </div>
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