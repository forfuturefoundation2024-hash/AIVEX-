import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider, useWebSocket } from './context/WebSocketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProductDetails } from './pages/ProductDetails';
import { Explore } from './pages/Explore';
import { SellerDashboard } from './pages/SellerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { motion } from 'motion/react';
import { Package } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
            <Navbar />
            <LiveNotification />
            <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/seller/dashboard" 
                element={
                  <ProtectedRoute role="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Legal Pages */}
              <Route path="/terms" element={<LegalPage title="Terms of Service" />} />
              <Route path="/privacy" element={<LegalPage title="Privacy Policy" />} />
              <Route path="/seller-agreement" element={<LegalPage title="Seller Agreement" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

const LiveNotification = () => {
  const { lastMessage } = useWebSocket();
  const [notification, setNotification] = useState<{ product: any } | null>(null);

  useEffect(() => {
    if (lastMessage?.type === 'new_product') {
      setNotification({ product: lastMessage.product });
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  if (!notification) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-4 z-[100] w-80 rounded-2xl border border-indigo-100 bg-white p-4 shadow-2xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Package size={20} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">New Software Published!</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{notification.product.name}</p>
          <p className="text-xs text-slate-500">By {notification.product.seller_name}</p>
          <Link 
            to={`/product/${notification.product.id}`} 
            onClick={() => setNotification(null)}
            className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:underline"
          >
            View Listing →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const LegalPage = ({ title }: { title: string }) => (
  <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-slate-900 mb-8">{title}</h1>
    <div className="prose prose-slate max-w-none">
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        Last updated: February 21, 2026
      </p>
      <p className="mb-4">
        Welcome to GlobalSoft Market. This {title.toLowerCase()} governs your use of our platform.
      </p>
      <h2 className="text-2xl font-bold mt-10 mb-4">1. Introduction</h2>
      <p className="mb-4">
        GlobalSoft Market is a worldwide software eCommerce marketplace platform. We allow developers from anywhere in the world to upload and sell their software directly to buyers.
      </p>
      <h2 className="text-2xl font-bold mt-10 mb-4">2. Seller Responsibility</h2>
      <p className="mb-4 font-bold text-slate-900">
        IMPORTANT: GlobalSoft Market is a platform only. All selling risk, liability, refunds, and support responsibilities belong to the software owner (seller), not the platform.
      </p>
      <p className="mb-4">
        By using this platform, you acknowledge that GlobalSoft Market does not guarantee the quality, safety, or legality of the software listed.
      </p>
      {/* More boilerplate content would go here */}
      <p className="mt-10 text-slate-500 italic">
        This is a simplified version of the {title} for demonstration purposes.
      </p>
    </div>
  </div>
);
