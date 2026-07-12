import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartCount } = useCart(); // 👈 Context se data sahi aa raha hai bhai
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      navigate('/'); // Agar khali hai toh main home page par bhej do
    } else {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`); // URL par query parameter bhej diya
    }
  };

  return (
    <nav className="w-full bg-white border-b border-[#EFECE3] px-6 py-4 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Section: Brand Logo & Links */}
        <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-start">
          <Link to="/" className="text-xl font-bold text-[#23221E] tracking-tighter uppercase font-serif hover:opacity-80 transition-opacity">
            VibeCart
          </Link>

          <div className="hidden sm:flex items-center space-x-6 text-xs font-semibold uppercase tracking-widest text-[#23221E]">
            <Link to="/" className="hover:text-[#706E64] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#23221E] hover:after:w-full after:transition-all">
              New
            </Link>

            {/* 🎯 CONDITIONALLY RENDER LINKS BASED ON ROLE */}
            {token && (
              <>
                {role && role.toLowerCase() === 'admin' ? (
                  // Case A: User Admin hai toh Admin panel link dikhao
                  <Link to="/admin" className="text-[#D4AF37] hover:opacity-80 transition-opacity font-bold tracking-widest">
                    Admin
                  </Link>
                ) : (
                  // Case B: Normal authenticated customer ko "My Orders" ka smooth button dikhao
                  <Link to="/my-orders" className="hover:text-[#706E64] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#23221E] hover:after:w-full after:transition-all">
                    My Orders
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* 🔍 Center Section: Premium Sleek Search Bar */}
       {/* 🔍 Center Section: Premium Sleek Search Bar (Instant Filter Support) */}
<div className="w-full md:max-w-md flex-1">
  <form onSubmit={handleSearchSubmit} className="relative w-full">
    <input
      type="text"
      placeholder="Search premium products..."
      value={searchQuery}
      onChange={(e) => {
        const val = e.target.value;
        setSearchQuery(val);
        // 🎯 Jaise hi user type karega, URL instantly update hoga bina enter maare!
        if (val.trim() === '') {
          navigate('/');
        } else {
          navigate(`/?search=${encodeURIComponent(val.trim())}`);
        }
      }}
      className="w-full bg-[#FAF8F2] text-[#23221E] text-xs px-4 py-2.5 pl-10 border border-[#EFECE3] rounded-full focus:outline-none focus:border-[#23221E] focus:bg-white transition-all placeholder-[#706E64]"
    />
    {/* Minimal Search Icon SVG */}
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706E64]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </div>
  </form>
</div>

        {/* Right Section: Cart & Auth */}
        <div className="flex items-center space-x-6 text-xs font-semibold uppercase tracking-widest text-[#23221E] w-full md:w-auto justify-end">
          <Link to="/cart" className="flex items-center space-x-1.5 hover:text-[#706E64] transition-colors">
            <span>Cart</span>
            {/* 🔥 Ab yahan dynamic cartCount chamkega real-time mein */}
            <span className="w-5 h-5 bg-[#1C1B17] text-[#FAF8F2] rounded-full flex items-center justify-center font-sans text-[10px] font-bold">
              {cartCount}
            </span>
          </Link>

          {token ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-[#23221E] bg-[#1C1B17] text-[#FAF8F2] rounded-lg text-[10px] tracking-widest font-bold hover:bg-white hover:text-[#23221E] transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-[#1C1B17] border border-[#1C1B17] text-[#FAF8F2] rounded-lg text-[10px] tracking-widest font-bold hover:bg-[#FAF8F2] hover:text-[#1C1B17] transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;