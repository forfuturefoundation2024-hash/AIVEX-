import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Search, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Globe size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">AIVEX SOCIALMARKET</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/explore" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Explore</Link>
              <Link to="/categories" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Categories</Link>
              <Link to="/sellers" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sellers</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search software..." 
                className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">0</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.role === 'seller' ? '/seller/dashboard' : '/dashboard'} 
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Log in</Link>
                <Link to="/register" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Sign up</Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/explore" className="text-base font-medium text-slate-600">Explore</Link>
            <Link to="/categories" className="text-base font-medium text-slate-600">Categories</Link>
            <Link to="/sellers" className="text-base font-medium text-slate-600">Sellers</Link>
            <hr className="border-slate-100" />
            {user ? (
              <>
                <Link to="/dashboard" className="text-base font-medium text-slate-600">Dashboard</Link>
                <button onClick={logout} className="text-left text-base font-medium text-red-600">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-base font-medium text-slate-600">Log in</Link>
                <Link to="/register" className="rounded-lg bg-indigo-600 py-2 text-center text-base font-medium text-white">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
