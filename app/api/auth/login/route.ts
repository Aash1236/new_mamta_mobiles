import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.password) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // ✅ FIX: Send the token (user._id) in the body AND the cookie
    const token = user._id.toString();

    const response = NextResponse.json({ 
      message: "Login successful",
      token: token, // <--- SENDING TOKEN TO FRONTEND
      user: { name: user.name, email: user.email, role: user.role }
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Keep Cookie for Middleware/Admin
    response.cookies.set("user_token", token, {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: "lax",
    });

    if (user.role === "admin") {
      response.cookies.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: isProduction,
        path: "/",
        sameSite: "lax",
      });
    }

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}