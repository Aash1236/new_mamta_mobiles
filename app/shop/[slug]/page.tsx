"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext"; 
import { Star, ShoppingBag, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  image?: string;
  inStock: boolean;
}

export default function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // Next.js 15+ Params handling
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  
  const { addToCart } = useCart();

  // ✅ CRASH-PROOF IMAGE HELPER
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0 && product.images[0]?.trim()) {
      return product.images[0];
    }
    if (product.image && product.image?.trim()) {
      return product.image;
    }
    return "https://via.placeholder.com/600x600.png?text=No+Image";
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          let data: Product[] = await res.json();
          
          // Filter based on slug (brand or category)
          if (slug !== 'all') {
            const term = slug.toLowerCase();
            data = data.filter(p => 
              p.brand.toLowerCase() === term || 
              p.category.toLowerCase() === term ||
              (term === 'mobiles' && (p.category.toLowerCase() === 'mobiles' || p.category.toLowerCase() === 'smartphones'))
            );
          }
          
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug]);

  // Handle Sorting
  useEffect(() => {
    let sorted = [...products];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    // Default is usually 'newest' (relying on DB order or created date if available)
    setFilteredProducts(sorted);
  }, [sort, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006a55]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{slug.replace(/-/g, ' ')}</h1>
            <p className="text-gray-500 text-sm mt-1">Showing {filteredProducts.length} results</p>
          </div>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No products found in this category.</p>
            <Link href="/" className="text-[#006a55] font-bold mt-4 inline-block hover:underline">Go Back Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link href={`/product/${product._id}`} key={product._id} className="group">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col hover:border-[#006a55]/20 relative">
                  
                  {/* Image Container */}
                  {/* ✅ FIX: bg-gray-200 for better white product visibility */}
                  <div className="relative aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    <Image 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      unoptimized={true} 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 leading-relaxed">{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 uppercase font-bold tracking-wider">{product.brand}</p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-[#006a55] font-extrabold text-lg">₹{product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-md">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {product.rating || 4.5}
                      </div>
                    </div>
                  </div>

                  {/* ✅ FIX: Quick Add Button with QUANTITY: 1 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); 
                      addToCart({ 
                        ...product, 
                        image: getProductImage(product), 
                        quantity: 1 // ✅ FIXED: Explicitly set quantity
                      });
                      toast.success("Added to Cart");
                    }}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-[#006a55] hover:bg-[#006a55] hover:text-white transition-all z-10 opacity-100"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}