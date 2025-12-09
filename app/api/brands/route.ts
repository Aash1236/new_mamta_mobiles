import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Brand from "@/backend/models/Brand";

// GET: Fetch all brands (For Homepage & Admin)
export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find().sort({ createdAt: -1 });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

// POST: Add a new brand
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, logo } = await request.json();

    // Auto-generate slug (e.g., "Nothing Phone" -> "nothing-phone")
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const newBrand = await Brand.create({ name, slug, logo });
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add brand" }, { status: 500 });
  }
}