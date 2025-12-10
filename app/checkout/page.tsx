"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext"; 
import toast, { Toaster } from "react-hot-toast";
import { Loader2, ArrowRight, MapPin, Phone, Mail, User, ShieldCheck, Truck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ✅ LOGIC FIX: Includes 'pincode' and 'state'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    pincode: "", 
    state: "",   
    phone: "",
  });

  useEffect(() => {
    // ✅ LOGIC FIX: Check BOTH LocalStorage & SessionStorage
    let storedUser = null;
    if (typeof window !== 'undefined') {
       storedUser = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
    }

    if (!storedUser) {
      toast.error("Please login to checkout");
      setTimeout(() => router.push("/login"), 1000);
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData((prev) => ({ 
        ...prev, 
        email: userData.email, 
        firstName: userData.name ? userData.name.split(" ")[0] : "" 
      }));
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty");
    
    setLoading(true);

    const orderData = {
      customer: formData, 
      items: cart.map(item => ({
        product: item._id, // ✅ LOGIC FIX: Maps _id to 'product' ref
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: getCartTotal(),
      status: "Pending",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order Placed Successfully!");
        clearCart();
        router.push(`/order-success/${data.orderId}`);
      } else {
        console.error("Server Error:", data.error);
        toast.error(data.error || "Failed to place order");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin w-10 h-10 text-[#006a55]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-6xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your purchase securely.</p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FORM (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Contact Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-[#006a55]/10 rounded-full flex items-center justify-center text-[#006a55]">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="John" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="Doe" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input required name="email" type="email" value={formData.email} disabled className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="98765 43210" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-[#006a55]/10 rounded-full flex items-center justify-center text-[#006a55]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                  <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="Flat No, Building, Street" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="City" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                    <input required name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="State" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                    <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#006a55] focus:ring-2 focus:ring-[#006a55]/20 outline-none transition-all bg-gray-50/50" placeholder="123456" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY (Span 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#006a55]">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3">
                  <span>Total</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Payment (Cash on Delivery)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <Truck className="w-4 h-4" />
                  <span>Estimated Delivery: 3-5 Days</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Place Order"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}