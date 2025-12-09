"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#006a55] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#006a55]/10 rounded-full flex items-center justify-center text-[#006a55]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Warranty Policy</h1>
              <p className="text-gray-500">Coverage details for your Mamta Mobiles products.</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Warranty Period</h2>
              <p className="text-gray-600">
                All electronic products (Chargers, Cables, Earphones) come with a standard <strong>6-Month Warranty</strong> from the date of purchase. Screen guards and Cases have a <strong>7-Day Replacement Policy</strong> for manufacturing defects only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">What is Covered?</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Manufacturing defects in materials and workmanship.</li>
                <li>Malfunctioning of internal components under normal use.</li>
                <li>Dead-on-arrival products.</li>
              </ul>
            </section>

            <section className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h2 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> What is NOT Covered?
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-red-700 text-sm">
                <li>Physical damage (cracks, dents, water damage).</li>
                <li>Wear and tear from regular use (scratches on cases).</li>
                <li>Damage caused by using unauthorized accessories.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">How to Claim?</h2>
              <p className="text-gray-600 mb-4">
                To initiate a warranty claim, please email us with your Order ID and photos of the issue.
              </p>
              <a href="mailto:support@mamtamobiles.com" className="bg-[#006a55] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#005544] transition-colors">
                Contact Support
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}