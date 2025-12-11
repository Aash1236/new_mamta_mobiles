"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Image
import { ArrowLeft, Eye, X, MapPin, Phone, Mail, Package, Clock, Truck, CheckCircle, XCircle, Printer } from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string; // ✅ Added Image support
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // LIVE UPDATES
  useEffect(() => {
    fetchOrders(); 
    const interval = setInterval(() => fetchOrders(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        // Sort Newest First
        const sortedOrders = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    // Optimistic Update
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      
      if (res.ok) {
        toast.success("Status Updated");
      } else {
        toast.error("Update failed");
        fetchOrders(true); // Revert
      }
    } catch (e) {
      toast.error("Network error");
      fetchOrders(true); // Revert
    }
  };

  const printInvoice = (order: Order) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const invoiceContent = `
      <html>
        <head>
          <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #006a55; }
            .invoice-details { text-align: right; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #888; margin-bottom: 10px; }
            table { w-full; width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px; background: #f9fafb; font-size: 12px; text-transform: uppercase; }
            td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #006a55; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #aaa; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">MAMTA MOBILES</div>
            <div class="invoice-details">
              <p><strong>Invoice #${order._id.slice(-6).toUpperCase()}</strong></p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Bill To</div>
            <p><strong>${order.customer?.firstName} ${order.customer?.lastName}</strong></p>
            <p>${order.customer?.address}</p>
            <p>${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}</p>
            <p>Phone: ${order.customer?.phone}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style="text-align:right">Price</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align:right">₹${item.price.toLocaleString()}</td>
                  <td style="text-align:right">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total Amount: ₹${order.totalAmount?.toLocaleString()}
          </div>

          <div class="footer">
            Thank you for shopping with Mamta Mobiles!<br/>
            Contact us: support@mamtamobiles.com
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  if (loading && orders.length === 0) return <div className="h-screen flex items-center justify-center text-[#006a55] font-bold animate-pulse">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Updates • {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <Link href="/admin" className="text-[#006a55] font-bold hover:underline text-sm">
            Back to Dashboard
          </Link>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-gray-700">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-gray-800">{order.customer?.firstName} {order.customer?.lastName}</td>
                  <td className="p-4 text-[#006a55] font-bold">₹{order.totalAmount?.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="relative inline-block w-full min-w-[140px]">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`
                            appearance-none w-full px-4 py-2 rounded-lg text-xs font-bold border-2 cursor-pointer outline-none transition-all
                            ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100 hover:border-green-200' :
                              order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100 hover:border-red-200' :
                              order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-100 hover:border-yellow-200'}
                          `}
                        >
                          <option value="Pending">🕒 Pending</option>
                          <option value="Processing">⚙️ Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 mx-auto"
                    >
                      <Eye className="w-3 h-3" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ ENHANCED DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up overflow-hidden max-h-[90vh] overflow-y-auto">
              
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
  <div className="flex items-center gap-4">
    <h3 className="font-bold text-lg text-gray-900">Delivery Details</h3>
    {/* ✅ NEW: Print Button */}
    <button 
      onClick={() => selectedOrder && printInvoice(selectedOrder)}
      className="flex items-center gap-1 text-xs font-bold text-[#006a55] border border-[#006a55] px-3 py-1 rounded-full hover:bg-[#006a55] hover:text-white transition-all"
    >
      <Printer className="w-3 h-3" /> Print Invoice
    </button>
  </div>
  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full">
    <X className="w-5 h-5 text-gray-500" />
  </button>
</div>

              <div className="p-6 space-y-6">
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Package className="w-4 h-4"/></div>
                    <div><p className="text-xs text-gray-400 font-bold uppercase">Customer</p><p className="font-bold">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Phone className="w-4 h-4"/></div>
                    <div><p className="text-xs text-gray-400 font-bold uppercase">Phone</p><p className="font-bold font-mono">{selectedOrder.customer?.phone}</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center"><Mail className="w-4 h-4"/></div>
                    <div><p className="text-xs text-gray-400 font-bold uppercase">Email</p><p className="font-bold">{selectedOrder.customer?.email}</p></div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Shipping Address</p>
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {selectedOrder.customer?.address}<br/>
                      {selectedOrder.customer?.city}, {selectedOrder.customer?.state}<br/>
                      <span className="font-bold text-black">PIN: {selectedOrder.customer?.pincode}</span>
                    </p>
                  </div>
                </div>

                {/* ✅ VISIBLE PRODUCTS SECTION */}
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-2">Items to Pack</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-4 border-b border-gray-100 last:border-0 pb-3">
                        {/* Product Image */}
                        <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                           {item.image ? (
                             <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                           )}
                        </div>
                        {/* Product Info */}
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm line-clamp-2">{item.name}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                            <span className="text-sm font-bold text-[#006a55]">₹{item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-extrabold text-[#006a55] text-lg">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}