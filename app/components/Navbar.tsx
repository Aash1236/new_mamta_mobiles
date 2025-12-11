"use client";

import Link from "next/link";
import Image from "next/image"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Menu, ChevronDown, ChevronLeft, ChevronRight, X, Smartphone, Headphones } from "lucide-react";
import { ANNOUNCEMENTS } from "../data/constants"; 
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

// Interface for the Dynamic Menu Data
interface NavGroup {
  _id: string;
  type: string;
  title: string;
  items: string[];
  image?: string; 
}

export default function Navbar() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mobile Menu States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDeviceOpen, setMobileDeviceOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Dynamic Menu State
  const [deviceMenu, setDeviceMenu] = useState<NavGroup[]>([]);
  const [categoryMenu, setCategoryMenu] = useState<NavGroup[]>([]);
  
  const { getCartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  // --- HELPER FUNCTIONS (Moved UP to fix ReferenceError) ---
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
      setIsMobileMenuOpen(false);
    }
  };

  const handleUserClick = () => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  // --- EFFECTS ---
  
  // 1. Hydration Fix
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Fetch Navigation Data
  useEffect(() => {
    async function fetchNavigation() {
      try {
        const res = await fetch("/api/navigation");
        if (res.ok) {
          const data = await res.json();
          
          // ✅ FIX: Use .includes() and .toLowerCase() 
          // This ensures "Device Menu" from Admin matches "device" logic here
          setDeviceMenu(data.filter((item: NavGroup) => 
            item.type && item.type.toLowerCase().includes("device")
          ));
          
          setCategoryMenu(data.filter((item: NavGroup) => 
            item.type && item.type.toLowerCase().includes("category")
          ));
        }
      } catch (error) {
        console.error("Failed to load navigation menus");
      }
    }
    fetchNavigation();
  }, []);

  // 3. Announcement Timer
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, []); // handleNext is now stable

  // --- SHARED STYLES (Fixes Alignment & Dropdown Position) ---
  const navLinkClasses = "h-full flex items-center hover:text-[#006a55] border-b-4 border-transparent hover:border-[#006a55] transition-all cursor-pointer px-3 tracking-wide";
  
  // Adjusted Top to 128px to clear the navbar perfectly
  const dropdownClasses = "fixed top-[132px] left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-[#F5F5F7] shadow-xl border border-gray-200 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 p-8";

  return (
    <>
      <div className="w-full bg-white shadow-sm sticky top-0 z-50 font-sans">
        
        {/* TOP BAR */}
        <div className="bg-[#006a55] text-white text-[11px] font-bold tracking-widest py-2.5 relative z-50">
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
        <div className="container mx-auto px-4 h-[88px] flex items-center justify-between relative bg-white z-40">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex flex-col leading-none group">
              <span className="text-3xl font-bold text-[#006a55] tracking-wide uppercase font-exo">
                MAMTA
              </span>
              <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-medium pl-1 group-hover:text-[#006a55] transition-colors">
                Mobiles
              </span>
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-4 text-[13px] font-bold text-gray-600 tracking-wide uppercase h-full">
            <Link href="/" className={navLinkClasses}>
              Home
            </Link>

            {/* --- DYNAMIC DEVICE MENU --- */}
            <div className={`group ${navLinkClasses}`}>
              <span className="flex items-center gap-1">
                Device <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </span>
              {/* Mega Menu Dropdown */}
              <div className={dropdownClasses}>
                 <div className="container mx-auto px-4">
                   {deviceMenu.length > 0 ? (
                     <div className="grid grid-cols-4 gap-8">
                       {deviceMenu.map((col, idx) => (
                         <div key={idx} className="flex flex-col">
                           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm h-32 flex items-center justify-center border-2 border-gray-100 text-[#006a55]/20 relative">
                              {col.image ? (
                                 <Image src={col.image} alt={col.title} fill className="object-contain p-4" />
                              ) : (
                                 <Smartphone className="w-12 h-12" />
                              )}
                           </div>
                           <h4 className="font-bold text-gray-800 mb-3 text-xs uppercase">{col.title}</h4>
                           <ul className="space-y-2">
                             {col.items.map((item, i) => (
                               <li key={i}>
                                 <Link 
                                   href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                   className="text-[11px] text-gray-500 hover:text-[#006a55] cursor-pointer block"
                                 >
                                   {item}
                                 </Link>
                               </li>
                             ))}
                           </ul>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center text-gray-400 py-10">Loading Menu...</div>
                   )}
                 </div>
              </div>
            </div>

            {/* --- DYNAMIC CATEGORY MENU --- */}
            <div className={`group ${navLinkClasses}`}>
              <span className="flex items-center gap-1">
                Category <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </span>
              {/* Mega Menu Dropdown */}
              <div className={dropdownClasses}>
                 <div className="container mx-auto px-4">
                   {categoryMenu.length > 0 ? (
                     <div className="grid grid-cols-5 gap-6">
                       {categoryMenu.map((col, idx) => (
                         <div key={idx} className="flex flex-col">
                            <div className="bg-white p-2 rounded-lg mb-4 shadow-sm aspect-square flex items-center justify-center border-2 border-gray-100 text-[#006a55]/20 relative">
                              {col.image ? (
                                 <Image src={col.image} alt={col.title} fill className="object-contain p-2" />
                              ) : (
                                 <Headphones className="w-10 h-10" />
                              )}
                           </div>
                           <h4 className="font-bold text-gray-800 mb-3 text-xs uppercase">{col.title}</h4>
                           <ul className="space-y-2">
                             {col.items.map((item, i) => (
                               <li key={i}>
                                 <Link 
                                   href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                   className="text-[11px] text-gray-500 hover:text-[#006a55] cursor-pointer block"
                                 >
                                   {item}
                                 </Link>
                               </li>
                             ))}
                           </ul>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center text-gray-400 py-10">Loading Menu...</div>
                   )}
                 </div>
              </div>
            </div>

            <Link href="/warranty" className={navLinkClasses}>
              Warranty
            </Link>

            <Link href="/about" className={navLinkClasses}>
              About Us
            </Link>

            <Link href="/partner" className={navLinkClasses}>
              Partner With Us
            </Link>
          </div>

          {/* ICONS (Search, User, Cart) */}
          <div className="flex items-center gap-6 text-gray-800">
            
            {/* SEARCH */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border-2 border-[#006a55] rounded-full overflow-hidden w-48 lg:w-64 shadow-lg z-50">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Search..." 
                    className="w-full px-4 py-1.5 text-sm outline-none text-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                  <button type="submit" className="p-2 text-[#006a55] hover:bg-gray-100">
                    <Search className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <button type="button" onMouseDown={() => setIsSearchOpen(false)} className="p-2 text-gray-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <Search 
                  className="w-6 h-6 cursor-pointer hover:text-[#006a55] transition-colors" 
                  strokeWidth={2} 
                  onClick={() => setIsSearchOpen(true)}
                />
              )}
            </div>

            {/* USER */}
            <User 
              className="w-6 h-6 cursor-pointer hover:text-[#006a55] transition-colors" 
              strokeWidth={2}
              onClick={handleUserClick} 
            />
            
            {/* CART */}
            <div 
              className="relative cursor-pointer" 
              onClick={() => setIsCartOpen(true)}
            >
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

      {/* MOBILE MENU DRAWER */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-[70] lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          {/* ✅ FIXED: Brand Logo instead of 'MENU' text */}
          <Link href="/" className="flex flex-col leading-none group" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-2xl font-bold text-[#006a55] tracking-wide uppercase font-exo">
              MAMTA
            </span>
            <span className="text-[9px] tracking-[0.4em] text-gray-400 uppercase font-medium pl-1">
              Mobiles
            </span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-1">
          <Link href="/" className="block p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          
          {/* Mobile Device Menu */}
          <div>
            <button 
              onClick={() => setMobileDeviceOpen(!mobileDeviceOpen)}
              className="w-full flex justify-between items-center p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Devices <ChevronDown className={`w-4 h-4 transition-transform ${mobileDeviceOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileDeviceOpen && (
              <div className="pl-4 space-y-2 bg-gray-50/50 py-2 rounded-lg">
                {deviceMenu.map(group => (
                  <div key={group._id} className="mb-3">
                    <p className="text-xs font-bold text-[#006a55] uppercase mb-1">{group.title}</p>
                    {group.items.map(item => (
                      <Link 
                        key={item} 
                        href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-1 text-sm text-gray-600 hover:text-[#006a55]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Category Menu */}
          <div>
            <button 
              onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
              className="w-full flex justify-between items-center p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Categories <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCategoryOpen && (
              <div className="pl-4 space-y-2 bg-gray-50/50 py-2 rounded-lg">
                {categoryMenu.map(group => (
                  <div key={group._id} className="mb-3">
                    <p className="text-xs font-bold text-[#006a55] uppercase mb-1">{group.title}</p>
                    {group.items.map(item => (
                      <Link 
                        key={item} 
                        href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-1 text-sm text-gray-600 hover:text-[#006a55]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/warranty" className="block p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
            Warranty
          </Link>
          <Link href="/about" className="block p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link href="/partner" className="block p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
            Partner With Us
          </Link>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}