import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import FixedBackground from './components/layout/FixedBackground';

// Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';

import Dashboard from './pages/dashboard/Dashboard';
import Admin from './pages/admin/Admin';
import Checkout from './pages/public/Checkout';
import Contact from './pages/public/Contact';
import Manifesto from './pages/public/Manifesto';
import Register from './pages/public/Register';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

// Protected Route Implementation
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'admin' | 'user' }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    console.log('Blocked by ProtectedRoute:', { userRole: user?.role, requiredRole: role });
    return <Navigate to="/" replace />;
  }

  // Redirect to payment if status is 'PENDING' and not already on payment page
  if (user?.role?.toLowerCase() === 'user' && user?.status === 'PENDING' && window.location.hash !== '#/payment') {
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  const isDashboardOrAdmin = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />

      {/* Brand Background Layer (Public/Marketing only) */}
      {!isDashboardOrAdmin && <FixedBackground />}

      <div className="relative z-[2]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* User Flow Routes */}
          <Route path="/payment" element={<Checkout />} />

          {/* Secure Routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;