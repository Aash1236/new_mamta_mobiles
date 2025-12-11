import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";

// 1. GET ALL ORDERS (For Admin & Profile)
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    let orders;
    if (email) {
      // Fetch user specific orders
      orders = await Order.find({ "customer.email": email }).sort({ createdAt: -1 });
    } else {
      // Fetch ALL orders for Admin
      orders = await Order.find().sort({ createdAt: -1 });
    }
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 2. CREATE NEW ORDER (For Checkout)
export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const newOrder: any = await Order.create(body);
    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}

// 3. ✅ NEW: UPDATE ORDER STATUS (Fixes 405 Error)
export async function PUT(request: Request) {
  await connectDB();
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}