import Image from "next/image";
import { Award, Users, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="bg-[#006a55] text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Mamta Mobiles</h1>
        <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
          India's Next-Gen Mobile Accessory Brand. Delivering premium protection and style since 2025.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded with a simple mission: to provide high-quality mobile accessories that don't break the bank. 
              At Mamta Mobiles, we believe your device deserves the best protection without compromising on style.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From our humble beginnings in Pune to serving customers across India, our journey has been fueled by 
              innovation and customer trust.
            </p>
          </div>
          <div className="relative h-[300px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
             {/* Replace with a real shop image if you have one, or keep generic */}
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold bg-gray-200">
                [Store Image / Team Photo]
             </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center">
          <div className="p-6 bg-green-50 rounded-xl border border-green-100">
            <Users className="w-10 h-10 text-[#006a55] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
            <p className="text-gray-500">Happy Customers</p>
          </div>
          <div className="p-6 bg-green-50 rounded-xl border border-green-100">
            <Award className="w-10 h-10 text-[#006a55] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">100%</h3>
            <p className="text-gray-500">Genuine Products</p>
          </div>
          <div className="p-6 bg-green-50 rounded-xl border border-green-100">
            <Globe className="w-10 h-10 text-[#006a55] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
            <p className="text-gray-500">Online Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}