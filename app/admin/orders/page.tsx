"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Eye, 
  Calendar, 
  User, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Tag, 
  Image as ImageIcon, 
  Menu, 
  ShieldCheck 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Optimistic UI Update
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success("Order Status Updated");
      } else {
        toast.error("Failed to update");
        fetchOrders(); // Revert
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#006a55]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-6xl">
        
        {/* --- CENTERED HEADER SECTION --- */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-8">
          
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Manage your store inventory, users, and track orders from one central hub.
            </p>
          </div>

          {/* Row 1: Management Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/admin/products">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55]/20 hover:border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <Package className="w-5 h-5" /> Products
              </button>
            </Link>
            
            <Link href="/admin/users">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55]/20 hover:border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <ShieldCheck className="w-5 h-5" /> Users
              </button>
            </Link>

            <Link href="/admin/brands">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55]/20 hover:border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <Tag className="w-5 h-5" /> Brands
              </button>
            </Link>

            <Link href="/admin/banners">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55]/20 hover:border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <ImageIcon className="w-5 h-5" /> Banners
              </button>
            </Link>

            <Link href="/admin/navigation">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55]/20 hover:border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <Menu className="w-5 h-5" /> Navigation
              </button>
            </Link>
          </div>

          {/* Row 2: Primary Actions */}
          <div className="flex items-center gap-4">
            <Link href="/admin/add-product">
              <button className="flex items-center gap-2 bg-[#006a55] text-white px-8 py-3 rounded-full font-bold hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 active:scale-95">
                <Plus className="w-5 h-5" /> Add New Product
              </button>
            </Link>

            <Link href="/">
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#006a55] font-bold px-6 py-3 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Store
              </button>
            </Link>
          </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Orders</h3>
            <p className="text-4xl font-extrabold text-[#006a55]">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
            <p className="text-4xl font-extrabold text-[#006a55]">
              ₹{orders.reduce((acc, order) => acc + order.totalAmount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Pending Orders</h3>
            <p className="text-4xl font-extrabold text-orange-500">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </div>
        </div>

        {/* --- ORDERS TABLE --- */}
        <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#006a55] text-white">
                <tr>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Total</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Status</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                      No orders found yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-600 font-mono">
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                      </td>
                      <td className="p-4 text-sm font-bold text-[#006a55]">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      
                      {/* STATUS DROPDOWN */}
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 outline-none cursor-pointer ${
                            order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <Link href={`/order-success/${order._id}`}>
                          <button className="inline-flex items-center gap-1 text-xs font-bold text-[#006a55] border-2 border-[#006a55]/20 hover:border-[#006a55] px-4 py-1.5 rounded-lg transition-all">
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}