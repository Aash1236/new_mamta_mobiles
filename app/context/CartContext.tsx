"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("mamta-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mamta-cart", JSON.stringify(cart));
  }, [cart]);

  // FIXED ADD TO CART
  const addToCart = (product: any) => {
    // 1. Check if item exists using the current state directly
    const existingItem = cart.find((item) => item.id === product._id);
    
    // 2. Trigger the Toast OUTSIDE the set state function
    if (existingItem) {
      toast.success(`Added one more ${product.name}`);
    } else {
      toast.success(`${product.name} added to cart!`);
    }

    // 3. Update State
    setCart((prevCart) => {
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { 
          id: product._id, 
          name: product.name, 
          price: product.price, 
          image: product.image, 
          quantity: 1 
        }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.error("Item removed from cart");
  };

  const incrementItem = (id: string) => {
    setCart((prev) => 
      prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decrementItem = (id: string) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item;
        }
        return item;
      })
    );
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementItem, decrementItem, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}