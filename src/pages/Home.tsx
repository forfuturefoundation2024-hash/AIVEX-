import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Download, ShieldCheck, Zap, Users, Globe, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { useWebSocket } from '../context/WebSocketContext';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'new_product') {
      const newProd = lastMessage.product;
      setFeaturedProducts(prev => {
        if (prev.find(p => p.id === newProd.id)) return prev;
        return [newProd, ...prev.slice(0, 3)];
      });
    }
  }, [lastMessage]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                The Global Marketplace for <span className="text-indigo-600">Software Creators.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Buy and sell software directly. No middlemen, no hidden fees. From AI tools to productivity suites, find the best software from developers worldwide.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link to="/explore" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                  Browse Marketplace
                </Link>
                <Link to="/register?role=seller" className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-1 hover:text-indigo-600 transition-colors">
                  Start Selling <ArrowRight size={16} />
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8 text-slate-400">
                <div className="flex items-center gap-2"><Users size={20} /> <span>10k+ Developers</span></div>
                <div className="flex items-center gap-2"><Download size={20} /> <span>50k+ Downloads</span></div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://picsum.photos/seed/software/800/600" 
                alt="Marketplace Preview" 
                className="rounded-2xl shadow-2xl border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-xl border border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Secure Delivery</p>
                    <p className="text-xs text-slate-500">Instant access after purchase</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wider">Why GlobalSoft?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to trade software.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Global Reach', desc: 'Sell to customers in over 190 countries with automatic currency handling.', icon: Globe },
              { title: 'Instant Delivery', desc: 'Automated digital fulfillment ensures buyers get their software immediately.', icon: Zap },
              { title: 'Direct Communication', desc: 'Chat directly with sellers for support, custom requests, or feedback.', icon: Users },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Software</h2>
              <p className="mt-2 text-slate-500">Handpicked tools from our top-rated developers.</p>
            </div>
            <Link to="/explore" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              View all <ArrowRight size={16} className="inline" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.length > 0 ? featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg">
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
              // Skeleton loaders
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">Ready to sell your software?</h2>
              <p className="mt-2 text-indigo-100">Join thousands of developers and start earning today.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/register?role=seller" className="rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                Create Seller Account
              </Link>
              <Link to="/seller-agreement" className="rounded-full border border-indigo-400 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
