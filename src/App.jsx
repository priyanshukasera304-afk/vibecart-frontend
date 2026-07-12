import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 👈 1. React Hot Toast import kiya
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout'; 
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard'; 
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* 👈 2. Premium Custom Toaster Configuration */}
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#1C1B17', // VibeCart ka premium signature dark tone
              color: '#FAF8F2',       // Clean bone-white text color
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '8px',
              border: '1px solid #EFECE3',
              padding: '12px 24px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#FAF8F2',
                secondary: '#1C1B17',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#7F1D1D', // Error ke liye smooth dark red theme
                color: '#FEE2E2',
                border: '1px solid #FCA5A5',
              },
              iconTheme: {
                primary: '#FEE2E2',
                secondary: '#7F1D1D',
              },
            },
          }} 
        />
        
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/" element={<AdminDashboard />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;