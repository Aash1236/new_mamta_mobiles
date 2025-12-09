import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Product from "@/backend/models/Product";

// 1. GET: Fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products || []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. POST: Add Single Product OR Seed Database
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // CHECK: Is this a Bulk Seed (Array) or Single Add (Object)?
    if (Array.isArray(body)) {
      // SEED LOGIC (Keep existing behavior for bulk)
      await Product.deleteMany({});
      await Product.insertMany(body);
      return NextResponse.json({ message: "Database seeded successfully!" });
    } else {
      // SINGLE ADD LOGIC (New)
      const newProduct = await Product.create(body);
      return NextResponse.json({ 
        message: "Product added successfully", 
        product: newProduct 
      }, { status: 201 });
    }

  } catch (error) {
    console.error("Product API Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}