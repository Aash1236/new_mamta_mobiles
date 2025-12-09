import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Brand from "@/backend/models/Brand";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Brand.findByIdAndDelete(id);
    return NextResponse.json({ message: "Brand deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}