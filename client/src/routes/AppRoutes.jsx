// AppRoutes.jsx — All application routes with protected admin route guard
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import DistrictPage from '../pages/DistrictPage';
import CategoryPage from '../pages/CategoryPage';
import VendorDetails from '../pages/VendorDetails';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import Vendors from '../pages/admin/Vendors';
import AddVendor from '../pages/admin/AddVendor';
import EditVendor from '../pages/admin/EditVendor';

// Layout wrapper
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Protected Route — redirects to login if no token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

// Public layout with Navbar + Footer
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '70vh' }}>{children}</main>
    <Footer />
  </>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/vendor/:id" element={<PublicLayout><VendorDetails /></PublicLayout>} />

      {/* District and Category navigation */}
      <Route path="/:district" element={<PublicLayout><DistrictPage /></PublicLayout>} />
      <Route path="/:district/:category" element={<PublicLayout><CategoryPage /></PublicLayout>} />

      {/* ── Admin Routes ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
      <Route path="/admin/vendors/add" element={<ProtectedRoute><AddVendor /></ProtectedRoute>} />
      <Route path="/admin/vendors/edit/:id" element={<ProtectedRoute><EditVendor /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
