"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation"; // IMPORT SEARCH PARAMS
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";

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
  const { slug } = use(params);
  const searchParams = useSearchParams(); // HOOK FOR SEARCH
  const searchQuery = searchParams.get('search'); // GET QUERY

  const { addToCart } = useCart();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState(200000);

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image && product.image.length > 0) return product.image;
    return "https://placehold.co/600x600?text=No+Image";
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // FILTER LOGIC
  useEffect(() => {
    if (!slug || allProducts.length === 0) return;

    let result = [...allProducts];

    // 1. Filter by Search Query (if exists)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    } 
    // 2. Filter by Brand/Category slug (if not 'all')
    else if (slug !== 'all' && slug !== 'shop') {
      result = result.filter(p => 
        p.brand?.toLowerCase() === slug.toLowerCase() || 
        p.category?.toLowerCase() === slug.toLowerCase()
      );
    }

    // 3. Filter by Price
    result = result.filter(p => p.price <= priceRange);

    // 4. Sort
    if (sortBy === "newest") {
      result.sort((a, b) => {
        const isAMobile = a.category === 'mobiles';
        const isBMobile = b.category === 'mobiles';
        if (isAMobile && !isBMobile) return -1;
        if (!isAMobile && isBMobile) return 1;
        return 0; 
      });
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result); 
  }, [slug, searchQuery, priceRange, sortBy, allProducts]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
      
      {/* SIDEBAR FILTERS */}
      <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block">
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
            <Filter className="w-5 h-5" /> Filters
          </h3>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block text-gray-700">Max Price: ₹{priceRange.toLocaleString()}</label>
            <input 
              type="range" 
              min="100" 
              max="200000" 
              step="1000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006a55]" 
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm mb-2 text-gray-900">Categories</h4>
            {['Mobiles', 'Cases', 'Screen Guards', 'Chargers', 'Accessories'].map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <input type="checkbox" id={cat} className="rounded border-gray-300 text-[#006a55] focus:ring-[#006a55] accent-[#006a55]" />
                <label htmlFor={cat} className="text-sm text-gray-600 cursor-pointer hover:text-[#006a55]">{cat}</label>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold capitalize text-gray-800">
            {searchQuery ? `Search results for "${searchQuery}"` : (slug === 'shop' ? 'All Products' : `${slug} Collection`)}
          </h1>
          <div className="relative">
             <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border-2 border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-[#006a55]">
               <option value="newest">Featured (Mobiles First)</option>
               <option value="price-low">Price: Low to High</option>
               <option value="price-high">Price: High to Low</option>
             </select>
             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group relative bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:border-[#006a55]/20">
                
                <Link href={`/product/${product._id}`} className="block h-full">
                  <div className="relative aspect-square bg-[#F5F5F7]">
                    <Image src={getProductImage(product)} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 pb-16 flex flex-col flex-1"> 
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{product.brand}</p>
                    <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
                    </div>
                    <div className="mt-auto">
                      <span className="text-lg font-bold text-[#006a55]">₹{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>

                <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    addToCart({ ...product, image: getProductImage(product) });
                  }}
                  className="absolute bottom-4 right-4 bg-[#006a55] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#005544] transition-colors z-10"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-gray-400">No products found.</h2>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}