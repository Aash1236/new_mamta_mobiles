import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    console.log("🔍 Fetching orders for user:", email);

    // Case-insensitive search for the user's orders
    const orders = await Order.find({ 
      "customer.email": { $regex: new RegExp(`^${email}$`, "i") } 
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${orders.length} orders for ${email}`);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}