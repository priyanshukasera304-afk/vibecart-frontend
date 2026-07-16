import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 👈 API call karne ke liye Axios import kiya

function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 👈 Button loading state handle karne ke liye

  // Calculation logic
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? "FREE" : subtotal === 0 ? "₹0" : "₹150";
  const total = subtotal > 5000 ? subtotal : subtotal + (subtotal === 0 ? 0 : 150);

  // 💳 PAYMENT CHECKOUT HANDLER (Stripe Integration)
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Auth check karne ke liye token uthaya
      
      if (!token) {
        alert("Bhai, payment karne se pehle login to kar lo! 😉");
        navigate('/login');
        return;
      }

      // Backend ko API call bheji (Hum cartItems bhej rahe hain taaki Stripe pricing read kar sake)
      // Node.js localhost port 3000 par run ho raha hai to hum wahi URL use karenge
    const response = await axios.post(
  'https://vibecart-backend-yaml...com/api/payment/create-checkout-session', // 🎯 Apne asli deploy kiye hue backend ka live URL yahan daalo!
  { cartItems: cartItems },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      // Agar backend se secure Checkout Session URL mil jata hai
      if (response.data && response.data.url) {
        window.location.href = response.data.url; // 🚀 User ko Stripe Checkout Page par bhej do!
      } else {
        alert("Locha ho gaya bhai! Checkout URL nahi mil paya.");
      }

    } catch (error) {
      console.error("Payment checkout error:", error);
      alert(error.response?.data?.message || "Payment proceed karne me locha ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#FAF8F2] px-4">
        <div className="text-center max-w-md">
          <p className="text-xs uppercase tracking-widest text-[#706E64] mb-6 font-semibold">
            Aapka Bag Ek Dum Khali Hai Bhai!
          </p>
          <h2 className="text-xl font-serif uppercase tracking-tight text-[#23221E] mb-8">
            Add premium essentials to express your modern aesthetic.
          </h2>
          <button 
            onClick={() => navigate('/')} 
            className="px-8 py-4 bg-[#1C1B17] text-[#FAF8F2] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2E2C26] transition-all duration-300 active:scale-95 shadow-sm"
          >
            Shop The Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 lg:py-24">
        
        {/* Header Title Section */}
        <div className="mb-12 pb-6 border-b border-[#EFECE3] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#23221E] tracking-tight font-serif uppercase">
              Shopping Bag
            </h1>
            <p className="text-[#706E64] text-xs uppercase tracking-widest mt-1.5">
              Review your curated items before checkout.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#706E64] bg-[#FAF8F2] border border-[#EFECE3] px-4 py-2 rounded-full">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items Selected
          </span>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 📦 Left Side: Items List Container (Takes 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item._id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white border border-[#EFECE3] p-5 rounded-2xl transition-all duration-300 hover:border-[#23221E]/30"
              >
                {/* Image Holder */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FAF8F2] rounded-xl overflow-hidden flex items-center justify-center p-3 flex-shrink-0 border border-[#FAF8F2]">
                  <img 
                    src={item.imageUrl || item.productImage || item.image} 
                    alt={item.name} 
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Info Metadata */}
                <div className="flex-1 w-full min-w-0 flex flex-col justify-between h-full py-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#23221E] uppercase tracking-tight truncate font-sans">
                        {item.name}
                      </h3>
                      <span className="text-sm font-black text-[#23221E] whitespace-nowrap">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    <p className="text-xs text-[#706E64] uppercase tracking-wider font-semibold mt-1">
                      Quantity: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  
                  {/* Remove Button Wrapper */}
                  <div className="mt-4 sm:mt-6 pt-2 flex items-center justify-between border-t border-[#FAF8F2]">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-700 transition-colors flex items-center space-x-1"
                    >
                      <span>✕</span> <span>Remove Item</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🧾 Right Side: Minimal Summary Card (Takes 5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-[#FAF8F2] border border-[#EFECE3] p-8 rounded-3xl">
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#23221E] mb-6 pb-2 border-b border-[#EFECE3]/60">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xs uppercase tracking-wider font-semibold text-[#706E64]">
                  <span>Subtotal</span>
                  <span className="text-[#23221E] font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider font-semibold text-[#706E64]">
                  <span>Estimated Shipping</span>
                  <span className="text-[#23221E] font-bold">{shipping}</span>
                </div>
                
                {subtotal < 5000 && (
                  <p className="text-[10px] text-[#706E64] italic pt-1">
                    💡 Spend ₹{5000 - subtotal} more for **FREE Shipping** bhai!
                  </p>
                )}
              </div>

              {/* Grand Total */}
              <div className="border-t border-[#EFECE3] pt-5 mb-8 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#23221E] uppercase tracking-tight">Total Amount</span>
                <span className="text-xl font-black text-[#23221E]">₹{total}</span>
              </div>

              {/* Action Button */}
              {/* Button me loading condition aur disabled flag lagaya h taaki double tap pr payment crash na ho */}
              <button
                onClick={handleCheckout} 
                disabled={loading}
                className="w-full bg-[#1C1B17] text-[#FAF8F2] py-4 rounded-xl text-xs tracking-widest font-bold uppercase hover:bg-[#2E2C26] transition-all duration-300 shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "PROCEEDING TO PAYMENT..." : "PROCEED TO CHECKOUT"}
              </button>
              
              {/* Back to browsing hook */}
              <div className="mt-4 text-center">
                <Link to="/" className="text-[10px] uppercase tracking-widest text-[#706E64] font-bold hover:text-[#23221E] transition-colors inline-block pt-1 border-b border-transparent hover:border-[#23221E]">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;