import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ArrowRight, SlidersHorizontal, Package, User } from 'lucide-react';
import { Product, Seller } from '../types';
import { formatCurrency } from '../lib/utils';
import { useWebSocket } from '../context/WebSocketContext';

export const Explore: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'products' | 'sellers'>('products');
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
    
    fetch('/api/sellers')
      .then(res => res.json())
      .then(data => setSellers(data));
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'new_product') {
      const newProd = lastMessage.product;
      setProducts(prev => {
        if (prev.find(p => p.id === newProd.id)) return prev;
        return [newProd, ...prev];
      });
    }
  }, [lastMessage]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase()) ||
                         p.seller_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['All', 'Productivity', 'Design', 'AI Tools', 'Security', 'Development', 'Social', 'Marketing', 'Business', 'Entertainment'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Explore Software</h1>
          <p className="mt-2 text-slate-500">Discover powerful tools from developers worldwide.</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search software..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'products' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Software Listings
          </button>
          <button 
            onClick={() => setActiveTab('sellers')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'sellers' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sellers
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  category === cat 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg">
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={`https://picsum.photos/seed/${product.id}/400/300`} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{product.category}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
                    <span className="text-xs text-slate-400">By {product.seller_name}</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500">No software found matching your criteria.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSellers.length > 0 ? filteredSellers.map((seller) => (
            <div key={seller.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{seller.name}</h3>
                  <p className="text-xs text-slate-500">Member since {new Date(seller.created_at).getFullYear()}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Products Listed</span>
                  <span className="font-bold text-slate-900">{seller.product_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">Verified</span>
                </div>
              </div>
              <button 
                onClick={() => alert(`Viewing profile of ${seller.name}`)}
                className="mt-6 w-full rounded-xl border border-slate-200 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Profile
              </button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500">No sellers found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
