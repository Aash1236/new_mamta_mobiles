"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../../context/CartContext"; 
import { Star, Truck, ShieldCheck, Minus, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ProductClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          // ✅ DEBUG: Check your browser console to see exactly what 'image' or 'images' contains!
          console.log("Fetched Product Data:", data); 
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      toast.success("Added to Cart!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006a55]"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  // ✅ CRASH FIX: Robust Image Logic
  // 1. We use a PNG placeholder (via.placeholder.com) instead of SVG to avoid the specific error you saw.
  let validImage = "https://via.placeholder.com/600x600.png?text=No+Image";
  
  // 2. Check for real images
  if (product.image && product.image.trim() !== "") {
    validImage = product.image;
  } else if (product.images && product.images.length > 0 && product.images[0].trim() !== "") {
    validImage = product.images[0];
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden border border-gray-100">
                {/* ✅ ADDED 'unoptimized': This fixes the SVG crash immediately */}
                <Image 
                  src={validImage} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-8 mix-blend-multiply"
                  priority 
                  unoptimized={true} 
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="bg-[#006a55]/10 text-[#006a55] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.brand}</span>
                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" /> {product.rating || 4.5}
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
                <span className="text-4xl font-extrabold text-[#006a55]">₹{product.price.toLocaleString()}</span>
                <span className="text-green-600 text-sm font-bold mb-1">Inclusive of all taxes</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl h-12 w-fit">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 hover:text-[#006a55]"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-4 hover:text-[#006a55]"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-[#006a55] text-white h-12 rounded-xl font-bold hover:bg-[#005544] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600"><div className="p-2 bg-green-50 rounded-lg text-[#006a55]"><Truck className="w-5 h-5" /></div><span>Free Delivery</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><div className="p-2 bg-green-50 rounded-lg text-[#006a55]"><ShieldCheck className="w-5 h-5" /></div><span>1 Year Warranty</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}