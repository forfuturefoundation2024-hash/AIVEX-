import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, Download, MessageSquare, Globe, ArrowLeft, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setReviews(data.reviews || []);
        setIsLoading(false);
        
        // Track view
        fetch(`/api/products/${id}/view`, { method: 'POST' });
      });
  }, [id]);

  const trackClick = () => {
    if (id) {
      fetch(`/api/products/${id}/click`, { method: 'POST' });
    }
  };

  const handlePurchase = async () => {
    trackClick();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product?.id, amount: product?.price })
      });
      if (res.ok) {
        alert(`Purchase successful! You can now download the software from your dashboard. \n\nSeller Contact: ${product?.contact_number || 'N/A'} \nSeller Name: ${product?.seller_name}`);
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Checkout failed. Please try again.');
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div></div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: Media & Description */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <img 
              src={product.screenshots || `https://picsum.photos/seed/${product.id}/1200/600`} 
              alt={product.name} 
              className="w-full object-cover aspect-video"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="mt-10">
            <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">{product.category}</span>
              <div className="flex items-center gap-1 text-sm text-amber-500">
                <Star size={16} fill="currentColor" />
                <span className="font-bold">4.8</span>
                <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
              </div>
              <span className="text-sm text-slate-500">Version {product.version}</span>
              <span className="text-sm text-slate-500">By {product.seller_name}</span>
            </div>

            <div className="mt-8 prose prose-slate max-w-none">
              <h2 className="text-xl font-bold text-slate-900">About this software</h2>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">System Requirements</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating System</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">Windows 10/11, macOS 12+, Linux</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Storage</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">500MB available space</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
                <button className="text-sm font-bold text-indigo-600 hover:underline">Write a review</button>
              </div>
              <div className="mt-8 space-y-8">
                {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{review.user_name}</p>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-slate-500 italic">No reviews yet for this software.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">Lifetime License</span>
              </div>
              
              <button 
                onClick={handlePurchase}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md"
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>Instant digital download</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>Verified secure software</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>Direct developer support</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Seller Liability Notice</h3>
                  <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                    GlobalSoft is a marketplace only. All support, refunds, and liability for this software are the sole responsibility of <strong>{product.seller_name}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-bold text-slate-900">Need help?</h3>
              <p className="mt-1 text-xs text-slate-500">Contact the seller directly for pre-sale questions.</p>
              {product.contact_number && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                  <Phone size={16} className="text-indigo-600" />
                  {product.contact_number}
                </div>
              )}
              <button 
                onClick={() => {
                  trackClick();
                  alert(`Contacting ${product.seller_name}... You can reach them at ${product.contact_number || 'their profile'}`);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <MessageSquare size={16} />
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
