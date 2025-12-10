import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers"; // Import headers
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Try Cookie first
    const cookieStore = await cookies();
    let token = cookieStore.get("user_token")?.value;

    // 2. If Cookie is missing, try Authorization Header (Hybrid Fix)
    if (!token) {
      const headerList = await headers();
      const authHeader = headerList.get("authorization");
      if (authHeader) {
        token = authHeader; // Use the token from the header
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(token).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}