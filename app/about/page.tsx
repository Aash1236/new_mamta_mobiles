"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="bg-[#006a55] p-10 text-white text-center">
            <h1 className="text-4xl font-extrabold mb-4">About Mamta Mobiles</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              India's Next-Gen Mobile Accessory Brand. Premium quality, affordable prices, and a passion for technology.
            </p>
          </div>

          <div className="p-10 space-y-8 text-gray-700 leading-relaxed">
            <p>
              Welcome to <strong>New Mamta Mobiles</strong>. We are dedicated to providing the best mobile accessories in the market. From protective cases to high-speed chargers, we curate products that enhance your digital lifestyle.
            </p>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <ul className="space-y-3">
                {[
                  "100% Authentic Products",
                  "Fast & Secure Delivery",
                  "7-Day Easy Replacement",
                  "Dedicated Customer Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#006a55]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-sm">
                To bridge the gap between premium quality and affordability, ensuring every Indian smartphone user has access to world-class accessories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}