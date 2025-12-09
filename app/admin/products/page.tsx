"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, Plus, Trash2, Edit, Package } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts(); // Refresh list
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Helper to get safe image
  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return "https://placehold.co/600x600?text=No+Image";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#006a55]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <Toaster position="bottom-center" />
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Products</h1>
            <p className="text-gray-500">View, edit, or delete items from your inventory.</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/admin/add-product">
              <button className="flex items-center gap-2 bg-[#006a55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 active:scale-95">
                <Plus className="w-5 h-5" /> Add New
              </button>
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-2 text-sm font-bold text-[#006a55] hover:bg-[#006a55]/5 border-2 border-[#006a55] px-5 py-2.5 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#006a55] text-white">
                <tr>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Product</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Category</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Price</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider">Stock</th>
                  <th className="p-4 text-sm font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <Image src={getProductImage(product)} alt={product.name} fill className="object-contain p-1" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 capitalize">{product.category}</td>
                      <td className="p-4 text-sm font-bold text-[#006a55]">₹{product.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* We will build the edit page next */}
                          <Link href={`/admin/edit-product/${product._id}`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}