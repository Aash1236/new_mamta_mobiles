"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2 } from "lucide-react";
// IMPORT THE CART HOOK
import { useCart } from "../../context/CartContext";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  description: string;
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // GET THE ADD TO CART FUNCTION
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#006a55] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#F5F5F7] rounded-2xl overflow-hidden border-2 border-gray-100">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {!product.inStock && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">OUT OF STOCK</span>
              )}
              {product.price > 10000 && (
                <span className="bg-[#006a55] text-white text-xs font-bold px-3 py-1 rounded-full">PREMIUM</span>
              )}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square bg-[#F5F5F7] rounded-lg border-2 cursor-pointer relative overflow-hidden ${activeImage === idx ? 'border-[#006a55]' : 'border-transparent hover:border-gray-200'}`}
              >
                 <Image src={product.image} alt="Thumbnail" fill className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div>
          <div className="mb-2 text-[#006a55] font-bold text-sm uppercase tracking-wider">{product.brand}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-gray-500 text-sm">{product.reviews} Verified Reviews</span>
          </div>

          <div className="text-4xl font-bold text-gray-900 mb-6">
            ₹{product.price.toLocaleString()}
            <span className="text-lg text-gray-400 font-normal line-through ml-3">₹{(product.price * 1.2).toFixed(0)}</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "Experience premium quality with this authentic product from New Mamta Mobiles. Designed for durability and style, it perfectly complements your device."}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => addToCart(product)} // ACTIVATED CLICK HANDLER
              className="flex-1 bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 active:scale-95"
            >
              Add to Cart
            </button>
            <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* TRUST BADGES */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Truck className="w-5 h-5" /></div>
              <div>
                <div className="font-bold text-sm">Free Delivery</div>
                <div className="text-xs text-gray-500">Orders over ₹1000</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-full text-green-600"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <div className="font-bold text-sm">1 Year Warranty</div>
                <div className="text-xs text-gray-500">Official Brand Warranty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}