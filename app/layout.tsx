import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "New Mamta Mobiles",
  description: "India's Next Gen Mobile Accessory Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <CartProvider>
          {/* 2. ADD TOASTER HERE */}
          <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
          
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}