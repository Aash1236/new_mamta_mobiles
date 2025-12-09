import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Banner from "@/backend/models/Banner";

// GET: Fetch all banners
export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST: Add a new banner
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newBanner = await Banner.create(body);
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add banner" }, { status: 500 });
  }
}