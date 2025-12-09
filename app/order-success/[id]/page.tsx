"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle, Package, MapPin, Loader2 } from "lucide-react";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#2CA089]" /></div>;
  if (!order) return <div className="h-screen flex items-center justify-center">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2CA089] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="opacity-90">Thank you for your purchase, {order.customer.firstName}.</p>
          <div className="mt-4 inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
            Order ID: {order._id}
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-8">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                <p className="font-bold text-gray-800 text-lg">{order.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Expected Delivery</p>
              <p className="font-bold text-gray-800">Within 3-5 Days</p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2CA089]" /> Shipping Address
              </h3>
              <address className="not-italic text-gray-600 text-sm leading-relaxed">
                <span className="font-bold text-gray-800">{order.customer.firstName} {order.customer.lastName}</span><br />
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}<br />
                Phone: {order.customer.phone}
              </address>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <div className="flex justify-between text-gray-800 font-bold text-lg pt-2 border-t border-gray-100 mt-2">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <Link href="/shop" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2CA089] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}