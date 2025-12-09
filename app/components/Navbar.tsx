"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Menu, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ANNOUNCEMENTS, DEVICE_MENU, CATEGORY_MENU } from "../data/constants";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const router = useRouter();
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { getCartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentAnnouncement]);

  const handleNext = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const handlePrev = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop/all?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  // --- FIXED USER CLICK HANDLER ---
  const handleUserClick = () => {
    // Check localStorage instead of document.cookie
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") === "true";
    
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <div className="w-full bg-white shadow-sm sticky top-0 z-50 font-sans">
        
        {/* TOP BAR */}
        <div className="bg-[#006a55] text-white text-[11px] font-bold tracking-widest py-2.5 relative">
          <div className="container mx-auto px-4 flex justify-between items-center">
             <button onClick={handlePrev} className="opacity-75 hover:opacity-100 transition-opacity p-1">
               <ChevronLeft className="w-4 h-4" />
             </button>
             <span key={currentAnnouncement} className="uppercase text-center px-4 animate-fade-in truncate">
               {ANNOUNCEMENTS[currentAnnouncement]}
             </span>
             <button onClick={handleNext} className="opacity-75 hover:opacity-100 transition-opacity p-1">
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* MAIN NAVIGATION */}
        <div className="container mx-auto px-4 h-[88px] flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button className="lg:hidden"><Menu className="w-6 h-6 text-gray-800" /></button>
            <Link href="/" className="flex flex-col leading-none group">
              <span className="text-3xl font-bold text-[#006a55] tracking-wide uppercase font-exo">MAMTA</span>
              <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-medium pl-1 group-hover:text-[#006a55] transition-colors">Mobiles</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-7 text-[13px] font-bold text-gray-600 tracking-wide uppercase h-full">
            <Link href="/" className="h-full flex items-center hover:text-[#006a55] border-b-4 border-transparent hover:border-[#006a55] transition-all">Home</Link>

            {/* Device Menu */}
            <div className="group h-full flex items-center cursor-pointer relative">
              <span className="group-hover:text-[#006a55] flex items-center gap-1">Device <ChevronDown className="w-3 h-3" /></span>
              <div className="absolute top-[88px] left-[-200px] w-[100vw] max-w-7xl bg-[#F5F5F7] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-8 border-t-4 border-gray-200">
                 <div className="grid grid-cols-4 gap-8">
                   {DEVICE_MENU.map((col, idx) => (
                     <div key={idx} className="flex flex-col">
                       <div className="bg-white p-4 rounded-lg mb-4 shadow-sm h-32 flex items-center justify-center border-2 border-gray-100">
                          <span className="text-xs text-gray-300">Image: {col.category}</span>
                       </div>
                       <h4 className="font-bold text-gray-800 mb-3 text-xs">{col.category}</h4>
                       <ul className="space-y-2">
                         {col.items.map((item, i) => (
                           <li key={i}>
                             <Link href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[11px] text-gray-500 hover:text-[#006a55] cursor-pointer block">{item}</Link>
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            {/* Category Menu */}
            <div className="group h-full flex items-center cursor-pointer relative">
              <span className="group-hover:text-[#006a55] flex items-center gap-1">Category <ChevronDown className="w-3 h-3" /></span>
              <div className="absolute top-[88px] left-[-300px] w-[100vw] max-w-7xl bg-[#F5F5F7] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-8 border-t-4 border-gray-200">
                 <div className="grid grid-cols-5 gap-6">
                   {CATEGORY_MENU.map((col, idx) => (
                     <div key={idx} className="flex flex-col">
                        <div className="bg-white p-2 rounded-lg mb-4 shadow-sm aspect-square flex items-center justify-center border-2 border-gray-100">
                          <span className="text-xs text-gray-300 text-center">{col.title} Image</span>
                       </div>
                       <h4 className="font-bold text-gray-800 mb-3 text-xs">{col.title}</h4>
                       <ul className="space-y-2">
                         {col.items.map((item, i) => (
                           <li key={i}>
                             <Link href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[11px] text-gray-500 hover:text-[#006a55] cursor-pointer block">{item}</Link>
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <Link href="/warranty" className="h-full flex items-center hover:text-[#006a55] transition-colors">Warranty</Link>
            <Link href="/about" className="h-full flex items-center hover:text-[#006a55] transition-colors">About Us</Link>
            <Link href="/partner" className="h-full flex items-center hover:text-[#006a55] transition-colors">Partner With Us</Link>
          </div>

          <div className="flex items-center gap-6 text-gray-800">
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border-2 border-[#006a55] rounded-full overflow-hidden w-64 shadow-lg z-50">
                  <input 
                    type="text" autoFocus placeholder="Search..." 
                    className="w-full px-4 py-1.5 text-sm outline-none text-gray-800"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                  <button type="submit" className="p-2 text-[#006a55] hover:bg-gray-100"><Search className="w-4 h-4" strokeWidth={2.5} /></button>
                  <button type="button" onMouseDown={() => setIsSearchOpen(false)} className="p-2 text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </form>
              ) : (
                <Search className="w-6 h-6 cursor-pointer hover:text-[#006a55] transition-colors" strokeWidth={2} onClick={() => setIsSearchOpen(true)} />
              )}
            </div>

            {/* USER ICON - FIXED CLICK HANDLER */}
            <User 
              className="w-6 h-6 cursor-pointer hover:text-[#006a55] transition-colors" 
              strokeWidth={2}
              onClick={handleUserClick} 
            />
            
            <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="w-6 h-6 hover:text-[#006a55] transition-colors" strokeWidth={2} />
              {mounted && getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#006a55] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-short">
                  {getCartCount()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}