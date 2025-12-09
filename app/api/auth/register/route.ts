import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}