import { Metadata } from "next";
import ProductClient from "./ProductClient"; // ✅ Import the UI component we just made

// 1. Generate Dynamic Metadata (Server Side)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Fetch product data for SEO tags
  const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`).then((res) => res.json());

  return {
    title: `${product.name} | Mamta Mobiles`,
    description: `Buy ${product.name} at the best price. ${product.description}`,
    openGraph: {
      images: [product.image],
    },
  };
}

// 2. Main Page Component (Server Side)
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Render the Client Component and pass the ID
  return <ProductClient id={id} />;
}