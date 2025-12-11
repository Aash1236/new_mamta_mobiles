"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, ShieldCheck, Heart } from "lucide-react";
import HeroSlider from "./components/HeroSlider"; 
import ProductSection from "./components/ProductSection"; 

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
}

export default function Home() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands');
        if (res.ok) setBrands(await res.json());
      } catch (error) {
        console.error("Failed to fetch brands");
      }
    }
    fetchBrands();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. SHOP BY BRAND */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-[#006a55] text-2xl font-bold mb-8 text-center uppercase tracking-wider">Shop by Brand</h2>
        {brands.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 justify-items-center">
            {brands.map((brand) => (
              <Link href={`/shop/${brand.slug}`} key={brand._id} className="group flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-[#006a55]/5 border-2 border-[#006a55]/10 flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-[#006a55] group-hover:border-[#006a55] group-hover:shadow-lg group-hover:-translate-y-1">
                   {brand.logo && (
                     <Image src={brand.logo} alt={brand.name} width={50} height={50} className="w-full h-full object-contain opacity-70 group-hover:opacity-100 group-hover:invert transition-all duration-300" />
                   )}
                </div>
                <span className="font-bold text-gray-700 text-sm tracking-wide group-hover:text-[#006a55] transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        ) : <p className="text-center text-gray-400">Loading brands...</p>}
      </section>

      {/* 3. PRODUCT SECTIONS */}
      {/* New Arrivals = ONLY Mobiles */}
      <ProductSection 
        title="New Arrivals" 
        sort="new" 
        category="mobiles" 
      />

      {/* Mobile Accessories = Everything ELSE */}
      <ProductSection 
        title="Mobile Accessories" 
        category="non-mobile" 
      />

      {/* 4. PROMISE SECTION */}
      <section className="py-16 container mx-auto px-4 border-t-2 border-gray-100">
        <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x-2 divide-gray-100">
          <div className="flex flex-col items-center p-4">
              <div className="p-4 bg-[#006a55]/10 rounded-full mb-4 text-[#006a55]"><Truck className="w-8 h-8" /></div>
              <h4 className="text-[#006a55] font-bold text-lg mb-2">Fast Delivery</h4>
              <p className="text-gray-500 text-sm px-4">We ship within 24 hours of your order placement.</p>
          </div>
          <div className="flex flex-col items-center p-4">
              <div className="p-4 bg-[#006a55]/10 rounded-full mb-4 text-[#006a55]"><ShieldCheck className="w-8 h-8" /></div>
              <h4 className="text-[#006a55] font-bold text-lg mb-2">Premium Quality</h4>
              <p className="text-gray-500 text-sm px-4">Every product passes rigorous durability tests.</p>
          </div>
          <div className="flex flex-col items-center p-4">
              <div className="p-4 bg-[#006a55]/10 rounded-full mb-4 text-[#006a55]"><Heart className="w-8 h-8" /></div>
              <h4 className="text-[#006a55] font-bold text-lg mb-2">7-Day Returns</h4>
              <p className="text-gray-500 text-sm px-4">Not happy? Return it easily, no questions asked.</p>
          </div>
        </div>
      </section>

    </main>
  );
}