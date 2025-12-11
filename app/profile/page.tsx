"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Clock, CheckCircle, Truck, XCircle, LogOut, LayoutDashboard, MapPin, CreditCard, ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";

// Helper Interface for Order Data
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
    price: number;
    quantity: number;
    image: string;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders?email=${userData.email}`);
        if (res.ok) {
          const data = await res.json();
          const sortedOrders = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-[#006a55] font-bold animate-pulse">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
              <p className="text-gray-500 mt-1">Hello, <span className="font-bold text-[#006a55]">{user?.name}</span></p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            
            <div className="flex gap-4">
              {/* ✅ FIXED: Admin Dashboard Button (Only for Admins) */}
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#006a55] text-white rounded-full font-bold hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20">
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </button>
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 border-2 border-red-100 text-red-500 rounded-full font-bold hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#006a55]" /> Order History
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <Link href="/" className="text-[#006a55] font-bold hover:underline mt-2 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Order Summary Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-700">#{order._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Date</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</p>
                    <p className="text-sm font-bold text-[#006a55]">₹{order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Items Preview (First 2 items) */}
                <div className="space-y-4 mb-4">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-400 italic">+ {order.items.length - 2} more items...</p>
                  )}
                </div>

                {/* ✅ View Details Button */}
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="w-full py-2 text-sm font-bold text-gray-500 hover:text-[#006a55] hover:bg-gray-50 rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  View Full Details <ChevronDown className="w-4 h-4" />
                </button>

              </div>
            ))}
          </div>
        )}

        {/* ✅ ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500 font-mono">#{selectedOrder._id.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                
                {/* Status & Payment */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Order Status</p>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Payment Method</p>
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <CreditCard className="w-4 h-4 text-[#006a55]" />
                      {selectedOrder.paymentMethod === "ONLINE" ? "Online Payment" : "Cash on Delivery"}
                    </div>
                  </div>
                </div>

                {/* All Items List */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                           {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-2" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                            <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.customer && (
                  <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> Shipping Address
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-bold">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                      <p>{selectedOrder.customer.email}</p>
                      <p>{selectedOrder.customer.phone}</p>
                      <p>{selectedOrder.customer.address}</p>
                      <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
                    </div>
                  </div>
                )}

                {/* Total Calculation */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-xl font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper for Status Badges
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Processing: "bg-blue-100 text-blue-800 border-blue-200",
    Shipped: "bg-purple-100 text-purple-800 border-purple-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  
  const icons: any = {
    Pending: <Clock className="w-3 h-3" />,
    Processing: <Package className="w-3 h-3" />,
    Shipped: <Truck className="w-3 h-3" />,
    Delivered: <CheckCircle className="w-3 h-3" />,
    Cancelled: <XCircle className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {icons[status]} {status}
    </span>
  );
}