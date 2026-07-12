import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // 🎉 Success screen handle karne ke liye state
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  });

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalAmount = subtotal > 5000 ? subtotal : subtotal + 150;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const orderPayload = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        fullName: formData.fullName,
        phone: formData.phone,
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        
        paymentMethod: "COD"
      };

      const response = await API.post('/orders/place', orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Order Success Response:", response.data);
      
      // 🌟 MAGIC STEPS: Direct navigate karne ki jagah pehle success card dikhaenge
      clearCart(); 
      setOrderSuccess(true); // Popup active ho jayega
    } catch (err) {
      console.error("Order process error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🏆 SUCCESS POPUP SCREEN (Jab order confirm ho jaye)
  if (orderSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#FAF8F2] border border-[#EFECE3] p-8 rounded-2xl text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-[#1C1B17] text-[#FAF8F2] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-[#23221E]">
              Order Confirmed!
            </h2>
            <p className="text-xs text-[#706E64] leading-relaxed">
              Bawal! Tumhara order successfully confirm ho gaya hai bhai. Humne tumhare items pack karna shuru kar diye hain.
            </p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#1C1B17] text-[#FAF8F2] py-3 rounded-xl text-xs tracking-widest font-bold uppercase hover:bg-[#2E2C26] transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-[#706E64]">Checkout ke liye bag mein items hona zaroori hai bhai!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-2xl font-bold font-serif uppercase tracking-tight text-[#23221E] mb-12 border-b border-[#EFECE3] pb-4">
        Shipping & Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#23221E] block mb-2">Full Name</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#23221E]" placeholder="Rahul Kumar" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#23221E] block mb-2">Phone Number</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#23221E]" placeholder="98765xxxxx" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#23221E] block mb-2">Street Address / Address Line</label>
            <input required type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} className="w-full bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#23221E]" placeholder="Hazratganj, Near Subhash Chowk" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#23221E] block mb-2">City</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#23221E]" placeholder="Lucknow" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#23221E] block mb-2">State</label>
              <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#23221E]" placeholder="Uttar Pradesh" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#23221E] block mb-2">PIN Code</label>
              <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#23221E]" placeholder="226001" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1C1B17] text-[#FAF8F2] py-4 rounded-xl text-xs tracking-widest font-bold uppercase hover:bg-[#2E2C26] transition-all disabled:opacity-50">
            {loading ? "Processing Order..." : "Place Order (Cash on Delivery)"}
          </button>
        </form>

        <div className="lg:col-span-5 bg-[#FAF8F2] border border-[#EFECE3] p-6 rounded-2xl lg:sticky lg:top-24">
          <h2 className="text-xs uppercase tracking-widest font-bold mb-4 text-[#23221E]">Order Items</h2>
          <div className="max-h-[200px] overflow-y-auto space-y-3 mb-4 pr-2">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between text-xs text-[#504F47]">
                <span className="truncate max-w-[70%]">{item.name} <b className="font-sans text-[10px]">x{item.quantity}</b></span>
                <span className="font-bold text-[#23221E]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#EFECE3] pt-4 flex justify-between font-black text-sm text-[#23221E]">
            <span>Total Payable</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;