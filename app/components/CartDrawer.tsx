"use client";

import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  if (!mounted) return null;

  const subtotal = getCartTotal();
  const tax = subtotal * 0.18; 
  const finalTotal = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#006a55]" />
            <h2 className="text-xl font-bold text-gray-900">Your Cart ({cart.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 h-[calc(100vh-250px)]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg">Your cart is empty</p>
                <p className="text-gray-500 text-sm">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <button onClick={onClose} className="mt-4 px-6 py-2 bg-[#006a55] text-white rounded-full font-bold text-sm hover:bg-[#005544] transition-all">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                
                // ✅ FIX 2: Robust Image Logic for Cart
                let validImage = "https://via.placeholder.com/150?text=No+Image";

                // Check if main image string exists and is not empty
                if (item.image && typeof item.image === 'string' && item.image.trim() !== "") {
                    validImage = item.image;
                } 
                // Fallback to images array if main image string is missing/empty
                else if (item.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0].trim() !== "") {
                    validImage = item.images[0];
                }

                return (
                  <div key={item._id} className="flex gap-4 group">
                    {/* Image */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <Image 
                        src={validImage} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-2 mix-blend-multiply" 
                        unoptimized={true} 
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-relaxed">{item.name}</h3>
                          <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[#006a55] font-bold mt-1">₹{item.price.toLocaleString()}</p>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg h-8 w-fit bg-white">
                          <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="px-3 h-full hover:bg-gray-100 text-gray-600 rounded-l-lg">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 h-full hover:bg-gray-100 text-gray-600 rounded-r-lg">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-5 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-[#006a55] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-[#006a55]/20">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}