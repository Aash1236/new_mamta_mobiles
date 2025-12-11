import { ShieldCheck, AlertTriangle, Clock } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">Warranty Policy</h1>

        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start">
            <div className="bg-green-100 p-3 rounded-full text-[#006a55] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coverage Duration</h3>
              <p className="text-gray-600">
                All electronic accessories (Chargers, Cables, Earbuds) come with a **6-Month Replacement Warranty** against manufacturing defects. Screen guards and Cases have a **7-Day Checking Warranty**.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start">
            <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Not Covered</h3>
              <p className="text-gray-600">
                Warranty is void if the product has physical damage, water damage, or wear and tear from daily use. 
                Cables with cuts or bends are not covered.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Claim Process</h3>
              <p className="text-gray-600">
                To claim warranty, please email us at <strong>support@mamtamobiles.com</strong> with your 
                Order ID and a video of the issue. We will process replacements within 7 working days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}