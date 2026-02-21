import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, DollarSign, ShoppingBag, Plus, BarChart3, Settings, User, ExternalLink, X, Home, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Product } from '../types';

export const SellerDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total_products: 0, total_sales: 0, total_revenue: 0, total_views: 0, total_clicks: 0 });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Productivity',
    version: '1.0.0',
    screenshots: '',
    contact_number: ''
  });

  useEffect(() => {
    if (token) {
      fetch('/api/seller/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setStats(data));
    }
  }, [token]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) })
      });
      if (res.ok) {
        setIsAddingProduct(false);
        // Refresh stats or products list
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Seller Account</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/" className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Home size={18} /> Home Page
            </Link>
            <button className="flex w-full items-center gap-3 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-600">
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Package size={18} /> My Products
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <ShoppingBag size={18} /> Orders ({stats.total_products} Listed)
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <BarChart3 size={18} /> Analytics
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} /> Upload Software
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><DollarSign size={20} /></div>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total_revenue || 0)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><ShoppingBag size={20} /></div>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Sales</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total_sales || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Eye size={20} /></div>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Views</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total_views || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Heart size={20} /></div>
            </div>
            <p className="text-sm font-medium text-slate-500">Interested (Clicks)</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total_clicks || 0}</p>
          </div>
        </div>

        {/* Recent Activity / Products */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Sales</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                <ShoppingBag size={32} />
              </div>
              <p className="text-slate-500">No sales yet. Share your product links to get started!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Upload New Software</h2>
              <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Software Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. AI Image Generator Pro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price (USD)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Productivity</option>
                    <option>Design</option>
                    <option>AI Tools</option>
                    <option>Security</option>
                    <option>Development</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Describe what your software does..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Screenshot URL (Optional)</label>
                  <input 
                    type="text" 
                    value={newProduct.screenshots}
                    onChange={e => setNewProduct({...newProduct, screenshots: e.target.value})}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Contact Number (Optional)</label>
                  <input 
                    type="text" 
                    value={newProduct.contact_number}
                    onChange={e => setNewProduct({...newProduct, contact_number: e.target.value})}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
