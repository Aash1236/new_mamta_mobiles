import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Banner from "@/backend/models/Banner";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}