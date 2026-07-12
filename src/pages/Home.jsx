import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 🎯 URL query read karne ke liye useLocation lagaya
import API from '../api/axios';
import { toast } from 'react-hot-toast';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const location = useLocation(); // 🎯 Isse hume URL ka path aur query mil jayegi

  // 1. Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products/all');
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.products)) {
          data = res.data.products;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        }
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const handleScroll = () => {
      if (window.scrollY > 400) { setShowScrollTop(true); } 
      else { setShowScrollTop(false); }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. 🎯 URL Search Parameter Listener (Real-time Filter)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search') || '';

    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [location.search, products]); // Jab bhi URL change hoga ya product load honge, ye chalega

  // 3. Email Notify Capture Function
// 🎯 Real Email Notify capture via Formspree
  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("VALID EMAIL ID ENTER KARO BHAI!");
      return;
    }

    try {
      // 🚀 Tumhara live Formspree endpoint yahan connect ho gaya hai bhai
      const response = await fetch('https://formspree.io/f/xeeyjrwj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        toast.success("WELCOME TO THE CLUB! EARLY ACCESS GRANTED. ⚡");
        setEmail(''); // Form input clear karne ke liye
      } else {
        toast.error("KUCH GADBAD HUI, DOBAARA TRY KARO!");
      }
    } catch (error) {
      console.error("Email submission error:", error);
      toast.error("SERVER CONNECTION FAILED!");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1C1B17] overflow-x-hidden flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        <div className="relative bg-[#1C1B17] h-[75vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#706E64] blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#EFECE3] blur-[130px] animate-[pulse_6s_ease-in-out_infinite_1s]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 w-full z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-left select-none">
              <span className="inline-block text-[11px] font-bold tracking-[0.25em] text-[#FAF8F2] uppercase bg-[#33312B] px-3 py-1.5 rounded opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
                New Drop / Summer 2026
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-[#FAF8F2] tracking-tight uppercase leading-[0.95] font-serif opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
                DROP THE ORDINARY. <br />
                <span className="text-[#A19E95] relative inline-block">CHOOSE THE VIBE.</span>
              </h1>
              <p className="text-sm text-[#FAF8F2]/70 max-w-md font-medium tracking-wide leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                Premium streetwear, high-end aesthetics, and curated essentials. Engineered for those who set the trend, not follow it.
              </p>
              <div className="pt-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                <a href="#shop-collection" className="inline-block bg-[#FAF8F2] text-[#1C1B17] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#EFECE3] hover:scale-[1.02] transition-all duration-300 shadow-lg">
                  Explore Collection ↓
                </a>
              </div>
            </div>
            <div className="hidden md:flex justify-end select-none pointer-events-none opacity-0 scale-95 animate-[fadeIn_1.2s_ease-out_0.4s_forwards]">
              <div className="text-right text-[#FAF8F2]/5 font-serif text-[120px] font-black leading-none uppercase tracking-tighter">
                VIBE<br />CART<br />™
              </div>
            </div>
          </div>
        </div>

        {/* POLICY BRAND VALUES */}
        <div className="border-b border-[#EFECE3] bg-white py-8">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {['⚡ Free Delivery', '✨ Premium Grade', '🛡️ Secure Checkout', '🔄 Easy Returns'].map((item, index) => (
              <div key={index} className="space-y-1 group cursor-default">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1C1B17] group-hover:translate-y-[-2px] transition-transform duration-300">{item}</h4>
                <p className="text-[11px] font-medium text-[#706E64] uppercase">Curated Service Policy</p>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN PRODUCTS SECTION */}
        <div id="shop-collection" className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 border-b border-[#EFECE3] pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase font-serif text-[#1C1B17]">Curated Masterpieces</h2>
              <p className="text-xs uppercase tracking-widest text-[#706E64] mt-1 font-medium">Handpicked gear crafted for the modern lifestyle.</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A19E95] bg-white border border-[#EFECE3] px-4 py-2 rounded-xl">
              Showing {filteredProducts.length} Products
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-xs uppercase tracking-widest font-bold text-[#706E64] animate-pulse">Loading Products Inventory...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-2">
              <div className="text-xs uppercase tracking-widest font-bold text-[#A19E95]">KUCH NAHI MILA BHAI!</div>
              <p className="text-[11px] uppercase font-medium text-[#706E64]">Apni search query ya keyword badal kar try karo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`} className="group bg-white border border-[#EFECE3] rounded-2xl p-4 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(28,27,23,0.06)] hover:translate-y-[-4px] transition-all duration-300">
                  <div>
                    <div className="relative w-full aspect-square bg-[#FAF9F5] rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                      {(product.image || product.productImage || product.imageUrl) ? (
                        <img src={product.image || product.productImage || product.imageUrl} alt={product.name} className="object-contain w-4/5 h-4/5 group-hover:scale-[1.04] transition-transform duration-500 ease-out" />
                      ) : (
                        <div className="text-[10px] font-bold text-[#A19E95] uppercase tracking-widest">No Image Provided</div>
                      )}
                    </div>
                    <div className="space-y-1 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A19E95]">{product.category || "Essentials"}</span>
                      <h3 className="text-base font-bold text-[#1C1B17] tracking-wide group-hover:text-[#706E64] transition-colors line-clamp-1">{product.name}</h3>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#FAF9F5] flex justify-between items-center px-1">
                    <span className="text-base font-extrabold font-sans text-[#1C1B17]">₹{product.price}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1C1B17] border-b-2 border-[#1C1B17] pb-0.5 group-hover:pr-2 transition-all">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CINEMATIC LOOKBOOK BANNER */}
        <div className="bg-[#1C1B17] text-[#FAF8F2] py-24 my-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(112,110,100,0.15)_0%,transparent_60%)]"></div>
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#A19E95] uppercase">Style Statement</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase font-serif tracking-tight max-w-3xl mx-auto leading-tight">"Simplicity is the ultimate sophistication."</h2>
            <p className="text-xs text-[#FAF8F2]/60 uppercase tracking-widest max-w-md mx-auto font-medium">Cut from premium fabrics, engineered for standard fits, and designed to match deep high-contrast tones.</p>
          </div>
        </div>

        {/* TRENDING CATEGORIES */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Streetwear Mesh', 'Minimal Essentials', 'Premium Accents'].map((cat, i) => (
              <div key={i} className="group relative h-[200px] bg-white border border-[#EFECE3] rounded-3xl p-8 flex flex-col justify-between overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-[#1C1B17] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A19E95]">0{i+1} / Category</span>
                  <h4 className="text-xl font-bold uppercase tracking-wide mt-2 text-[#1C1B17] group-hover:text-[#FAF8F2] transition-colors duration-300">{cat}</h4>
                </div>
                <div className="relative z-10 text-xs font-bold uppercase tracking-widest text-[#1C1B17] group-hover:text-[#FAF8F2] transition-colors duration-300 border-b border-[#1C1B17] w-fit pb-0.5">Explore Lane →</div>
              </div>
            ))}
          </div>
        </div>

        {/* VIBE CLUB NEWSLETTER FORM INTEGRATED */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-24 pt-12">
          <div className="bg-white border border-[#EFECE3] rounded-[32px] p-8 sm:p-16 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black uppercase font-serif tracking-tight text-[#1C1B17]">Join the VIBE™ Club</h3>
              <p className="text-xs text-[#706E64] font-medium tracking-wide">Subscribe to get early access to restocks, collections, and drops.</p>
            </div>
            <form onSubmit={handleNotifySubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL..." 
                className="bg-[#FAF9F5] border border-[#EFECE3] text-xs font-bold uppercase tracking-widest rounded-xl px-5 py-4 w-full sm:w-[300px] focus:outline-none focus:border-[#1C1B17]" 
              />
              <button type="submit" className="bg-[#1C1B17] text-[#FAF8F2] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#33312B] transition-colors">Notify Me</button>
            </form>
          </div>
        </div>
      </div>

      {/* PREMIUM FOOTER */}
      <footer className="bg-[#1C1B17] text-[#FAF8F2] border-t border-[#33312B] pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#33312B] pb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-widest font-serif">VIBECART™</h3>
            <p className="text-xs text-[#FAF8F2]/60 leading-relaxed font-medium">Premium clothing and aesthetic accessories designed to upgrade your daily rotation.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#A19E95] mb-4">Shop Directory</h4>
            <ul className="space-y-2 text-xs text-[#FAF8F2]/70 font-semibold">
              <li className="hover:text-white cursor-pointer transition-colors">All Streetwear</li>
              <li className="hover:text-white cursor-pointer transition-colors">Oversized Tees</li>
              <li className="hover:text-white cursor-pointer transition-colors">Minimal Caps</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#A19E95] mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-[#FAF8F2]/70 font-semibold">
              <li className="hover:text-white cursor-pointer transition-colors">Track Your Order</li>
              <li className="hover:text-white cursor-pointer transition-colors">Easy Exchange</li>
              <li className="hover:text-white cursor-pointer transition-colors">Secure Helplines</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#A19E95] mb-4">Our Base</h4>
            <p className="text-xs text-[#FAF8F2]/70 leading-relaxed font-semibold">Lucknow Hub,<br />Uttar Pradesh, India</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#FAF8F2]/40 font-bold uppercase tracking-wider">
          <p>© 2026 VIBECART Studio. All Rights Reserved.</p>
          <p>Engineered for the Trendsetters.</p>
        </div>
      </footer>

      {/* BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-[#1C1B17] text-[#FAF8F2] border border-[#33312B] p-4 rounded-xl shadow-2xl hover:bg-[#FAF8F2] hover:text-[#1C1B17] transition-all duration-300 z-50 text-xs font-bold uppercase tracking-widest active:scale-95 animate-[fadeIn_0.3s_ease-out]">
          ↑ Top
        </button>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Home;