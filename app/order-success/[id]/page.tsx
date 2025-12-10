"use client";

import Link from "next/link";
import { CheckCircle, Home, FileText, ArrowRight, ShoppingBag } from "lucide-react";
import { use } from "react";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-20 px-4 font-sans">
      
      {/* Success Card */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-2 border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#006a55]"></div>

        {/* Animated Icon */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce-short mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          {/* Decorative dots */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-0 -left-2 w-3 h-3 bg-[#006a55] rounded-full"></div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
        
        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
          Thank you for shopping with <strong>Mamta Mobiles</strong>.<br />
          Your order has been received and is being processed.
        </p>

        {/* Order ID Box */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Reference ID</span>
          <span className="font-mono text-xl font-bold text-[#006a55] tracking-wide">#{id.slice(-6).toUpperCase()}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          
          <Link href="/profile">
            <button className="w-full group bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-gray-600" /> 
              View Order Details
            </button>
          </Link>

          <Link href="/">
            <button className="w-full bg-[#006a55] text-white py-4 rounded-xl font-bold hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 flex items-center justify-center gap-2 active:scale-95 text-lg">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

        </div>

      </div>

      {/* Footer Note */}
      <p className="mt-8 text-gray-400 text-sm font-medium flex items-center gap-2">
        <ShoppingBag className="w-4 h-4" /> Need help? Contact Support
      </p>

    </div>
  );
}