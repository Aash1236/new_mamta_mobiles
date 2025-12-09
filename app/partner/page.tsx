"use client";

import Link from "next/link";
import { ArrowLeft, Handshake, Send } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="bg-gray-900 p-10 text-white text-center">
            <Handshake className="w-12 h-12 mx-auto mb-4 text-[#006a55]" />
            <h1 className="text-3xl font-bold mb-2">Partner With Us</h1>
            <p className="text-gray-400">Join the Mamta Mobiles success story. Become a franchisee or distributor.</p>
          </div>

          <div className="p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none" placeholder="john@business.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Partnership Type</label>
                <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none bg-white">
                  <option>Franchise Inquiry</option>
                  <option>Bulk/Corporate Order</option>
                  <option>Distributorship</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#006a55] outline-none resize-none" placeholder="Tell us about your business..."></textarea>
              </div>

              <button className="w-full bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg flex items-center justify-center gap-2">
                <Send className="w-5 h-5" /> Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}