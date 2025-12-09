"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, incrementItem, decrementItem } = useCart();
  
  // State for calculations
  const [basePrice, setBasePrice] = useState(0); // Price before Tax
  const [gstAmount, setGstAmount] = useState(0); // The Tax component
  const [finalTotal, setFinalTotal] = useState(0); // The Amount to Pay

  // Calculate Prices (Inclusive of Tax)
  useEffect(() => {
    // 1. Calculate the total amount the user actually pays (MRP)
    const totalMRP = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // 2. Back-calculate GST (Assuming 18% is included in the MRP)
    // Formula: GST Component = Total * (18 / 118)
    const calculatedGST = totalMRP * (18 / 118);
    
    // 3. Base Price (Price without tax)
    const calculatedBase = totalMRP - calculatedGST;

    setBasePrice(calculatedBase);
    setGstAmount(calculatedGST);
    setFinalTotal(totalMRP);
  }, [cart]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#006a55]" />
            Your Cart <span className="text-gray-400 text-sm font-normal">({cart.length} items)</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="h-[calc(100vh-320px)] overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
              <button onClick={onClose} className="bg-[#006a55] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#005544] transition-colors shadow-lg shadow-[#006a55]/20 mt-4">
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                {/* Item Image */}
                <div className="relative w-20 h-20 bg-[#F5F5F7] rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                
                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 pr-2">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[#006a55] font-bold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 self-start mt-2">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button 
                        onClick={() => decrementItem(item.id)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => incrementItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary Section */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full bg-white border-t-2 border-gray-100 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="space-y-3 mb-6">
              
              {/* Price Breakdown */}
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Subtotal (Base Price)</span>
                <span>₹{basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>GST (18% Included)</span>
                <span>₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-[#006a55] text-sm font-medium">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              {/* Final Total */}
              <div className="pt-3 border-t-2 border-gray-100 flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total to Pay</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
              
              <p className="text-[10px] text-gray-400 text-center">
                Inclusive of all taxes
              </p>
            </div>
            
            {/* CHECKOUT BUTTON - Closes drawer and navigates */}
            <Link href="/checkout" onClick={onClose} className="block w-full">
              <button className="w-full bg-[#006a55] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005544] transition-all shadow-lg shadow-[#006a55]/20 active:scale-95">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}