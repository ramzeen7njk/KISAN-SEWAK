import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FarmerLogin from './pages/FarmerLogin';
import FarmerSignup from './pages/FarmerSignup';
import MarketplaceLogin from './pages/MarketplaceLogin';
import MarketplaceSignup from './pages/MarketplaceSignup';
import LogisticsLogin from './pages/LogisticsLogin';
import LogisticsSignup from './pages/LogisticsSignup';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import MarketplaceDashboard from './pages/MarketplaceDashboard';
import MarketplaceProducts from './pages/MarketplaceProducts';
import MarketplaceOrders from './pages/MarketplaceOrders';
import AdminDashboard from './pages/AdminDashboard';
import MyCrops from './pages/MyCrops';
import { UserProvider } from './contexts/UserContext';
import { useUser } from './contexts/UserContext';
import EditProfile from './components/EditProfile';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

// App content component
const AppContent = () => {
  const { loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer/login" element={<FarmerLogin />} />
          <Route path="/farmer/signup" element={<FarmerSignup />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/crops" element={<MyCrops />} />
          <Route path="/farmer/market-prices" element={<FarmerDashboard />} />
          <Route path="/farmer/logistics" element={<FarmerDashboard />} />
          <Route path="/farmer/marketplace" element={<FarmerDashboard />} />
          <Route path="/farmer/documents" element={<FarmerDashboard />} />
          <Route path="/farmer/history" element={<FarmerDashboard />} />
          <Route path="/farmer/profile/edit" element={<EditProfile />} />
          <Route path="/farmer/profile/upload-image" element={<EditProfile />} />

          {/* Logistics Routes */}
          <Route path="/logistics/login" element={<LogisticsLogin />} />
          <Route path="/logistics/signup" element={<LogisticsSignup />} />
          <Route path="/logistics/dashboard/*" element={<LogisticsDashboard />} />

          {/* Marketplace Routes */}
          <Route path="/marketplace/login" element={<MarketplaceLogin />} />
          <Route path="/marketplace/signup" element={<MarketplaceSignup />} />
          <Route path="/marketplace/dashboard" element={<MarketplaceDashboard />} />
          <Route path="/marketplace/products" element={<MarketplaceProducts />} />
          <Route path="/marketplace/orders" element={<MarketplaceOrders />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UserProvider>
        <Router>
          <Toaster position="top-right" />
          <AppContent />
        </Router>
      </UserProvider>
    </Suspense>
  );
}

export default App;