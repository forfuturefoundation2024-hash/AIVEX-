import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Globe size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">GlobalSoft</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-500 leading-relaxed">
              The worldwide software marketplace. Empowering developers to sell directly to users across the globe.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-slate-400 hover:text-indigo-600"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600"><Github size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Marketplace</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/explore" className="text-sm text-slate-500 hover:text-indigo-600">All Software</Link></li>
              <li><Link to="/categories" className="text-sm text-slate-500 hover:text-indigo-600">Categories</Link></li>
              <li><Link to="/sellers" className="text-sm text-slate-500 hover:text-indigo-600">Top Sellers</Link></li>
              <li><Link to="/deals" className="text-sm text-slate-500 hover:text-indigo-600">Special Deals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/help" className="text-sm text-slate-500 hover:text-indigo-600">Help Center</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-indigo-600">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-slate-500 hover:text-indigo-600">FAQ</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-slate-500 hover:text-indigo-600">Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/terms" className="text-sm text-slate-500 hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-500 hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/seller-agreement" className="text-sm text-slate-500 hover:text-indigo-600">Seller Agreement</Link></li>
              <li><Link to="/dmca" className="text-sm text-slate-500 hover:text-indigo-600">DMCA Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-slate-200 pt-8 text-center">
          <p className="text-xs text-slate-400">
            © 2026 GlobalSoft Market. All rights reserved. GlobalSoft is a platform only. All software risk and liability belong to the respective sellers.
          </p>
        </div>
      </div>
    </footer>
  );
};
