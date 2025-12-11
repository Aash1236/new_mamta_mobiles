"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SalePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch Dynamic Settings
    async function fetchSettings() {
      try {
        const res = await fetch("/api/popup");
        if (res.ok) {
          const popupData = await res.json();
          
          // 2. Check Logic: Must be Active AND Not Seen Yet
          const hasSeen = sessionStorage.getItem("seen_sale_popup");
          if (popupData.isActive && !hasSeen) {
            setData(popupData);
            setTimeout(() => setIsVisible(true), 1500); // Delay for effect
          }
        }
      } catch (error) {
        console.error("Popup check failed");
      }
    }
    fetchSettings();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("seen_sale_popup", "true");
  };

  if (!isVisible || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={handleClose}></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-3xl overflow-hidden transform transition-all scale-100 animate-fade-in-up">
        <button onClick={handleClose} className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:rotate-90">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Dynamic Image */}
          <div className="relative h-48 md:h-auto md:w-1/2 bg-gray-100">
            <Image 
              src={data.image || "https://via.placeholder.com/500x500?text=Sale"} 
              alt="Sale" 
              fill 
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Dynamic Text */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center text-center md:text-left bg-white">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full w-fit mx-auto md:mx-0 mb-4 tracking-wider uppercase">
              Special Offer
            </span>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              {data.title}
            </h2>
            
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              {data.subtitle}
            </p>

            <div className="flex flex-col gap-3">
              <Link href={data.link || "/shop/all"} onClick={handleClose}>
                <button className="w-full bg-[#006a55] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95">
                  Check it out <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button onClick={handleClose} className="text-xs text-gray-400 font-bold hover:text-gray-600 underline">
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}