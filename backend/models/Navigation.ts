import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavigation extends Document {
  type: string;
  title: string;
  items: string[];
  image?: string; // ✅ Added Image Field
}

const NavigationSchema: Schema = new Schema(
  {
    type: { type: String, required: true, enum: ["device", "category"] },
    title: { type: String, required: true },
    items: { type: [String], default: [] },
    image: { type: String }, // ✅ Added Image Field
  },
  { timestamps: true }
);

const Navigation: Model<INavigation> =
  mongoose.models.Navigation || mongoose.model<INavigation>("Navigation", NavigationSchema);

export default Navigation;