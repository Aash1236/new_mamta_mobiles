"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Eye, Calendar, User, Loader2, ArrowLeft, Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // Import Toast

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // --- NEW: Handle Status Change ---
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Optimistic UI Update (Change it immediately on screen)
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
        fetchOrders(); // Revert on failure
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-[#006a55]" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage orders and products.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/products">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <Package className="w-5 h-5" /> Products
              </button>
            </Link>
            <Link href="/admin/add-product">
              <button className="flex items-center gap-2 bg-[#006a55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 active:scale-95">
                <Plus className="w-5 h-5" /> Add New
              </button>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:bg-[#006a55]/5 border-2 border-transparent hover:border-[#006a55] px-5 py-2.5 rounded-xl transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Store
            </Link>
            {/* USERS BUTTON (New) */}
            <Link href="/admin/users">
              <button className="flex items-center gap-2 bg-white text-[#006a55] border-2 border-[#006a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#006a55] hover:text-white transition-all active:scale-95 shadow-sm">
                <User className="w-5 h-5" /> Users
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Orders Table */}
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
                {orders.map((order) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}