// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Logout from "./components/Logout";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Favorites from "./pages/Favorites";
import AboutUs from "./pages/AboutUs";
import Store from "./pages/Store";
import Brands from "./pages/Brands";
import RealEstate from "./pages/RealEstate";
import NotFound from "./pages/NotFound";

// ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";   // ← NEW!

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useApp();

  // Your official admin emails
  const adminEmails = [
    "admin@gmall.com",
    "phornsunnich@gmall.com",
    "sunnich@gmall.com"
  ];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !adminEmails.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest-only route
const GuestRoute = ({ children }) => {
  const { user } = useApp();
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  const { darkMode } = useApp();

  return (
    <div
      data-bs-theme={darkMode ? "dark" : "light"}
      className="d-flex flex-column min-vh-100 bg-body"
    >
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/stores" element={<Store />} />
          <Route path="/real-estate" element={<RealEstate />} />

          {/* AUTH (Guest Only) */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />

          {/* USER PROTECTED ROUTES */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* NEW: Users Management */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <UsersManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch-all admin routes (for future pages) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;