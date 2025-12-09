import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { role } = await request.json();

    // --- SECURITY CHECK START ---
    // 1. Get the ID of the person making the request
    const cookieStore = await cookies();
    const requesterId = cookieStore.get("user_token")?.value;

    if (!requesterId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find the Requester in DB
    const requester = await User.findById(requesterId);
    if (!requester) {
      return NextResponse.json({ error: "Requester not found" }, { status: 401 });
    }

    // 3. Verify Requester is the Super Admin
    // Only the Super Admin email defined in .env.local is allowed to change roles
    if (requester.email !== process.env.SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Access Denied. Only the Super Admin can change roles." }, 
        { status: 403 }
      );
    }
    // --- SECURITY CHECK END ---

    // 4. Update the target user
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}