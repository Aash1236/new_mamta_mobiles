import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";

// 1. GET: Fetch ALL Orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 2. POST: Create a new Order
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Create and Save
    const newOrder = new Order(body);
    await newOrder.save();

    return NextResponse.json({ 
      message: "Order placed successfully", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Order Error:", error); // Check your VS Code Terminal for this!
    
    // Return the actual error message to the frontend
    return NextResponse.json({ 
      error: error.message || "Failed to place order" 
    }, { status: 500 });
  }
}