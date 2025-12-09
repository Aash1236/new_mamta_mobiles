import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Navigation from "@/backend/models/Navigation";

// GET: Fetch all menu items
export async function GET() {
  try {
    await connectDB();
    const navItems = await Navigation.find({});
    return NextResponse.json(navItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch navigation" }, { status: 500 });
  }
}

// POST: Add a new Menu Group (e.g. "Apple")
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newItem = await Navigation.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}