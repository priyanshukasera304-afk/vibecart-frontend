import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://vibecart-backend-yame.onrender.com/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-[#EBF7EE] text-[#1E6636] border-[#D1F0DA]';
      case 'SHIPPED':
        return 'bg-[#E8F1FF] text-[#1A4FA3] border-[#D1E3FF]';
      case 'PENDING':
        return 'bg-[#FFF7E6] text-[#A36A00] border-[#FFE6B3]';
      case 'CANCELLED':
        return 'bg-[#FDF2F2] text-[#A82222] border-[#FBD5D5]';
      default:
        return 'bg-[#F4F4F5] text-[#4F4F52] border-[#E4E4E7]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
        <div className="text-sm uppercase tracking-widest font-bold text-[#706E64] animate-pulse">
          Loading Order History...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-[#EFECE3] pb-6 mb-12">
          <h1 className="text-3xl font-extrabold text-[#1C1B17] tracking-tight uppercase font-serif">
            My Orders History
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#706E64] mt-2 font-medium">
            Tumne abhi tak kul <span className="font-bold text-[#1C1B17] text-sm">{orders.length}</span> orders kiye hain bhai.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#EFECE3] rounded-2xl p-16 text-center shadow-sm">
            <p className="text-sm uppercase tracking-widest font-semibold text-[#706E64]">
              Abhi tak koi order nahi kiya hai tumne!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white border border-[#EFECE3] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Order Meta Data */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#FAF9F5] pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A19E95] block mb-0.5">
                      Order Reference ID
                    </span>
                    <span className="font-mono text-sm font-bold text-[#1C1B17] bg-[#F5F3EB] px-2.5 py-1 rounded-md">
                      {order._id}
                    </span>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${getStatusStyles(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>

                {/* Products List with Strict URL Verification */}
                <div className="divide-y divide-[#FAF9F5] mb-6">
                  {order.items?.map((item, index) => {
                    const productName = item.productId?.name || item.productId?.title || item.name || 'Premium Item';
                    const price = Number(item.price) || Number(item.productId?.price) || Number(item.priceAtPurchase) || 0;
                    const quantity = Number(item.quantity) || 1;
                    
                    // 🔍 Comprehensive extraction logic for potential database keys
                    const rawImg = item.productId?.image || 
                                   item.productId?.imageUrl || 
                                   item.productId?.img || 
                                   item.productId?.productImage ||
                                   item.image || 
                                   item.imageUrl;

                    // 🛡️ Checks if image link is valid and starts with HTTP/HTTPS to prevent 404 triggers
                    const hasValidImage = rawImg && typeof rawImg === 'string' && (rawImg.startsWith('http://') || rawImg.startsWith('https://'));

                    return (
                      <div key={index} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        
                        {/* Left Content Block */}
                        <div className="flex items-center gap-4 min-w-0">
                          {/* 🖼️ Premium Border-Box Image Wrapper */}
                          <div className="w-16 h-16 bg-[#FAF9F5] border border-[#EFECE3] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                            {hasValidImage ? (
                              <img 
                                src={rawImg} 
                                alt={productName}
                                className="w-full h-full object-contain mix-blend-multiply"
                                onError={(e) => {
                                  // Fallback layout setup in case deployment links act broken live
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            {/* 📦 CSS fallback banner when image path is structurally invalid */}
                            <div 
                              className="text-[10px] uppercase font-bold text-[#A19E95] tracking-widest text-center px-1"
                              style={{ display: hasValidImage ? 'none' : 'flex' }}
                            >
                              VIBE
                            </div>
                          </div>

                          {/* 📝 Name Tags */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-[#1C1B17] tracking-wide truncate">
                                {productName}
                              </span>
                              <span className="text-[10px] font-bold font-sans text-[#706E64] bg-[#F5F3EB] px-2 py-0.5 rounded whitespace-nowrap">
                                x{quantity}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#706E64] mt-0.5 tracking-wider uppercase font-medium">
                              Curated Essential
                            </p>
                          </div>
                        </div>

                        {/* Right Content Block */}
                        <span className="text-sm font-extrabold text-[#1C1B17] font-sans flex-shrink-0">
                          ₹{price * quantity}
                        </span>

                      </div>
                    );
                  })}
                </div>

                {/* Order Footer summary */}
                <div className="bg-[#FAF9F5] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-xs uppercase tracking-wider text-[#706E64] font-medium">
                    Payment Method: <span className="font-bold text-[#1C1B17]">{order.paymentMethod || 'COD'}</span>
                  </div>
                  <div className="flex items-baseline gap-2 sm:self-end">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#706E64]">
                      Total Paid:
                    </span>
                    <span className="text-xl font-black text-[#1C1B17] font-sans tracking-tight">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;