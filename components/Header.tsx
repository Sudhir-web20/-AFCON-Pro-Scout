
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-700/50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
          <i className="fa-solid fa-trophy text-white text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            AFCON<span className="text-amber-500">PRO</span>
          </h1>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">International Scout</p>
        </div>
      </div>

      <nav className="flex items-center space-x-6">
        <div className="hidden sm:flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">
          <i className="fa-solid fa-chart-line text-xs" />
          <span>Analytics</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">
          <i className="fa-solid fa-earth-africa text-xs" />
          <span>AFCON 2025</span>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95">
          Sign In
        </button>
      </nav>
    </header>
  );
};

export default Header;
