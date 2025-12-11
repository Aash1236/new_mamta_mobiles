"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppBtn() {
  // Replace with Client's WhatsApp Number
  const phoneNumber = "918055610899"; 
  const message = "Hi Mamta Mobiles, I need help with an order.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-short hover:shadow-green-500/50"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
      {/* Optional: Online Dot */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
    </a>
  );
}