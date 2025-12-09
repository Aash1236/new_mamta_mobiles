import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  // Check against the env variable
  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Set a secure cookie
    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true, // JavaScript cannot read this (Security)
      secure: process.env.NODE_ENV === "production", // Only HTTPS in prod
      path: "/",
      maxAge: 60 * 60 * 24, // Expires in 1 day
    });
    
    return response;
  }

  return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
}