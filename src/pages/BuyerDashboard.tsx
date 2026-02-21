import React, { useEffect, useState } from 'react';
import { ShoppingBag, Download, MessageSquare, Star, Clock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { formatCurrency } from '../lib/utils';

export const BuyerDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (token) {
      fetch('/api/user/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(data));
    }
  }, [token]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">My Library</h1>
        <p className="mt-2 text-slate-500">Manage your purchased software and downloads.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{order.product_name}</h3>
                      <p className="text-sm text-slate-500">Purchased on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <button 
                      onClick={() => alert(`Downloading ${order.product_name}... \n\nIf the download doesn't start, please contact the seller. \nOrder ID: #${order.id}`)}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={16} /> Download Software
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      <MessageSquare size={16} /> Contact Seller
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      <Star size={16} /> Leave Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your library is empty</h3>
              <p className="mt-2 text-slate-500">Explore the marketplace to find amazing software.</p>
              <button className="mt-6 rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
                Browse Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Account Summary</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Purchases</span>
                <span className="text-sm font-bold text-slate-900">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Spent</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(orders.reduce((acc, curr) => acc + curr.amount, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Member Since</span>
                <span className="text-sm font-bold text-slate-900">Feb 2026</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
            <div className="flex items-start gap-3">
              <Shield size={20} className="mt-0.5 text-indigo-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-indigo-900">Buyer Protection</h3>
                <p className="mt-1 text-xs text-indigo-700 leading-relaxed">
                  Your purchases are secured by our platform monitoring. If you encounter issues with a seller, please report it to our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
