"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation"; // For redirection
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  // --- PRICE CALCULATIONS (Inclusive of Tax) ---
  const totalMRP = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstAmount = totalMRP * (18 / 118); // Back-calculate 18% GST
  const basePrice = totalMRP - gstAmount;

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare Order Data
    const orderData = {
      customer: formData,
      items: cart.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: totalMRP,
      status: "Pending",
      paymentMethod: "COD"
    };

    try {
      // 2. Send to Backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order Placed Successfully!");
        // 3. Redirect to Success Page using the new Order ID
        router.push(`/order-success/${data.orderId}`);
      } else {
        toast.error("Failed to place order.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
        <Link href="/shop" className="text-[#006a55] hover:underline font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#006a55] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: SHIPPING FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-gray-100 space-y-6">
              
              {/* Section 1: Contact Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#006a55] text-white flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-gray-800">Contact & Shipping</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input required name="firstName" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" placeholder="e.g. Rahul" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input required name="lastName" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" placeholder="e.g. Sharma" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input required type="email" name="email" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" placeholder="rahul@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input required type="tel" name="phone" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input required name="address" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" placeholder="Flat No, Building, Street Area" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input required name="city" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input required name="state" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input required name="pincode" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#006a55] outline-none transition-all" />
                </div>
              </div>

              {/* Section 2: Payment Method (Mockup) */}
              <div className="pt-8 mt-8 border-t-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-[#006a55] text-white flex items-center justify-center font-bold">2</div>
                   <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
                </div>
                <div className="p-4 border-2 border-[#006a55] bg-[#006a55]/5 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006a55]" />
                  <span className="font-medium text-gray-800">Cash on Delivery (COD)</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Processing..." : `Place Order • ₹${totalMRP.toLocaleString()}`}
              </button>

            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-6">Order Summary</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      <span className="absolute top-0 right-0 bg-gray-200 text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t-2 border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                   <span>Subtotal (Base)</span>
                   <span>₹{basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                   <span>GST (18% Included)</span>
                   <span>₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm text-[#006a55] font-medium">
                   <span>Shipping</span>
                   <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-100">
                   <span>Total to Pay</span>
                   <span>₹{totalMRP.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right">Inclusive of all taxes</p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                Secure Checkout
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}