import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

// Context create kiya
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('vibeCart');
    return localData ? JSON.parse(localData) : [];
  });

  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    localStorage.setItem('vibeCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      
      setCartItems(prevItems => {
        const exist = prevItems.find(item => item._id === product._id);
        if (exist) {
          return prevItems.map(item =>
            item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });

      showToast(`${product.name} bag me jadd diya gaya bhai!`);

      if (token) {
        await API.post('/cart/add', {
          productId: product._id,
          quantity: quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Cart synced with MongoDB!");
      }
    } catch (err) {
      console.error("Cart sync error:", err);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    showToast(`Item bag se remove kar diya gaya.`);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('vibeCart');
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1C1B17] text-[#FAF8F2] text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl shadow-2xl border border-[#2E2C26] flex items-center space-x-3">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          <span>{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

// Named Export
export function useCart() {
  return useContext(CartContext);
}

// Default Export (Safety Layer taaki Vite error na de)
export default useCart;