import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Prepare Response
    const response = NextResponse.json({ 
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role }
    });

    // 4. Set USER Token (For everyone)
    response.cookies.set("user_token", user._id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    // 5. Set ADMIN Token (Only if role is 'admin')
    if (user.role === "admin") {
      response.cookies.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 Day
      });
    }

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}