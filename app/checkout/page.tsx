"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext"; 
import toast, { Toaster } from "react-hot-toast";
import { Loader2, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ✅ FIXED: Changed zip -> pincode, added state
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
    const storedUser = sessionStorage.getItem("user_info");
    if (!storedUser) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData((prev) => ({ 
      ...prev, 
      email: userData.email, 
      firstName: userData.name ? userData.name.split(" ")[0] : "" 
    }));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty");
    
    setLoading(true);

    // ✅ FIXED: Map _id to 'product' (not productId) to match Schema
    const cleanItems = cart.map(item => ({
      product: item._id, // <--- THE FIX
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const orderData = {
      customer: formData,
      items: cleanItems,
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
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 text-black">Shipping Details</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
                <input required name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
              </div>
              <input required name="email" type="email" placeholder="Email" value={formData.email} disabled className="text-black w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
              <input required name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
              <input required name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
              
              <div className="grid grid-cols-3 gap-4">
                <input required name="city" placeholder="City" value={formData.city} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
                {/* ✅ FIXED: Renamed to Pincode */}
                <input required name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
                {/* ✅ FIXED: Added State Input */}
                <input required name="state" placeholder="State" value={formData.state} onChange={handleChange} className="text-black w-full px-4 py-2 border rounded-lg" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#006a55] text-white py-3 rounded-lg font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2 mt-4">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Place Order (COD)"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-[#006a55]">
              <span>Total</span>
              <span>₹{getCartTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}