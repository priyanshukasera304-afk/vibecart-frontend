import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // 👈 Apna Axios Instance Import Kiya
import { toast } from 'react-hot-toast'; // 👈 Premium Popups ke liye Import kiya

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 🎯 1. Login API Call
        const response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Token aur Role ko browser mein save karna
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        
        // 🔥 Premium Success Popup for Login
        toast.success('WELCOME BACK, VIBER! 🔥');
        navigate('/'); // Login hote hi seedhe Home page par bhej do
      } else {
        // 🎯 2. Signup/Register API Call
        await API.post('/auth/register', formData);
        
        // 🔥 Premium Success Popup for Registration
        toast.success('ACCOUNT CREATED! AB SIGN IN KARO BHAI 🙌');
        setIsLogin(true); // Signup ke baad automatic login screen par switch
      }
    } catch (err) {
      // 🔥 Catch blocks ke browser warnings hata kar elegant Toast error triggers
      const errorMsg = err.response?.data?.message || 'Something went wrong brother, try again!';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#EFECE3] rounded-3xl p-8 shadow-[0_8px_30px_rgb(239,236,227,0.4)]">
        
        <div className="flex flex-col items-center mb-6">
          <div className="px-4 py-2 rounded-xl bg-[#1C1B17] text-[#FAF8F2] font-bold text-lg tracking-tight shadow-sm">
            VibeCart
          </div>
          <h2 className="text-2xl font-bold text-[#23221E] tracking-tight mt-4">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#23221E] uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Vivek Kumar" className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#EFECE3] rounded-xl text-sm focus:outline-none focus:border-[#23221E]" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-[#23221E] uppercase tracking-wider mb-1.5">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#EFECE3] rounded-xl text-sm focus:outline-none focus:border-[#23221E]" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#23221E] uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#EFECE3] rounded-xl text-sm focus:outline-none focus:border-[#23221E]" required />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#1C1B17] hover:bg-[#2E2C26] text-[#FAF8F2] font-medium rounded-xl text-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => { setIsLogin(!isLogin); }} className="text-xs text-[#706E64] hover:text-[#23221E] font-medium">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;