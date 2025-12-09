import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Await params for Next.js 15
    
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Order ID" }, { status: 500 });
  }
}

// --- NEW: PUT (Update Status) ---
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json(); // Get new status from body

    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true } // Return the updated document
    );

    if (!updatedOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}