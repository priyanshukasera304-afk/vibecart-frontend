import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext'; // 👈 Global Context Hook

function ProductDetail() {
  const { id } = useParams(); // URL se product ki ID nikalne ke liye
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ⚡ Global Cart Context se addToCart function nikala bhai
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Tumhare backend route '/products/:id' par hit lagega
        const response = await API.get(`/products/${id}`);
        setProduct(response.data.product || response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError('Product details load nahi ho payi bhai!');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // 👈 Asli context state update ho rhi hai ab
    //   alert(`${product?.name} aapke bag mein add ho gaya bhai!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#706E64] animate-pulse">
          Loading Masterpiece...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col gap-4">
        <p className="text-sm font-medium text-red-500">{error || 'Product nahi mila bhai!'}</p>
        <button onClick={() => navigate('/')} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5">
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Back navigation wireframe */}
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center space-x-2 text-xs uppercase tracking-widest text-[#706E64] hover:text-[#23221E] transition-colors"
      >
        <span>←</span> <span>Back to collection</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Product Image Display */}
        <div className="w-full aspect-square bg-[#FAF8F2] border border-[#EFECE3] rounded-3xl overflow-hidden flex items-center justify-center p-8">
          <img 
            src={product.imageUrl || product.productImage || product.image} 
            alt={product.name} 
            className="object-contain w-full h-full max-h-[450px]"
          />
        </div>

        {/* Right Side: Product Info Panel */}
        <div className="flex flex-col h-full justify-center">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#706E64] mb-2 bg-[#FAF8F2] px-3 py-1 rounded-full w-max border border-[#EFECE3]">
            {product.category || "Premium Spec"}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#23221E] tracking-tight font-serif uppercase mb-4 leading-tight">
            {product.name}
          </h1>

          <p className="text-2xl font-black text-[#23221E] mb-6">
            ₹{product.price}
          </p>

          <div className="border-t border-b border-[#EFECE3] py-6 mb-8">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#23221E] mb-2">Description</h3>
            <p className="text-[#504F47] text-sm leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Stock Info & Add to Bag Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 bg-[#1C1B17] text-[#FAF8F2] border border-[#1C1B17] py-4 rounded-xl text-xs tracking-widest font-bold uppercase hover:bg-white hover:text-[#1C1B17] transition-all duration-300 active:scale-[0.98]"
            >
              Add to Bag
            </button>
            
            <div className="text-center sm:text-left text-[11px] text-[#706E64] uppercase tracking-wider font-semibold">
              {product.stock > 0 ? (
                <span className="text-emerald-600">● In Stock ({product.stock} units left)</span>
              ) : (
                <span className="text-red-500">● Out of stock</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;