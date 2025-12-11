"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  images: string[]; // Support array
  image?: string;   // Support string
}

interface ProductSectionProps {
  title: string;
  category?: string; 
  sort?: "new" | "price"; 
}

export default function ProductSection({ title, category, sort }: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ CRASH FIX: Safe Image Helper
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0 && product.images[0] !== "") return product.images[0];
    if (product.image && product.image !== "") return product.image;
    // Fallback if empty
    return "https://placehold.co/600x600?text=No+Image";
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products"); 
        if (res.ok) {
          let data = await res.json();

          // ✅ FILTER LOGIC
          if (category) {
            const lowerCat = category.toLowerCase();

            if (lowerCat === "mobiles") {
              // Show ONLY Mobiles
              data = data.filter((p: any) => 
                p.category.toLowerCase() === 'mobiles' || 
                p.category.toLowerCase() === 'smartphones'
              );
            } 
            else if (lowerCat === "non-mobile") {
              // Show EVERYTHING ELSE (Accessories, Cases, Chargers)
              data = data.filter((p: any) => 
                p.category.toLowerCase() !== 'mobiles' && 
                p.category.toLowerCase() !== 'smartphones'
              );
            }
          }

          if (sort === "new") {
            data = data.reverse(); 
          }

          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, sort]);

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Loading {title}...</div>;
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-[#006a55] text-2xl font-bold text-textMain">{title}</h2>
          <Link href="/shop/all" className="text-[#006a55] font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col hover:border-[#006a55]/20">
                
                {/* Image Area */}
                <div className="relative aspect-square bg-white rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  <Image 
                    src={getProductImage(product)} // ✅ Use Safe Helper
                    alt={product.name} 
                    fill 
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hover:bg-[#006a55] hover:text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-3 uppercase">{product.brand}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-[#006a55] font-extrabold text-lg">₹{product.price.toLocaleString()}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {product.rating || 4.5}
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}