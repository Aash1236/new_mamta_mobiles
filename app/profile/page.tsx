"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Package, Eye, Calendar, Loader2, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Get from sessionStorage
    const storedUser = sessionStorage.getItem("user_info");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    async function fetchUserOrders() {
      try {
        const res = await fetch("/api/orders/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchUserOrders();
  }, [router]);

  const handleLogout = () => {
    // ✅ Clear sessionStorage
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user_info");
    
    fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* User Info & Admin Button */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm h-fit space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#006a55]/10 rounded-full flex items-center justify-center text-[#006a55] mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              {user.role === 'admin' && (
                <span className="mt-2 bg-[#006a55] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> ADMIN
                </span>
              )}
            </div>
            
            {user.role === 'admin' && (
              <Link href="/admin/orders">
                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors mb-2 shadow-lg shadow-gray-900/20">
                  <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                </button>
              </Link>
            )}

            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold border-2 border-red-100 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* Orders Section (Same as before) */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Order History</h2>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-[#006a55]" /></div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border-2 border-gray-100 shadow-sm text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h3>
                <button onClick={() => router.push("/")} className="bg-[#006a55] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#005544]">Start Shopping</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white p-5 rounded-xl border-2 border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Order ID</p>
                        <p className="font-mono text-sm font-bold">#{order._id.slice(-6).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date</p>
                        <div className="flex items-center gap-1 text-sm text-gray-700"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <p className="text-lg font-bold text-[#006a55]">₹{order.totalAmount.toLocaleString()}</p>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{order.status}</span>
                        <Link href={`/order-success/${order._id}`}><button className="flex items-center gap-1 bg-[#006a55] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#005544]"><Eye className="w-3 h-3" /> View</button></Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}