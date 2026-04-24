import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          .font-custom-about {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}
      </style>
      <div className="min-h-screen flex flex-col font-custom-about bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/about_us_bus.png')" }}>
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/30 z-0 pointer-events-none"></div>

      {/* ── Navbar ── */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">SmartBus</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <Link to="/about-us" className="text-slate-900 font-semibold text-sm border-b-2 border-primary-600 pb-1">
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

      <main className="flex-grow relative z-10">
        {/* ── Hero Title Section ── */}
        <section className="relative h-[30vh] min-h-[250px] flex items-center justify-center border-b border-white/10 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-4">About SmartBus</h1>
            <p className="text-xl text-slate-200 drop-shadow max-w-2xl mx-auto">Revolutionizing travel across Sri Lanka, one seamless journey at a time.</p>
          </div>
        </section>

        {/* ── Content Section ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-black text-white mb-6 relative drop-shadow-md">
                Your Journey, Simplified.
                <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary-500 rounded"></div>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-4 drop-shadow-sm">
                Centered at the Makumbura Multimodal Center, SmartBus is the premier digital gateway for Sri Lanka’s highway travel. We specialize in connecting the heart of the expressway network to the rest of the island. By digitizing the MMC experience, we eliminate the wait and the uncertainty, offering you a first-class booking experience for a first-class highway journey.
              </p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img src="/images/about_us_bus.png" alt="Sri Lanka Bus" className="rounded-xl w-full h-auto object-cover" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 shadow-2xl text-center text-white mb-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-500/20 blur-3xl rounded-full"></div>
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>
             
             <h2 className="text-3xl font-black mb-6 relative z-10">Our Commitment to Reliability</h2>
             <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed z-10 relative">
               Trust is the engine that drives our platform. We thoroughly vet every bus operator and conductor on our system. When you book a seat through SmartBus, you can rest assured that your payment is 100% secure, your seat is guaranteed, and your departure times are accurate. No overbooking, no last-minute cancellations without notice. We are here for you 24/7.
             </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-white/20 pt-16">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-extrabold text-primary-400 mb-2 drop-shadow-md">150+</div>
              <div className="text-slate-300 font-medium">Daily Routes</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-extrabold text-primary-400 mb-2 drop-shadow-md">10k+</div>
              <div className="text-slate-300 font-medium">Happy Passengers</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-extrabold text-primary-400 mb-2 drop-shadow-md">24/7</div>
              <div className="text-slate-300 font-medium">Customer Support</div>
            </div>
          </div>

        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900/80 backdrop-blur-md text-slate-400 py-12 text-center text-sm border-t border-white/10 relative z-10">
        <p>© 2026 Smart Bus E-Ticketing System — Group 14 Project. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default AboutUsPage;
