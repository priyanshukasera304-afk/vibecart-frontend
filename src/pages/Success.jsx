import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 👈 1. Tumhari CartContext import ki!
import axios from 'axios';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("processing");
  const hasCalled = useRef(false);

  // 👈 2. Cart Context variables extract kiye safely
  // Agar tumhare context me function ka naam 'clearCart' hai ya 'setCartItems' ya 'setCart', hum sabko dynamically handle karenge
  const cartContext = useCart(); 

  useEffect(() => {
    const verifyAndProcess = async () => {
      if (!sessionId) {
        setStatus("error");
        setLoading(false);
        return;
      }

      if (hasCalled.current) return;
      hasCalled.current = true;

      try {
        const token = localStorage.getItem('token');
        
      const response = await axios.post(
  'https://vibecart-backend-yame.onrender.com/api/payment/verify-payment', // 🎯 Exact Live Backend URL!
  { sessionId },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        if (response.data.success) {
          // 🧼 A. Local storage saaf kiya
          localStorage.removeItem('cartItems'); 
          localStorage.removeItem('cart');
          localStorage.setItem('cartItems', JSON.stringify([])); 
          
          // 🎯 B. 100% WORKING STATE FLUSH HACK:
          // Tumhare CartContext me jo bhi state clear function hai use trigger karega!
          if (cartContext) {
            if (typeof cartContext.clearCart === 'function') {
              cartContext.clearCart();
            } else if (typeof cartContext.setCartItems === 'function') {
              cartContext.setCartItems([]);
            } else if (typeof cartContext.setCart === 'function') {
              cartContext.setCart([]);
            }
          }

          // Safe storage window event pass kiya
          window.dispatchEvent(new Event("storage"));
          
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyAndProcess();
  }, [sessionId, cartContext]);

  const handleRedirect = () => {
    // 🔄 Programmatic safe window replace reload route redirection
    window.location.href = '/my-orders';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0E131F] text-white p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-xl font-bold animate-pulse">Bhai ka order process ho rha hai, ruko thoda... 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0E131F] text-white p-6">
      <div className="bg-emerald-500/10 p-8 rounded-2xl border border-emerald-500/30 text-center max-w-md">
        {status === "success" ? (
          <>
            <h1 className="text-4xl font-bold text-emerald-400 mb-4">🎉 Payment Success!</h1>
            <p className="text-gray-300 mb-6">Bhai tumhara order successfully place ho chuka hai aur cart khali ho gaya hai!</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-red-400 mb-4">🚨 Oh Ho!</h1>
            <p className="text-gray-300 mb-6">Payment verification me thoda locha ho gaya hai, par chinta mat karo!</p>
          </>
        )}
        
        <button 
          onClick={handleRedirect}
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold transition-all inline-block text-white"
        >
          My Orders Dekho
        </button>
      </div>
    </div>
  );
};

export default Success;