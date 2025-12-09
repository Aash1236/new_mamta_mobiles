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
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 2. POST: Create a new Order
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // FIX: Use 'new Order().save()' instead of 'create()' to guarantee a single document
    const newOrder = new Order(body);
    await newOrder.save();

    return NextResponse.json({ 
      message: "Order placed successfully", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}