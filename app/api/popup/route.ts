import { NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Popup from "@/backend/models/Popup";

// GET Popup Data
export async function GET() {
  await connectDB();
  try {
    let popup = await Popup.findOne();
    if (!popup) {
      // Create default if doesn't exist
      popup = await Popup.create({});
    }
    return NextResponse.json(popup);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// UPDATE Popup Data
export async function PUT(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    // We use findOneAndUpdate with upsert to ensure we always edit the single record
    const updated = await Popup.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json({ success: true, popup: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}