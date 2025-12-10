import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ 
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role }
    });

    // ✅ FIX: Add 'secure' and 'sameSite' flags for Vercel
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("user_token", user._id.toString(), {
      httpOnly: true,
      path: "/",
      secure: isProduction, // ✅ REQUIRED for HTTPS
      sameSite: "lax",      // ✅ Recommended for login handling
      // No maxAge (Session Cookie)
    });

    if (user.role === "admin") {
      response.cookies.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: isProduction, // ✅ REQUIRED for HTTPS
        path: "/",
        sameSite: "lax",
      });
    }

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}