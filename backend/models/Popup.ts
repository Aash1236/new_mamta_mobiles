import mongoose from "mongoose";

const popupSchema = new mongoose.Schema({
  title: { type: String, default: "Huge Sale is Live!" },
  subtitle: { type: String, default: "Get up to 50% OFF on all premium mobile accessories." },
  image: { type: String, default: "" }, // Banner Image URL
  link: { type: String, default: "/shop/all" },
  isActive: { type: Boolean, default: false }, // Master Switch
}, { timestamps: true });

export default mongoose.models.Popup || mongoose.model("Popup", popupSchema);