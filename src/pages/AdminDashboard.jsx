import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' ya 'products'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // 📦 Products store karne ke liye
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(null);
  
  // Product Form State (Cloudinary Upload ke liye)
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  // 🔄 Fetch All Dashboard Data (Orders, Analytics & Products)
const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Fetch Analytics Data
      try {
        const analyticsRes = await API.get('/orders/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Analytics load error:", err);
      }

      // 2. Fetch All Orders Data
      try {
        const ordersRes = await API.get('/orders/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data.orders || ordersRes.data);
      } catch (err) {
        console.error("Orders load error:", err);
      }

      // 3. Fetch All Products
      try {
        const productsRes = await API.get('/products'); // 👈 Agar iska endpoint kuch aur hai to check kar lena bhai
        setProducts(productsRes.data.products || productsRes.data);
      } catch (err) {
        console.error("Products inventory load error:", err);
      }

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

  // 🔥 ORDER STATUS UPDATE HANDLER
  const handleStatusChange = async (orderId, newStatus) => {
    setStatusLoading(orderId);
    try {
      const token = localStorage.getItem('token');
      const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

      await API.put('/orders/admin/update-status', 
        { 
          orderId: orderId, 
          id: orderId, 
          status: formattedStatus 
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchDashboardData();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Status update karne me dikkat hui bhai.");
    } finally {
      setStatusLoading(null);
    }
  };

  // 🖼️ PRODUCT IMAGE SELECTION HANDLER
  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  // 🚀 LAUNCH PRODUCT (Form Submission with Cloudinary Upload)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploadingProduct(true);

    try {
      const token = localStorage.getItem('token');
      
      // FormData create kiya dynamic image aur text transfer ke liye
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDesc);
      formData.append('price', productPrice);
      formData.append('category', productCategory);
      formData.append('stock', productStock);
      
      if (productImage) {
        formData.append('image', productImage); // Config key 'image' ke matching
      }

      await API.post('/products/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      alert("Bawal! Product real photo ke saath add ho gaya bhai! 🚀");
      
      // Reset Form fields
      setProductName('');
      setProductDesc('');
      setProductPrice('');
      setProductCategory('');
      setProductStock('');
      setProductImage(null);
      
      // State refresh taaki product table me instantly naya data dikhe
      await fetchDashboardData();
    } catch (err) {
      console.error("Error creating product:", err);
      alert(err.response?.data?.message || "Product create karne me locha ho gaya!");
    } finally {
      setUploadingProduct(false);
    }
  };

  // 🗑️ DELETE PRODUCT HANDLER
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bhai, kya sach me ye product delete karna hai?")) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/products/delete/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Product successfully Deleted!");
        await fetchDashboardData();
      } catch (err) {
        console.error("Delete product error:", err);
        alert("Product delete karne me server error aa gaya!");
      }
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
      <div className="border-b border-[#EFECE3] pb-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif uppercase tracking-tight text-[#23221E]">
            Admin Sahab, Welcome Back! 🔥
          </h1>
          <p className="text-xs text-[#706E64] mt-2 uppercase tracking-wider">
            {analytics?.message || "Dukan ki report haazir hai!"}
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex gap-2 bg-[#FAF8F2] border border-[#EFECE3] p-1.5 rounded-xl">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all duration-200 ${activeTab === 'orders' ? 'bg-[#1C1B17] text-[#FAF8F2]' : 'text-[#706E64] hover:text-[#1C1B17]'}`}
          >
            Orders & Analytics
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all duration-200 ${activeTab === 'products' ? 'bg-[#1C1B17] text-[#FAF8F2]' : 'text-[#706E64] hover:text-[#1C1B17]'}`}
          >
            Manage Products
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS & ANALYTICS */}
      {activeTab === 'orders' && (
        <div className="space-y-12">
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Live Orders Management Table */}
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
      )}

      {/* TAB 2: MANAGE PRODUCTS (Add + Delete Products) */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Form to Add New Product */}
          <div className="lg:col-span-1 bg-[#FAF8F2] border border-[#EFECE3] p-6 rounded-2xl h-fit space-y-6">
            <h2 className="text-md font-bold font-serif uppercase tracking-tight text-[#23221E] border-b border-[#EFECE3] pb-2">
              Launch New Product 🚀
            </h2>
            
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#706E64] uppercase tracking-wider text-[10px]">Product Name</label>
                <input 
                  type="text" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  required 
                  placeholder="e.g. Premium Gym Shaker" 
                  className="w-full p-3 bg-white border border-[#EFECE3] rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#706E64] uppercase tracking-wider text-[10px]">Description</label>
                <textarea 
                  value={productDesc} 
                  onChange={(e) => setProductDesc(e.target.value)} 
                  placeholder="Describe the aesthetic and specs of item..." 
                  rows="3"
                  className="w-full p-3 bg-white border border-[#EFECE3] rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#706E64] uppercase tracking-wider text-[10px]">Price (₹)</label>
                  <input 
                    type="number" 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                    required 
                    placeholder="999" 
                    className="w-full p-3 bg-white border border-[#EFECE3] rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#706E64] uppercase tracking-wider text-[10px]">Stock</label>
                  <input 
                    type="number" 
                    value={productStock} 
                    onChange={(e) => setProductStock(e.target.value)} 
                    required 
                    placeholder="50" 
                    className="w-full p-3 bg-white border border-[#EFECE3] rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#706E64] uppercase tracking-wider text-[10px]">Category</label>
                <input 
                  type="text" 
                  value={productCategory} 
                  onChange={(e) => setProductCategory(e.target.value)} 
                  placeholder="Gym Gears" 
                  className="w-full p-3 bg-white border border-[#EFECE3] rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              {/* File Input */}
              <div className="space-y-1">
                <label className="font-bold text-[#706E64] uppercase tracking-wider text-[10px]">Product Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required
                  className="w-full text-[11px] text-[#706E64] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-[#1C1B17] file:text-[#FAF8F2] cursor-pointer"
                />
              </div>

              <button 
                type="submit" 
                disabled={uploadingProduct} 
                className="w-full bg-[#1C1B17] text-white p-3.5 rounded-xl uppercase tracking-widest font-bold hover:bg-[#32312C] transition disabled:opacity-50 text-[10px]"
              >
                {uploadingProduct ? "Uploading to Cloudinary..." : "Launch on VibeCart 🚀"}
              </button>
            </form>
          </div>

          {/* Active Product Inventory List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-md font-bold font-serif uppercase tracking-tight text-[#23221E] border-b border-[#EFECE3] pb-2">
              Product Inventory ({products.length})
            </h2>

            {products.length === 0 ? (
              <p className="text-xs uppercase tracking-widest text-[#706E64]">No products live in database right now.</p>
            ) : (
              <div className="overflow-x-auto border border-[#EFECE3] rounded-2xl bg-[#FAF8F2]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#EFECE3] bg-[#FAF8F2] text-[#706E64] font-bold uppercase tracking-wider">
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE3] bg-[#FAF8F2] text-[#23221E]">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-[#FAF6EC] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          {/* Image Preview */}
                          <div className="w-10 h-10 bg-white border border-[#EFECE3] rounded-lg overflow-hidden flex-shrink-0 p-0.5">
                            <img src={prod.imageUrl || prod.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <span className="font-bold text-[#1C1B17] truncate max-w-[150px]">{prod.name}</span>
                        </td>
                        <td className="p-4 text-[#706E64] font-medium uppercase tracking-wider text-[10px]">{prod.category || 'N/A'}</td>
                        <td className="p-4 font-bold">₹{prod.price}</td>
                        <td className="p-4 text-slate-600">{prod.stock || 0} left</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;