import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, MapPin, Info, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/explore', label: 'Explore', icon: Map },
    { path: '/pincode', label: 'Pincode Lookup', icon: MapPin },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111827]/80 backdrop-blur-xl border-b border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-black shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform hover:scale-105 active:scale-95 duration-300">
            <MapPin className="w-6 h-6 shrink-0 stroke-[2.5px]" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center">
            INDIA<span className="text-primary italic">PIN</span>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300
                ${isActive ? 'text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]' : 'text-text-muted hover:text-white hover:bg-white/5'}
              `}
            >
              <Icon className={`w-4 h-4 ${path === '/dashboard' ? 'animate-pulse' : ''}`} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
            className="md:hidden p-2 text-text-muted hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
          <div className="md:hidden bg-surface border-b border-white/10 px-6 py-8 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `
                        flex items-center gap-4 px-6 py-4 rounded-2xl text-[14px] font-bold transition-all duration-200
                        ${isActive ? 'text-primary bg-primary/10' : 'text-text-muted hover:bg-white/5'}
                    `}
                >
                    <Icon className="w-5 h-5" />
                    {label}
                </NavLink>
              ))}
          </div>
      )}
    </nav>
  );
};

export default Navbar;
