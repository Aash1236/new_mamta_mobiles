"use client"; 

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Heart, ShoppingBag, Star } from "lucide-react";
import Slider from "react-slick"; 
import { HERO_SLIDES } from "./data/constants"; 

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[]; // Array of images
  image?: string;   // Optional fallback for old data
  inStock: boolean;
}

// Brand Data with Simple Icons
const BRANDS = [
  { name: "Apple", slug: "apple", logo: "https://cdn.simpleicons.org/apple/333333" },
  { name: "Samsung", slug: "samsung", logo: "https://cdn.simpleicons.org/samsung/333333" },
  { name: "OnePlus", slug: "oneplus", logo: "https://cdn.simpleicons.org/oneplus/333333" },
  { name: "Xiaomi", slug: "xiaomi", logo: "https://cdn.simpleicons.org/xiaomi/333333" },
  { name: "Realme", slug: "realme", logo: "https://cdn.simpleicons.org/realme/333333" },
  { name: "Google", slug: "google", logo: "https://cdn.simpleicons.org/google/333333" },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  // FETCH REAL PRODUCTS ON LOAD
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        
        if (!res.ok) throw new Error("API Response not OK");
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setNewArrivals(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  // Helper to get a safe image URL
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image && product.image.length > 0) {
      return product.image;
    }
    return "https://placehold.co/600x600?text=No+Image"; // Safe fallback URL
  };

  // Carousel Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots: any) => (
      <div style={{ bottom: "30px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-secondary">
        <Slider {...settings}>
          {HERO_SLIDES.map((slide) => {
            if (slide.type === 'standard') {
              return (
                <div key={slide.id} className="relative w-full h-[500px] md:h-[650px] outline-none">
                  <Image src={slide.img} alt={slide.title} fill className="object-cover" priority={slide.id === 1} />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-center items-center text-center z-10">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{slide.title}</h2>
                    <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl drop-shadow-md">{slide.subtitle}</p>
                    <button className="bg-[#006a55] text-white px-8 py-3 rounded-full font-bold hover:bg-[#005544] transition-all flex items-center gap-2">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={slide.id} className="w-full h-[500px] md:h-[650px] flex items-center outline-none bg-secondary">
                  <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center h-full">
                    <div className="z-10 space-y-6 text-center md:text-left">
                      <h1 className="text-4xl md:text-6xl font-extrabold text-textMain leading-tight">
                        Protect Your Tech. <br />
                        <span className="text-[#006a55]">Elevate Your Style.</span>
                      </h1>
                      <p className="text-gray-700 text-lg md:max-w-md mx-auto md:mx-0">Premium cases, tempered glass, and accessories for the devices you love.</p>
                      <button className="bg-[#006a55] text-white px-8 py-3 rounded-full font-medium hover:bg-[#005544] transition-all flex items-center gap-2 mx-auto md:mx-0">
                        Shop Latest Collection <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute right-0 top-0 w-full h-full md:w-1/2 md:relative flex items-center justify-center p-8">
                       <div className="relative w-full h-full max-h-[500px]">
                          <Image src="https://placehold.co/600x800/E5E7EB/A3A3A3/png?text=Premium+Case+Shot" alt="Premium Case" fill className="object-contain drop-shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500" />
                       </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </Slider>
      </section>

      {/* SHOP BY BRAND */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-[#006a55] text-2xl font-bold mb-8 text-center text-textMain uppercase tracking-wider">Shop by Brand</h2>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 justify-items-center">
          {BRANDS.map((brand) => (
            <Link 
              href={`/shop/${brand.slug}`} 
              key={brand.name} 
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-24 h-24 rounded-full bg-[#006a55]/5 border-2 border-[#006a55]/10 flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-[#006a55] group-hover:border-[#006a55] group-hover:shadow-lg group-hover:-translate-y-1">
                 <img 
                   src={brand.logo} 
                   alt={brand.name} 
                   className="w-full h-full object-contain opacity-70 group-hover:opacity-100 group-hover:invert transition-all duration-300" 
                 />
              </div>
              <span className="font-bold text-gray-700 text-sm tracking-wide group-hover:text-[#006a55] transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[#006a55] text-2xl font-bold text-textMain">New Arrivals</h2>
            <Link href="/shop" className="text-[#006a55] font-bold hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <Link href={`/product/${product._id}`} key={product._id} className="group">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col hover:border-[#006a55]/20">
                    <div className="relative aspect-square bg-secondary rounded-lg mb-4 overflow-hidden">
                       {/* CRASH-PROOF IMAGE LOGIC */}
                       <Image 
                         src={getProductImage(product)} 
                         alt={product.name} 
                         fill 
                         className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
                       />
                       <button className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hover:bg-[#006a55] hover:text-white">
                         <ShoppingBag className="w-4 h-4" />
                       </button>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 uppercase">{product.brand}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[#006a55] font-extrabold text-lg text-textMain">₹{product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{product.rating}</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Loading Skeleton
              [1, 2, 3, 4].map((i) => <div key={i} className="bg-white h-[300px] rounded-xl animate-pulse bg-gray-100 border-2 border-gray-100"></div>)
            )}
          </div>
        </div>
      </section>

      {/* PROMISE SECTION */}
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