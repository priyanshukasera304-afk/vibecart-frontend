import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartCount } = useCart(); 
  const navigate = useNavigate();
  const location = useLocation(); // URL change track karne ke liye
  
  // State taaki token aur role instantly component re-render karein
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [searchQuery, setSearchQuery] = useState('');

  // Jab bhi user login/logout kare ya page change ho, state sync ho jaye
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      navigate('/'); 
    } else {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`); 
    }
  };

  return (
    <nav className="w-full bg-white border-b border-[#EFECE3] px-4 sm:px-6 py-4 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* 1. Brand Logo & Action Links Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link to="/" className="text-xl font-bold text-[#23221E] tracking-tighter uppercase font-serif hover:opacity-80 transition-opacity">
              VibeCart
            </Link>
          </div>

          {/* 🎯 Links Jo Pehle Mobile Par Hide Ho Rahe The, Ab Wrap Hokar Dikhenge */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#23221E]">
            <Link to="/" className="hover:text-[#706E64] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#23221E] hover:after:w-full after:transition-all">
              New
            </Link>

            {/* Dynamic Rendering without reload bugs */}
            {token && (
              <>
                {role && role.toLowerCase() === 'admin' ? (
                  <Link to="/admin" className="text-[#D4AF37] hover:opacity-80 transition-opacity font-bold tracking-widest border border-[#D4AF37]/20 px-2 py-0.5 rounded bg-[#D4AF37]/5">
                    Admin
                  </Link>
                ) : (
                  <Link to="/my-orders" className="hover:text-[#706E64] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#23221E] hover:after:w-full after:transition-all">
                    My Orders
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* 2. 🔍 Center Section: Search Bar (Instant Filter Support) */}
        <div className="w-full md:max-w-md flex-1 mx-0 md:mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search premium products..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim() === '') {
                  navigate('/');
                } else {
                  navigate(`/?search=${encodeURIComponent(val.trim())}`);
                }
              }}
              className="w-full bg-[#FAF8F2] text-[#23221E] text-xs px-4 py-2.5 pl-10 border border-[#EFECE3] rounded-full focus:outline-none focus:border-[#23221E] focus:bg-white transition-all placeholder-[#706E64]"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706E64]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </form>
        </div>

        {/* 3. Right Section: Cart & Auth Button */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#23221E] w-full md:w-auto justify-between sm:justify-end">
          <Link to="/cart" className="flex items-center space-x-1.5 hover:text-[#706E64] transition-colors">
            <span>Cart</span>
            <span className="w-5 h-5 bg-[#1C1B17] text-[#FAF8F2] rounded-full flex items-center justify-center font-sans text-[10px] font-bold">
              {cartCount}
            </span>
          </Link>

          {token ? (
            <button 
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 border border-[#23221E] bg-[#1C1B17] text-[#FAF8F2] rounded-lg text-[9px] sm:text-[10px] tracking-widest font-bold hover:bg-white hover:text-[#23221E] transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="px-3 sm:px-4 py-2 bg-[#1C1B17] border border-[#1C1B17] text-[#FAF8F2] rounded-lg text-[9px] sm:text-[10px] tracking-widest font-bold hover:bg-[#FAF8F2] hover:text-[#1C1B17] transition-all duration-300 whitespace-nowrap"
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