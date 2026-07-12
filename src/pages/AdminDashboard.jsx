import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]); // 📦 Saare orders store karne ke liye
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(null); // Kis order ka status change ho rha h track krne k liye

  // 🔄 Ek function data fetch karne ke liye taaki status update ke baad analytics refresh ho sake
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Fetch Analytics Data
      const analyticsRes = await API.get('/orders/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(analyticsRes.data);

      // 2. Fetch All Orders Data
      const ordersRes = await API.get('/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordersRes.data.orders || ordersRes.data); // Array backend structure ke hisab se map hoga
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError("Admin data load karne me locha ho gaya bhai!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🔥 STATUS UPDATE HANDLER: Dropdown badalte hi backend hit hoga
const handleStatusChange = async (orderId, newStatus) => {
  setStatusLoading(orderId);
  try {
    const token = localStorage.getItem('token');
    
    // 🎯 FOOLPROOF PAYLOAD: Dono naming conventions aur upper/lower case dynamic mapping
    const payload = {
      orderId: orderId,                     // Case 1: Agar backend orderId dhund rha ho
      id: orderId,                          // Case 2: Agar backend sirf id dhund rha ho
      status: newStatus,                    // lowercase ('shipped')
      statusCapitalized: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), // Capitalized ('Shipped')
      statusUpper: newStatus.toUpperCase()  // UPPERCASE ('SHIPPED')
    };

    // Agar backend strict validation laga rakha hai, toh hum safe side par capitalized bhejte hain 
    // kyuki aamtaur par models me 'Pending', 'Shipped' save hota hai.
    const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

    await API.put('/orders/admin/update-status', 
      { 
        orderId: orderId, 
        id: orderId, 
        status: formattedStatus // 'Pending', 'Shipped', 'Delivered' format me bhej rhe hain
      }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Live refresh taaki table badal jaye
    await fetchDashboardData();
  } catch (err) {
    console.error("Status update error:", err);
    alert("Status update karne me dikkat hui bhai. Ek baar controller check karna padega!");
  } finally {
    setStatusLoading(null);
  }
};

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-[#706E64] animate-pulse">Dukan ki report taiyar ho rhi hai...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="border-b border-[#EFECE3] pb-6 mb-12">
        <h1 className="text-2xl font-bold font-serif uppercase tracking-tight text-[#23221E]">
          Admin Sahab, Welcome Back! 🔥
        </h1>
        <p className="text-xs text-[#706E64] mt-2 uppercase tracking-wider">
          {analytics?.message || "Dukan ki report haazir hai!"}
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-[#FAF8F2] border border-[#EFECE3] p-6 rounded-2xl space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#706E64]">Total Revenue</p>
          <p className="text-3xl font-black text-[#1C1B17] font-sans">₹{analytics?.totalRevenue || 0}</p>
        </div>

        <div className="bg-[#FAF8F2] border border-[#EFECE3] p-6 rounded-2xl space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#706E64]">Total Orders</p>
          <p className="text-3xl font-black text-[#1C1B17] font-sans">{analytics?.totalOrders || 0}</p>
        </div>

        <div className="bg-[#1C1B17] text-[#FAF8F2] p-6 rounded-2xl space-y-2 border border-[#2E2C26]">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#A19E95]">Pending Orders</p>
          <p className="text-3xl font-black font-sans text-amber-400">{analytics?.statusBreakdown?.pending || 0}</p>
        </div>

        <div className="bg-[#FAF8F2] border border-[#EFECE3] p-6 rounded-2xl space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#706E64]">Delivered Orders</p>
          <p className="text-3xl font-black font-sans text-emerald-600">{analytics?.statusBreakdown?.delivered || 0}</p>
        </div>
      </div>

      {/* 📦 Live Orders Management Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold font-serif uppercase tracking-tight text-[#23221E] border-b border-[#EFECE3] pb-3">
          Manage Live Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <p className="text-xs uppercase tracking-widest text-[#706E64]">Abhi tak koi order nahi aaya hai bhai.</p>
        ) : (
          <div className="overflow-x-auto border border-[#EFECE3] rounded-2xl bg-[#FAF8F2]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EFECE3] bg-[#FAF8F2] text-[#706E64] font-bold uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE3] bg-[#FAF8F2] text-[#23221E]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF6EC] transition-colors">
                    <td className="p-4 font-mono font-bold text-[10px]">{order._id}</td>
                    <td className="p-4 font-semibold">{order.shippingAddress?.fullName || order.fullName || 'N/A'}</td>
                    <td className="p-4 font-sans">{order.items?.length || 0} items</td>
                    <td className="p-4 font-bold font-sans">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        order.status === 'pending' || order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'delivered' || order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={order.status} 
                        disabled={statusLoading === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-[#FAF8F2] border border-[#EFECE3] rounded-xl px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#23221E] cursor-pointer disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;