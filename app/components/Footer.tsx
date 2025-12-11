"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  
  // ✅ Defined links locally to ensure they point to the correct new pages
  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop/all' },
      { name: 'New Arrivals', href: '/shop/all' }, 
      { name: 'Best Sellers', href: '/shop/all' },
    ],
    support: [
      { name: 'My Account', href: '/profile' },
      { name: 'Track Order', href: '/profile' },
      // ✅ CONNECTED LEGAL PAGES
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Refund Policy', href: '/refund-policy' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Partner With Us', href: '/partner' },
      { name: 'Warranty Policy', href: '/warranty' },
    ]
  };

  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-4">
        
        {/* TOP SECTION: Brand & Newsletter */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 border-b border-gray-800 pb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-wide uppercase font-exo text-[#2CA089]">
              Mamta <span className="text-white text-lg tracking-[0.3em] font-medium">Mobiles</span>
            </h2>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              India&apos;s Next Gen Mobile Accessory Brand. We provide premium protection and style for your beloved devices.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2CA089] transition-colors group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2CA089] transition-colors group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2CA089] transition-colors group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-2">Stay in the loop</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive offers and new launches.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-none text-white px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-[#2CA089] outline-none placeholder:text-gray-500"
              />
              <button className="bg-[#2CA089] text-white px-6 py-3 rounded-lg hover:bg-[#23806d] transition-colors font-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Shop Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#2CA089]">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#2CA089]">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#2CA089]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#2CA089]">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-[#2CA089] shrink-0" />
                <span>Shop No 1, Mamta Mobiles, Near Bus Stand, Pune, Maharashtra</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-[#2CA089] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-[#2CA089] shrink-0" />
                <span>support@mamtamobiles.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2025 New Mamta Mobiles. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Payment Icons Placeholder */}
            <div className="h-6 w-10 bg-gray-700 rounded flex items-center justify-center text-[8px] text-gray-400">VISA</div>
            <div className="h-6 w-10 bg-gray-700 rounded flex items-center justify-center text-[8px] text-gray-400">UPI</div>
            <div className="h-6 w-10 bg-gray-700 rounded flex items-center justify-center text-[8px] text-gray-400">COD</div>
          </div>
        </div>
      </div>
    </footer>
  );
}