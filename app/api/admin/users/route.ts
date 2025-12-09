import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

export async function GET() {
  try {
    await connectDB();
    // Fetch all users, but hide passwords
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}