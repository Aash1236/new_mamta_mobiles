import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

// ✅ THE FIX: Force Dynamic to disable Vercel caching
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(token.value).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}