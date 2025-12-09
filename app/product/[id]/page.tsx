"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, ArrowLeft, ShoppingBag, CheckCircle, Share2, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  inStock: boolean;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // FETCH PRODUCT DATA
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006a55]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <Link href="/" className="text-[#006a55] underline hover:text-[#005544]">Back to Store</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "https://placehold.co/600x600",
      quantity: 1
    });
    toast.success("Added to Cart!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-6xl">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#006a55]">Home</Link>
          <span>/</span>
          <Link href={`/shop/${product.category}`} className="capitalize hover:text-[#006a55]">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100">
              <Image 
                src={product.images[selectedImage] || "https://placehold.co/600x600"} 
                alt={product.name} 
                fill 
                className="object-contain p-6"
                priority
              />
              {/* Image Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 {product.inStock ? (
                   <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full w-fit">In Stock</span>
                 ) : (
                   <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full w-fit">Out of Stock</span>
                 )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-[#006a55] ring-2 ring-[#006a55]/20" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`View ${index}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="flex flex-col">
            <div className="mb-1">
               <span className="text-[#006a55] font-bold text-sm uppercase tracking-wider">{product.brand}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900 text-sm">{product.rating}</span>
                <span className="text-gray-400 text-xs">({product.reviews} Reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Verified
              </span>
            </div>

            <div className="text-4xl font-extrabold text-[#006a55] mb-8">
              ₹{product.price.toLocaleString()}
              <span className="text-lg text-gray-400 font-medium line-through ml-3">₹{(product.price * 1.2).toFixed(0)}</span>
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md ml-3 font-bold">20% OFF</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button className="flex-none p-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* FEATURES LIST */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                 <Truck className="w-5 h-5 text-[#006a55]" />
                 <div className="text-xs">
                   <p className="font-bold text-gray-900">Free Delivery</p>
                   <p className="text-gray-500">Orders over ₹500</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                 <ShieldCheck className="w-5 h-5 text-[#006a55]" />
                 <div className="text-xs">
                   <p className="font-bold text-gray-900">1 Year Warranty</p>
                   <p className="text-gray-500">Official Brand</p>
                 </div>
               </div>
            </div>

            {/* DESCRIPTION */}
            <div className="border-t border-gray-100 pt-6 mt-auto">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {product.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}