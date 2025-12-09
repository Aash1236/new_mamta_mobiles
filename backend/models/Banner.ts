import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle: string;
  image: string; // Cloudinary URL
  link: string;  // Where the button clicks to (e.g. "/shop/mobiles")
  active: boolean;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String, default: "/shop" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;