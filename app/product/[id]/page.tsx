import { Metadata } from "next";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // ✅ FIX: dynamic base URL that works on Vercel AND Localhost
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // Fetch product data safely
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' });
    
    if (!res.ok) {
      return { title: "Product Not Found | Mamta Mobiles" };
    }

    const product = await res.json();

    return {
      title: `${product.name} | Mamta Mobiles`,
      description: `Buy ${product.name} at the best price.`,
      openGraph: {
        images: [product.image || '/logo.png'],
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return { title: "Mamta Mobiles Store" }; // Fallback title so page doesn't crash
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductClient id={id} />;
}